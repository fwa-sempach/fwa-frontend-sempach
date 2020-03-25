import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationHeaderComponent } from './organisation-header.component';

describe('OrganisationHeaderComponent', () => {
  let component: OrganisationHeaderComponent;
  let fixture: ComponentFixture<OrganisationHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganisationHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
