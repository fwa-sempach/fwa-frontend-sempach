import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Ad } from '@app/shared/models/ad';
import { Offer } from '@app/shared/models/offer';
import { Task } from '@app/shared/models/task';
import { AdService } from '@app/shared/services/ad/ad.service';
import { FormService } from '@app/shared/services/form/form.service';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fwas-manage-ad',
  templateUrl: './manage-ad.component.html',
  styleUrls: ['./manage-ad.component.scss'],
})
export class ManageAdComponent implements OnInit, OnChanges {
  @Input()
  ad: Ad;
  @Input()
  offers: Array<Offer>;
  @Output()
  cancelAd = new EventEmitter();
  @Output()
  changedAd = new EventEmitter();

  adForm: FormGroup;

  submitted = false;
  deleted = false;
  sureDelete = false;

  validationTrigger = 0;

  constructor(
    private fb: FormBuilder,
    private _ad: AdService,
    private toastr: ToastrService,
    private _form: FormService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges() {
    this.createForm();
    this.submitted = false;
    this.sureDelete = false;
  }

  private createForm() {
    this.adForm = this.fb.group(
      {
        id: [this.ad.id],
        title: [this.ad.title, [Validators.required, Validators.maxLength(50)]],
        numberOfVolunteersNeeded: [
          this.ad.numberOfVolunteersNeeded,
          [Validators.required, Validators.pattern(/^\d*$/)],
        ],
        releaseDate: [new Date(this.ad.releaseDate), [Validators.required]],
        validUntil: [new Date(this.ad.validUntil), [Validators.required]],
        offer: [this.ad.offer, [Validators.required]],
        active: [this.ad.active],
        // todo: task, BC validator
        tasks: [this.ad.tasks, [Validators.required]],
        basicConditions: [this.ad.basicConditions, [Validators.required]],
      },
      {
        validator: dateOrderChecker,
      }
    );
  }

  get f() {
    return this.adForm.controls;
  }

  delete() {
    if (!this.sureDelete) {
      this.sureDelete = true;
    } else {
      this.deleted = true;
      this._ad
        .delete(this.ad)
        .finally(() => (this.deleted = false))
        .subscribe(
          (data) => {
            this.ad.deleted = true;
            this.changedAd.emit(this.ad);
            this.toastr.success('Das Inserat wurde erfolgreich gelöscht.');
          },
          (error) => {
            this.toastr.error(
              'Das Inserat konnte nicht gelöscht werden.',
              'Fehler',
              { timeOut: 0 }
            );
          }
        );
    }
  }

  save() {
    this._form.markFormGroupTouched(this.adForm);
    this.validationTrigger++;

    if (this.adForm.valid) {
      this.submitted = true;
      const adToSave: Ad = this.adForm.value;

      if (adToSave.id) {
        adToSave.image.id = this.ad.image.id;

        this._ad
          .update(adToSave)
          .finally(() => (this.submitted = false))
          .subscribe(
            (data) => {
              this.postSave(data);
            },
            (err) => {
              this.toastr.error(
                'Das Inserat konnte nicht gespeichert werden.',
                'Fehler',
                { timeOut: 0 }
              );
            }
          );
      } else {
        this._ad
          .save(adToSave)
          .finally(() => (this.submitted = false))
          .subscribe(
            (data) => {
              this.postSave(data);
            },
            (err) => {
              this.toastr.error(
                'Das Inserat konnte nicht gespeichert werden.',
                'Fehler',
                { timeOut: 0 }
              );
            }
          );
      }
    }
  }

  private postSave(data) {
    this.ad = data;
    this.createForm();
    this.changedAd.emit(this.ad);
    this.toastr.success('Das Inserat wurde erfolgreich gespeichert.');
  }

  cancel() {
    this.ad = new Ad();
    this.createForm();
    this.cancelAd.emit();
  }

  private getOfferId() {
    return this.ad.offer ? this.ad.offer.id : null;
  }
}

export function dateOrderChecker(c: AbstractControl) {
  const error = { endBeforeStart: true };

  const start = c.get('releaseDate');
  const end = c.get('validUntil');

  if (!start || !end) {
    return null;
  }

  if (<Date>start.value < <Date>end.value) {
    return null;
  } else {
    end.setErrors(error);
    return error;
  }
}
