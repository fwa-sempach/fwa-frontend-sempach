import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserInfoComponent } from './manage-user-info.component';

describe('ManageUserInfoComponent', () => {
  let component: ManageUserInfoComponent;
  let fixture: ComponentFixture<ManageUserInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageUserInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
