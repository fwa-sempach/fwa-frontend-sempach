import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }


  public markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      if (control.controls) { // control is a FormGroup
        this.markFormGroupTouched(control);
      } else { // control is a FormControl
        control.markAsTouched();
      }
    });
  }

  public isFieldValid(fieldName: string, form: FormGroup) {
    const field = form.get(fieldName);
    return field.invalid && (field.dirty || field.touched);
  }

  public getErrorMessage(fieldName: string, label: string, form: FormGroup): string {
    const field = form.get(fieldName);
    let message;

    if (field.errors !== null) {
      if (field.errors.required) {
        message = 'ist ein Pflichtfeld';
      }
      if (field.hasError('maxlength')) {
        message = 'darf nicht länger als ' + field.errors.maxlength.requiredLength + ' Zeichen sein';
      }
      if (field.errors.email) {
        message = 'ist ungültig';
      }
      if (field.errors.pattern) {
        message = 'ist ungültig';
      }
      return label + ' ' + message;
    } else {
      return '';
    }
  }
}
