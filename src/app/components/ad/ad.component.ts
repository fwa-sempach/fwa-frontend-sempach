import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Ad } from '@app/shared/models/ad';
import { Category } from '@app/shared/models/category';
import { InfoWrapper } from '@app/shared/models/infoWrapper';
import { Organisation } from '@app/shared/models/organisation';
import { AdService } from '@app/shared/services/ad/ad.service';
import { CategoryService } from '@app/shared/services/category/category.service';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';
import { forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'fwas-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss'],
})
export class AdComponent implements OnInit {
  isError = false;

  @Input()
  organisationId: number;
  isSingleOrganisation: boolean;

  page = 1;
  pageSize = 5;
  totalPages: number;

  categories = new Array<Category>();
  organisations = new Array<Organisation>();
  ads: Array<Ad>;
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private organisationService: OrganisationService,
    private adService: AdService
  ) {}

  ngOnInit() {
    this.isSingleOrganisation = this.organisationId !== undefined;

    this.createForm();
    this.readAds(this.page);

    const categoryObs = this.categoryService.readAll();
    const organisationObs = this.organisationService.readAll();

    // run multiple observables in parallel
    forkJoin([categoryObs, organisationObs]).subscribe(
      (results) => {
        this.categories = results[0];
        this.organisations = (<InfoWrapper<Organisation>>results[1]).elements;
        this.createForm();
      },
      (error) => {
        this.isError = true;
      }
    );
  }

  private previousPage() {
    this.readAds(this.page - 1);
  }

  private nextPage() {
    this.readAds(this.page + 1);
  }

  private readAds(pageNumber: number) {
    let organisationIds;
    if (this.isSingleOrganisation) {
      organisationIds = [this.organisationId];
    } else {
      organisationIds =
        this.filterForm.value.organisations > 0
          ? [this.filterForm.value.organisations]
          : [];
    }

    const categoryIds = this.filterForm.value.categories
      .filter((c) => c.selected)
      .map((c) => c.category.id);

    this.adService
      .readFiltered(
        categoryIds,
        organisationIds,
        pageNumber,
        this.pageSize,
        true
      )
      .subscribe(
        (data) => {
          this.ads = data.elements;
          this.page = pageNumber;

          this.totalPages = Math.ceil(data.totalCount / this.pageSize);
        },
        (error) => {
          this.isError = true;
        }
      );
  }

  private createForm() {
    this.organisations.unshift({
      id: 0,
      name: 'Alle',
      userId: null,
      contactPerson: null,
      websiteUrl: null,
      description: null,
      verified: null,
      deleted: null,
      image: null,
    });

    this.filterForm = this.fb.group({
      categories: this.createCategoryArray(),
      organisations: 0,
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(
        (f) => {
          this.readAds(1);
        },
        (error) => {
          this.isError = true;
        }
      );
  }

  private createCategoryArray(): FormArray {
    const categoryArray = this.categories.map((c) =>
      this.fb.group({
        category: c,
        selected: false,
      })
    );
    return this.fb.array(categoryArray);
  }

  get categoryFormArray(): FormArray {
    return this.filterForm.get('categories') as FormArray;
  }
}
