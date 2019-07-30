import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewOrganisationGuard implements CanActivate {

  constructor(
    private _auth: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let result = false;

    if (this._auth.isAuthenticated()) {
      // only new organisations (Org role, no OrgId)
      if (this._auth.hasRole('ORG') && this._auth.isOfOrganisation(undefined)) {
        result = true;
      }
    }

    return result;
  }
}
