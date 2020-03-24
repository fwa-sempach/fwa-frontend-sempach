import { Component, Input, OnInit } from '@angular/core';
import { Organisation } from '@app/shared/models/organisation';

@Component({
  selector: 'fwas-organisation-header',
  templateUrl: './organisation-header.component.html',
  styleUrls: ['./organisation-header.component.scss'],
})
export class OrganisationHeaderComponent implements OnInit {
  @Input()
  organisation: Organisation;

  constructor() {}

  ngOnInit() {}
}
