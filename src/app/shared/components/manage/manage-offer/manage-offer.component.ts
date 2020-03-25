import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '@app/shared/models/category';
import { Offer } from '@app/shared/models/offer';
import { Organisation } from '@app/shared/models/organisation';
import { Person } from '@app/shared/models/person';
import { CategoryService } from '@app/shared/services/category/category.service';
import { FormService } from '@app/shared/services/form/form.service';
import { OfferService } from '@app/shared/services/offer/offer.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'fwas-manage-offer',
  templateUrl: './manage-offer.component.html',
  styleUrls: ['./manage-offer.component.scss'],
})
export class ManageOfferComponent implements OnInit, OnChanges {
  @Input()
  offer: Offer;
  @Input()
  organisation: Organisation;
  @Output()
  cancelOffer = new EventEmitter();
  @Output()
  changedOffer = new EventEmitter();

  offerForm: FormGroup;
  categories: Array<Category>;

  submitted = false;
  deleted = false;
  sureDelete = false;

  validationTrigger = 0;
  quillOptions = environment.quillOptions;

  constructor(
    private fb: FormBuilder,
    private _category: CategoryService,
    private _offer: OfferService,
    private toastr: ToastrService,
    private _form: FormService
  ) {}

  ngOnInit() {
    const categoryObs = this._category.readAll();

    forkJoin([categoryObs]).subscribe((results) => {
      this.categories = results[0];
    });

    this.createForm();
  }

  ngOnChanges() {
    this.createForm();
    this.submitted = false;
    this.sureDelete = false;
  }

  private createForm() {
    this.offerForm = this.fb.group({
      id: [this.offer.id],
      title: [
        this.offer.title,
        [Validators.required, Validators.maxLength(50)],
      ],
      description: [
        this.offer.description,
        [Validators.required, Validators.maxLength(1000)],
      ],
      organisation: this.fb.group({
        id: [this.getOrganisationId()],
      }),
      category: this.fb.group({
        id: [this.getCategoryId(), [Validators.required]],
      }),
      active: [this.offer.active],
    });
  }

  get f() {
    return this.offerForm.controls;
  }

  copyPersonFromOrgToOffer() {
    const person = Object.create(this.organisation.contactPerson);
    person.id = this.offer.contactPerson.id;
    this.offer.contactPerson = person;
  }

  delete() {
    if (!this.sureDelete) {
      this.sureDelete = true;
    } else {
      this.deleted = true;
      this._offer
        .delete(this.offer)
        .finally(() => (this.deleted = false))
        .subscribe(
          (data) => {
            this.offer.deleted = true;
            this.changedOffer.emit(this.offer);
            this.toastr.success('Das Angebot wurde erfolgreich gelöscht.');
          },
          (error) => {
            this.toastr.error(
              'Das Angebot konnte nicht gelöscht werden.',
              'Fehler',
              { timeOut: 0 }
            );
          }
        );
    }
  }

  save() {
    this._form.markFormGroupTouched(this.offerForm);
    this.validationTrigger++;

    if (this.offerForm.valid) {
      this.submitted = true;
      const offerToSave: Offer = this.offerForm.value;

      if (offerToSave.id) {
        this._offer
          .update(offerToSave)
          .finally(() => (this.submitted = false))
          .subscribe(
            (data) => {
              this.postSave(data);
            },
            (err) => {
              this.toastr.error(
                'Das Angebot konnte nicht gespeichert werden.',
                'Fehler',
                { timeOut: 0 }
              );
            }
          );
      } else {
        this._offer
          .save(offerToSave)
          .finally(() => (this.submitted = false))
          .subscribe(
            (data) => {
              this.postSave(data);
            },
            (err) => {
              this.toastr.error(
                'Das Angebot konnte nicht gespeichert werden.',
                'Fehler',
                { timeOut: 0 }
              );
            }
          );
      }
    }
  }

  private postSave(data) {
    this.offer = data;
    this.createForm();
    this.changedOffer.emit(this.offer);
    this.toastr.success('Das Angebot wurde erfolgreich gespeichert.');
  }

  reset() {
    this.createForm();
  }

  cancel() {
    this.offer = new Offer();
    this.createForm();
    this.cancelOffer.emit();
  }

  private getOrganisationId() {
    return this.offer.organisation ? this.offer.organisation.id : null;
  }

  private getCategoryId() {
    return this.offer.category ? this.offer.category.id : null;
  }
}
