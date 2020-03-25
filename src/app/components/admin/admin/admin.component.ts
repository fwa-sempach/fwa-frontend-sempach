import { Component, OnInit } from '@angular/core';
import { Organisation } from '@app/shared/models/organisation';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fwas-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  organisations = new Array<Organisation>();

  confirmDeletionId: number;

  constructor(
    private _organisation: OrganisationService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.readOrganisations();
  }

  private readOrganisations() {
    this._organisation.readFiltered(1, 100000, false).subscribe((data) => {
      this.organisations = data.elements;
    });
  }

  changeOrganisationActive(organisation: Organisation) {
    organisation.verified = !organisation.verified;

    this._organisation.update(organisation, organisation.verified).subscribe(
      (data) => {
        this.toastr.success('Die Organisation wurde erfolgreich gespeichert.');
      },
      (error) => {
        this.toastr.error(
          'Die Organisation konnte nicht gespeichert werden.',
          'Fehler',
          { timeOut: 0 }
        );
      }
    );
  }

  deleteOrganisation(orgaisation: Organisation) {
    if (this.confirmDeletionId !== orgaisation.id) {
      this.confirmDeletionId = orgaisation.id;
    } else {
      this._organisation
        .delete(orgaisation)
        .subscribe(
          (data) => {
            this.toastr.success('Die Organisation wurde erfolgreich gelöscht.');
            this.organisations = this.organisations.filter(
              (o) => o.id !== orgaisation.id
            );
          },
          (error) => {
            this.toastr.error(
              'Die Organisation konnte nicht gelöscht werden.',
              'Fehler',
              { timeOut: 0 }
            );
          }
        )
        .add(() => (this.confirmDeletionId = undefined));
    }
  }
}
