import { Token } from '@angular/compiler';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { FormService } from '@app/shared/services/form/form.service';
import { UserService } from '@app/shared/services/user/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fwas-manage-user-info',
  templateUrl: './manage-user-info.component.html',
  styleUrls: ['./manage-user-info.component.scss'],
})
export class ManageUserInfoComponent implements OnInit, OnChanges {
  @Input()
  onlyPasswordReset = false;
  @Input()
  resetToken: string;

  emailForm: FormGroup;
  passwordForm: FormGroup;

  emailValidationTrigger = 0;
  passwordValidationTrigger = 0;

  passwordSubmitted = false;
  emailSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private _form: FormService,
    private _user: UserService,
    private _auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.createEmailForm();
    this.createPasswordForm();
  }

  ngOnChanges() {}

  createEmailForm() {
    this.emailForm = this.fb.group(
      {
        username: [this._auth.getUsername()],
        email: ['', [Validators.required, Validators.email]],
        emailRepeat: ['', [Validators.required]],
      },
      {
        validator: emailMatcher,
      }
    );
  }

  createPasswordForm() {
    this.passwordForm = this.fb.group(
      {
        username: [this._auth.getUsername()],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordRepeat: ['', [Validators.required]],
      },
      {
        validator: passwordMatcher,
      }
    );
  }

  get fE() {
    return this.emailForm.controls;
  }

  get fP() {
    return this.passwordForm.controls;
  }

  changeEmail() {
    this._form.markFormGroupTouched(this.emailForm);
    this.emailValidationTrigger++;

    if (this.emailForm.valid) {
      this.emailSubmitted = true;
      const credentials = this.emailForm.value;
      delete credentials['emailRepeat'];

      this._user
        .changePassword(credentials)
        .finally(() => (this.emailSubmitted = false))
        .subscribe(
          (data) => {
            this.toastr.success(
              'Die Emailadresse wurde geändert und ist ab sofort gültig.'
            );
          },
          (error) => {
            this.toastr.error(
              'Die Emailadresse konnte nicht geändert werden.',
              'Fehler',
              { timeOut: 0 }
            );
          }
        );
    }
  }

  changePassword() {
    this._form.markFormGroupTouched(this.passwordForm);
    this.passwordValidationTrigger++;

    if (this.passwordForm.valid) {
      this.passwordSubmitted = true;
      const credentials = this.passwordForm.value;
      delete credentials['passwordRepeat'];

      if (this.resetToken) {
        localStorage.setItem('auth-token', this.resetToken);
        this._auth.emitSession();
        credentials.username = this._auth.getUsername();
      }

      this._user
        .changePassword(credentials)
        .finally(() => {
          this.passwordSubmitted = false;
        })
        .subscribe(
          (data) => {
            this.toastr.success(
              'Das Passwort wurde geändert und ist ab sofort gültig.'
            );
            if (this.resetToken) {
              this._auth.logout();
              this._auth.emitSession();
            }
          },
          (error) => {
            this.toastr.error(
              'Das Passwort konnte nicht geändert werden.',
              'Fehler',
              { timeOut: 0 }
            );
          }
        );
    }
  }
}

export function passwordMatcher(c: AbstractControl) {
  const error = { passwordMismatch: true };

  const password = c.get('password');
  const passwordRepeat = c.get('passwordRepeat');

  if (!password || !passwordRepeat) {
    return null;
  }

  if (password.value === passwordRepeat.value) {
    return null;
  } else {
    passwordRepeat.setErrors(error);
    return error;
  }
}

export function emailMatcher(c: AbstractControl) {
  const error = { emailMismatch: true };

  const email = c.get('email');
  const emailRepeat = c.get('emailRepeat');

  if (!email || !emailRepeat) {
    return null;
  }

  if (email.value === emailRepeat.value) {
    return null;
  } else {
    emailRepeat.setErrors(error);
    return error;
  }
}
