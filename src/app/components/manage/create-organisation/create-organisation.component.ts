import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Organisation } from '@app/shared/models/organisation';

@Component({
  selector: 'fwas-create-organisation',
  templateUrl: './create-organisation.component.html',
  styleUrls: ['./create-organisation.component.scss']
})
export class CreateOrganisationComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
