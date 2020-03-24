import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Organisation } from '@app/shared/models/organisation';
import { Session } from '@app/shared/models/session';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fwas-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  apiurl = environment.apiUrl;
  isProd = environment.production;

  isAuthenticated = false;
  showOrganisation = false;
  showAdministration = false;

  username: string;
  organisation: Organisation;

  collapsed = true;

  constructor(
    private router: Router,
    private auth: AuthService,
    private organisationService: OrganisationService
  ) {}

  ngOnInit() {
    this.readSession();
    this.auth.emitSession();
  }

  private readSession() {
    this.auth.sessionEmitter.subscribe((data) => {
      this.parseSession(<Session>data);
    });
  }

  private parseSession(session: Session) {
    this.isAuthenticated = this.auth.isAuthenticated();

    if (this.isAuthenticated) {
      this.showAdministration = session.roleCodes.indexOf('ADMIN') > -1;

      if (session.organisationId) {
        this.organisationService.readById(session.organisationId).subscribe(
          (organisation) => {
            this.organisation = organisation;
            this.showOrganisation = true;
          },
          (err) => {
            this.showOrganisation = false;
          }
        );
      }

      this.username = session.username;
    } else {
      this.showAdministration = false;
      this.showOrganisation = false;
      this.username = '';
    }
  }

  public logout() {
    this.auth.logout();
  }

  public invertCollapsation() {
    this.collapsed = !this.collapsed;
  }
}
