import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class OrganisationGuard implements CanActivate {
  constructor(private _auth: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let result = false;

    if (this._auth.isAuthenticated()) {
      const organisationId = +next.paramMap.get('id');

      if (
        (this._auth.hasRole('ORG') &&
          this._auth.isOfOrganisation(organisationId)) ||
        this._auth.hasRole('ADMIN')
      ) {
        result = true;
      }
    }

    return result;
  }
}
