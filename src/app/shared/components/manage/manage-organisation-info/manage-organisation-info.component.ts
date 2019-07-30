import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Organisation } from '@app/shared/models/organisation';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { FormService } from '@app/shared/services/form/form.service';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fwas-manage-organisation-info',
  templateUrl: './manage-organisation-info.component.html',
  styleUrls: ['./manage-organisation-info.component.scss']
})
export class ManageOrganisationInfoComponent implements OnInit, OnChanges {

  @Input()
  organisation: Organisation;
  @Output()
  updateImage = new EventEmitter();

  organisationForm: FormGroup;

  validationTrigger = 0;
  quillOptions = environment.quillOptions;
  submitted = false;

  organisationCreated = false;

  http: string;

  successText = `<p>Ihre Organisation wurde erfolgreich erstellt.
  Bevor diese auf der Plattform ersichtlich wird, muss sie vom Administrator überprüft und freigegeben werden.
  Sobald die Freigabe erteilt wird, erhalten Sie ein Email.</p>
  <p><b>Dennoch können Sie bereits jetzt Ihre Angebote und Inserate erfassen!</b></p>`;

  constructor(
    private fb: FormBuilder,
    private _organisation: OrganisationService,
    private toastr: ToastrService,
    private router: Router,
    private _auth: AuthService,
    private _form: FormService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges() {
    this.createForm();
  }

  private createForm() {
    if (!this.organisation) {
      this.organisation = new Organisation();
    }

    const url = this.splitWebsiteUrl(this.organisation.websiteUrl);

    this.organisationForm = this.fb.group({
      id: [this.organisation.id],
      name: [this.organisation.name, [Validators.required, Validators.maxLength(50)]],
      websiteUrl: [url, [
        Validators.required,
        Validators.maxLength(90),
        Validators.pattern(/^(https?:\/{2})?([\w-]*)+(\.[\w-]*)+[\/\w=\?\.\&]+$$/)
      ]],
      description: [this.organisation.description, [Validators.required, Validators.maxLength(1000)]]
    });
  }

  get f() {
    return this.organisationForm.controls;
  }

  private splitWebsiteUrl(websiteUrl: string): string {
    if (websiteUrl) {
      const urlComponents = websiteUrl.split('://');
      if (websiteUrl.match(/^https?\:\/{2}.*$/)) {
        this.http = urlComponents[0].toLowerCase() + '://';
        return urlComponents[1].toLowerCase();
      }

      return urlComponents[0].toLowerCase();
    } else {
      this.http = 'http://';
      return '';
    }
  }

  save() {
    this._form.markFormGroupTouched(this.organisationForm);
    this.validationTrigger++;

    if (this.organisationForm.valid) {
      this.submitted = true;
      const organisationToSave: Organisation = this.organisationForm.value;

      const url = this.splitWebsiteUrl(organisationToSave.websiteUrl);
      organisationToSave.websiteUrl = this.http + url;
      this.organisation.websiteUrl = organisationToSave.websiteUrl;

      if (organisationToSave.id) {
        // update
        organisationToSave.verified = this.organisation.verified;
        organisationToSave.deleted = this.organisation.deleted;
        organisationToSave.userId = this.organisation.userId;
        organisationToSave.image.id = this.organisation.image.id;

        this._organisation.update(organisationToSave)
          .finally(() => this.submitted = false)
          .subscribe(
            data => {
              this.postSave(data);
              this._auth.emitSession();
            },
            err => {
              this.toastr.error('Die Organisation konnte nicht gespeichert werden.', 'Fehler', { timeOut: 0 });
            }
          );
      } else {
        // insert
        this._organisation.save(organisationToSave)
          .subscribe(
            data => {
              this.postSave(data);
              this._auth.renew()
                .finally(() => this.submitted = false)
                .subscribe(
                  token => {
                    localStorage.setItem('auth-token', token['token']);
                    this._auth.emitSession();
                    this.toastr.info(this.successText, '', { timeOut: 0, enableHtml: true });
                    this.router.navigate(['manage', 'organisationen', data.id]);
                  },
                  err => {
                    this.organisationCreated = true;
                  }
                );
            },
            err => {
              this.submitted = false;
              this.toastr.error('Die Organisation konnte nicht gespeichert werden.', 'Fehler', { timeOut: 0 });
            }
          );
      }
    }
  }

  private postSave(data) {
    this.organisation = data;
    this.updateImage.emit(data.image.imageUrl);
    this.createForm();
    this.toastr.success('Die Organisation wurde erfolgreich gespeichert.');
  }
}
