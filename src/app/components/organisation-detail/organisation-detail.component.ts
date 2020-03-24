import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Organisation } from '@app/shared/models/organisation';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';

@Component({
  selector: 'fwas-organisation-detail',
  templateUrl: './organisation-detail.component.html',
  styleUrls: ['./organisation-detail.component.scss'],
})
export class OrganisationDetailComponent implements OnInit {
  isError = false;
  notFound = false;

  organisation: Organisation;

  constructor(
    private route: ActivatedRoute,
    private _organisation: OrganisationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const organisationId = params.get('id');
      this._organisation.readById(+organisationId).subscribe(
        (data) => {
          this.organisation = data;
        },
        (error) => {
          this.isError = true;
          if (error.status === 404) {
            this.notFound = true;
          }
        }
      );
    });
  }
}
