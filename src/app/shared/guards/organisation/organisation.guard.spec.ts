import { async, inject, TestBed } from '@angular/core/testing';

import { OrganisationGuard } from './organisation.guard';

describe('OrganisationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganisationGuard],
    });
  });

  it('should ...', inject([OrganisationGuard], (guard: OrganisationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
