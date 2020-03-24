import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ParticipantState } from '@app/shared/enums/participantState';
import { Ad } from '@app/shared/models/ad';
import { Image } from '@app/shared/models/image';
import { Offer } from '@app/shared/models/offer';
import { Organisation } from '@app/shared/models/organisation';
import { Participant } from '@app/shared/models/participant';
import { AdService } from '@app/shared/services/ad/ad.service';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { OfferService } from '@app/shared/services/offer/offer.service';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';
import { ParticipantService } from '@app/shared/services/participant/participant.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'fwas-manage-organisation',
  templateUrl: './manage-organisation.component.html',
  styleUrls: ['./manage-organisation.component.scss'],
})
export class ManageOrganisationComponent implements OnInit {
  organisation: Organisation;

  offers: Array<Offer>;
  currentOffer: Offer;

  ads: Array<Ad>;
  currentAd: Ad;

  participants: Array<Participant>;
  currentParticipant: Participant;

  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private _organisation: OrganisationService,
    private _offer: OfferService,
    private _ad: AdService,
    private _participant: ParticipantService,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this.isAdmin = this._auth.hasRole('ADMIN');

    this.route.paramMap.subscribe((params: ParamMap) => {
      const organisationId = +params.get('id');

      const organisationObs = this._organisation.readById(organisationId);
      const offerObs = this._offer.readFiltered(
        [],
        [organisationId],
        1,
        1000000
      );
      const adObs = this._ad.readFiltered([], [organisationId], 1, 1000000);
      const participantObs = this._participant.readFiltered(
        organisationId,
        [],
        [],
        1,
        1000000
      );

      forkJoin([organisationObs, offerObs, adObs, participantObs]).subscribe(
        (results) => {
          this.organisation = results[0];
          this.offers = <Array<Offer>>results[1].elements;
          this.ads = <Array<Ad>>results[2].elements;
          this.participants = <Array<Participant>>results[3].elements;
        }
      );
    });
  }

  adTitle(adId: number) {
    return this.ads.filter((ad) => ad.id === adId).map((ad) => ad.title)[0];
  }

  statusText(status: string) {
    return ParticipantState[status];
  }

  addOffer() {
    const newOffer = new Offer();
    newOffer.organisation = this.organisation;
    newOffer.contactPerson = this.organisation.contactPerson;
    delete newOffer.contactPerson.id;
    this.setCurrentOffer(newOffer);
  }

  editOffer(offerId: number) {
    this._offer.readById(offerId).subscribe((data) => {
      this.setCurrentOffer(data);
    });
  }

  cancelOfferEditing($event) {
    this.setCurrentOffer(null);
  }

  changedOffer($event) {
    const offer: Offer = $event;
    const offers = this.offers.filter((o) => o.id !== offer.id);
    if (!offer.deleted) {
      offers.push(offer);
    } else {
      this.currentOffer = null;
    }
    this.offers = offers.sort((a, b) => (a.title > b.title ? -1 : 1));
  }

  private setCurrentOffer(offer: Offer) {
    if (offer && this.currentOffer && offer.id === this.currentOffer.id) {
      this.currentOffer = null;
    } else {
      this.currentOffer = offer;
    }
  }

  addAd() {
    const newAd = new Ad();
    const offer = new Offer();
    offer.organisation = this.organisation;
    newAd.offer = offer;
    newAd.numberOfVolunteersNeeded = 1;
    newAd.releaseDate = new Date();
    const da = new Date();
    da.setDate(da.getDate() + 5);
    newAd.validUntil = da;

    newAd.offer.organisation = this.organisation;
    this.setCurrentAd(newAd);
  }

  editAd(adId: number) {
    this._ad.readById(adId).subscribe((data) => {
      this.setCurrentAd(data);
    });
  }

  cancelAdEditing($event) {
    this.setCurrentAd(null);
  }

  changedAd($event) {
    const ad: Ad = $event;
    const ads = this.ads.filter((o) => o.id !== ad.id);
    if (!ad.deleted) {
      ads.push(ad);
    } else {
      this.currentAd = null;
    }
    this.ads = ads.sort((a, b) => (a.title > b.title ? -1 : 1));
  }

  private setCurrentAd(ad: Ad) {
    if (ad && this.currentAd && ad.id === this.currentAd.id) {
      this.currentAd = null;
    } else {
      this.currentAd = ad;
    }
  }

  addParticipant() {
    const newParticipant = new Participant();
    newParticipant.organisationId = this.organisation.id;
    this.setCurrentParticipant(newParticipant);
  }

  editParticipant(participantId: number) {
    this._participant
      .readById(participantId, this.organisation.id)
      .subscribe((data) => {
        this.setCurrentParticipant(data);
      });
  }

  cancelParticipantEditing($event) {
    this.setCurrentParticipant(null);
  }

  changedParticipant($event) {
    const participant: Participant = $event;
    const participants = this.participants.filter(
      (o) => o.id !== participant.id
    );
    if (!participant.deleted) {
      participants.push(participant);
    } else {
      this.currentParticipant = null;
    }
    this.participants = participants.sort((a, b) =>
      a.person.firstname > b.person.firstname ? -1 : 1
    );
  }

  private setCurrentParticipant(participant: Participant) {
    if (
      participant &&
      this.currentParticipant &&
      participant.id === this.currentParticipant.id
    ) {
      this.currentParticipant = null;
    } else {
      this.currentParticipant = participant;
    }
  }

  updateImage(imageUrl: string) {
    this.organisation.image.imageUrl = imageUrl;
  }
}
