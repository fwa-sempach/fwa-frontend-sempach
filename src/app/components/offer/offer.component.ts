import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Category } from '@app/shared/models/category';
import { InfoWrapper } from '@app/shared/models/infoWrapper';
import { Offer } from '@app/shared/models/offer';
import { Organisation } from '@app/shared/models/organisation';
import { CategoryService } from '@app/shared/services/category/category.service';
import { OfferService } from '@app/shared/services/offer/offer.service';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';
import { forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'fwas-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
})
export class OfferComponent implements OnInit {
  isError = false;

  @Input()
  organisationId: number;
  isSingleOrganisation: boolean;

  categories = new Array<Category>();
  organisations = new Array<Organisation>();

  page = 1;
  pageSize = 5;
  totalPages: number;

  offers: Array<Offer>;
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private organisationService: OrganisationService,
    private offerService: OfferService
  ) {}

  ngOnInit() {
    this.isSingleOrganisation = this.organisationId !== undefined;

    this.createForm();
    this.readOffers(this.page);

    const categoryObs = this.categoryService.readAll();
    const organisationObs = this.organisationService.readAll();

    // run multiple observables in parallel
    forkJoin([categoryObs, organisationObs]).subscribe(
      (results) => {
        this.categories = results[0];
        this.organisations = (results[1] as InfoWrapper<Organisation>).elements;
        this.createForm();
      },
      (error) => {
        this.isError = true;
      }
    );
  }

  private previousPage() {
    this.readOffers(this.page - 1);
  }

  private nextPage() {
    this.readOffers(this.page + 1);
  }

  private readOffers(pageNumber: number) {
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

    this.offerService
      .readFiltered(
        categoryIds,
        organisationIds,
        pageNumber,
        this.pageSize,
        true
      )
      .subscribe(
        (data) => {
          this.offers = data.elements;
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
          this.readOffers(1);
        },
        (error) => {
          this.isError = true;
        }
      );
  }

  createCategoryArray(): FormArray {
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
