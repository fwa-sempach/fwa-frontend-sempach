import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Ad } from '@app/shared/models/ad';
import { Organisation } from '@app/shared/models/organisation';
import { Participant } from '@app/shared/models/participant';
import { AdService } from '@app/shared/services/ad/ad.service';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';

@Component({
  selector: 'fwas-ad-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.scss'],
})
export class AdDetailComponent implements OnInit {
  isError = false;
  notFound = false;
  isFormVisible = false;
  showThankYou = false;

  ad: Ad;
  organisation: Organisation;

  constructor(
    private route: ActivatedRoute,
    private _ad: AdService,
    private _organisation: OrganisationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const adId = params.get('id');
      this._ad.readById(+adId).subscribe(
        (data) => {
          this.ad = data;
          this.readOrganisation();
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

  private readOrganisation() {
    this._organisation.readById(this.ad.offer.organisation.id).subscribe(
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
  }

  showForm() {
    this.isFormVisible = true;
  }

  hideForm(participant: Participant) {
    this.isFormVisible = false;
    this.showThankYou = true;
  }
}
