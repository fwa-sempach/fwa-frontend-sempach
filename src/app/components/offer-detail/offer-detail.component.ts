import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Offer } from '@app/shared/models/offer';
import { Organisation } from '@app/shared/models/organisation';
import { OfferService } from '@app/shared/services/offer/offer.service';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';

@Component({
  selector: 'fwas-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.scss']
})
export class OfferDetailComponent implements OnInit {

  isError = false;
  notFound = false;

  offer: Offer;
  organisation: Organisation;

  constructor(
    private route: ActivatedRoute,
    private _offer: OfferService,
    private _organisation: OrganisationService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const offerId = params.get('id');
      this._offer.readById(+offerId).subscribe(
        data => {
          this.offer = data;
          this.readOrganisation();
        },
        error => {
          this.isError = true;
          if (error.status === 404) {
            this.notFound = true;
          }
        }
      );
    });
  }

  private readOrganisation() {
    this._organisation.readById(this.offer.organisation.id).subscribe(
      data => {
        this.organisation = data;
      },
      err => {
        this.isError = true;
      }
    );
  }
}
