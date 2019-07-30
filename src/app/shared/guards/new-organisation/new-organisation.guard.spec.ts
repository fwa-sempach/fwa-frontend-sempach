import { TestBed, async, inject } from '@angular/core/testing';

import { NewOrganisationGuard } from './new-organisation.guard';

describe('NewOrganisationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewOrganisationGuard]
    });
  });

  it('should ...', inject([NewOrganisationGuard], (guard: NewOrganisationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
