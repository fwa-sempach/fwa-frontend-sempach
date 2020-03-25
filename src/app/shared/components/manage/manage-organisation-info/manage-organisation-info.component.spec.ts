import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationInfoComponent } from './manage-organisation-info.component';

describe('ManageOrganisationInfoComponent', () => {
  let component: ManageOrganisationInfoComponent;
  let fixture: ComponentFixture<ManageOrganisationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageOrganisationInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
