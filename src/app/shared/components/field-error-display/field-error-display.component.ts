import {
  Component,
  Input,
  OnChanges,
  OnInit
  } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormService } from '@app/shared/services/form/form.service';

@Component({
  selector: 'fwas-field-error-display',
  templateUrl: './field-error-display.component.html',
  styleUrls: ['./field-error-display.component.scss']
})
export class FieldErrorDisplayComponent implements OnInit, OnChanges {



  @Input()
  field: FormControl;
  @Input()
  label: string;
  @Input()
  trigger: number;
  @Input()
  message: string;

  displayError: boolean;
  errorMessage: string;

  constructor() { }

  ngOnInit() {
    this.field.valueChanges.subscribe(data => {
      this.validate();
    });

    this.field.statusChanges.subscribe(data => {
      this.validate();
    });
  }

  ngOnChanges() {
    this.field.valueChanges.subscribe(data => {
      this.validate();
    });

    this.field.statusChanges.subscribe(data => {
      this.validate();
    });

    this.validate();
  }

  private validate() {
    this.displayError = this.isFieldValid();
    this.errorMessage = this.getErrorMessage();
  }

  public isFieldValid(): boolean {
    return this.field.invalid && (this.field.dirty || this.field.touched);
  }

  private getErrorMessage(): string {
    let message;

    if (this.field.errors !== null) {
      if (this.field.errors.required) {
        message = 'ist ein Pflichtfeld';
      } else if (this.field.hasError('maxlength')) {
        message = 'darf nicht länger als ' + this.field.errors.maxlength.requiredLength + ' Zeichen sein';
      } else if (this.field.hasError('minlength')) {
        message = 'muss mindestens ' + this.field.errors.minlength.requiredLength + ' Zeichen lang sein';
      } else if (this.message !== null && this.message !== undefined) {
        message = this.message;
      } else if (this.field.errors.email) {
        message = 'ist ungültig';
      } else if (this.field.errors.pattern) {
        message = 'ist ungültig';
      } else if (this.field.errors.ngbDate) {
        message = 'ist ungültig';
      } else if (this.field.errors.passwordMismatch) {
        return 'Passwörter stimmen nicht überein';
      } else if (this.field.errors.emailMismatch) {
        return 'Emailadressen stimmen nicht überein';
      } else if (this.field.errors.endBeforeStart) {
        return 'Gültig bis muss nach dem Veröffentlichungsdatum sein';
      }
      return this.label + ' ' + message;
    } else {
      return '';
    }
  }
}
