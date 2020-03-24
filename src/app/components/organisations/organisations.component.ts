import { Component, OnInit } from '@angular/core';
import { Organisation } from '@app/shared/models/organisation';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';

@Component({
  selector: 'fwas-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss'],
})
export class OrganisationsComponent implements OnInit {
  constructor(private _organisations: OrganisationService) {}

  isError = false;

  page = 1;
  pageSize = 5;
  totalPages: number;

  organisations = new Array<Organisation>();

  ngOnInit() {
    this.readOrganisations(this.page);
  }

  private previousPage() {
    this.readOrganisations(this.page - 1);
  }

  private nextPage() {
    this.readOrganisations(this.page + 1);
  }

  private readOrganisations(pageNumber: number) {
    this._organisations.readFiltered(pageNumber, this.pageSize).subscribe(
      (data) => {
        this.organisations = data.elements;
        this.page = pageNumber;
        this.totalPages = Math.ceil(data.totalCount / this.pageSize);
      },
      (error) => {
        this.isError = true;
      }
    );
  }
}
