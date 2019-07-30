import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
  } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormControlDirective,
  FormGroup,
  FormGroupDirective,
  Validators
  } from '@angular/forms';
import { Person } from '@app/shared/models/person';
import { throwIfEmpty } from 'rxjs/operators';


@Component({
  selector: 'fwas-manage-person',
  templateUrl: './manage-person.component.html',
  styleUrls: ['./manage-person.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class ManagePersonComponent implements OnInit, OnChanges {

  @Input()
  person: Person;
  @Input()
  groupName: string;
  @Input()
  validationTrigger: number;

  personForm: FormGroup;

  constructor(private _fb: FormBuilder, private parent: FormGroupDirective) {
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges() {
    /*
    if (this.parent.form.controls[this.groupName]) {
      this.parent.form.removeControl(this.groupName);
    }
    */
    this.createForm();
  }

  private createForm() {
    if (!this.person) {
      this.person = new Person();
    }

    const personControl = this._fb.group({
      id: [this.person.id],
      firstname: [this.person.firstname, [Validators.required, Validators.maxLength(100)]],
      lastname: [this.person.lastname, [Validators.required, Validators.maxLength(100)]],
      street: [this.person.street, [Validators.required, Validators.maxLength(100)]],
      houseNr: [this.person.houseNr, [Validators.required, Validators.maxLength(5)]],
      zip: [this.person.zip, [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^\d*$/)
      ]],
      city: [this.person.city, [Validators.required, Validators.maxLength(100)]],
      email: [this.person.email, [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: [this.person.phone, [
        Validators.required,
        Validators.pattern(/^(\+(\d{11}|(\d{2} ){2}\d{3}( \d{2}){2})|\d{10}|(\d{3} ){2}( ?\d{2}){2})$/)
      ]]
    });

    this.parent.form.addControl(this.groupName, personControl);
  }

  get f() {
    return this.parent.form.controls[this.groupName]['controls'];
  }
}
