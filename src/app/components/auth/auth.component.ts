import { HttpErrorResponse } from "@angular/common/http";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Credentials } from "@app/shared/models/credentials";
import { Organisation } from "@app/shared/models/organisation";
import { Session } from "@app/shared/models/session";
import { AuthService } from "@app/shared/services/auth/auth.service";
import { FormService } from "@app/shared/services/form/form.service";
import { InvisibleReCaptchaComponent } from "ngx-captcha";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "fwas-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit, AfterViewInit {
  resetFormVisible = false;
  passwordResetForm: FormGroup;

  loginForm: FormGroup;
  authError: string;
  isAuth = false;
  session: Session;
  verificationSuccessful = false;

  validationTrigger = 0;
  validationTriggerReset = 0;

  @ViewChild("captchaElem", { static: false })
  captchaElem: InvisibleReCaptchaComponent;

  public readonly siteKey = "6LdpgHUUAAAAAJQYPIiqXR20pyuagmTWLkCZkCYY";
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;
  public recaptcha: any = null;
  public badge = "inline";

  public theme = "light";
  public size = "normal";
  public lang = "de";
  public type = "image";

  submitted = false;
  submittedReset = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private _form: FormService
  ) {}

  ngOnInit() {
    this.verifyEmail();
    this.createForm();
    this.createResetForm();
    this.authError = "";
    this.isAuth = this.auth.isAuthenticated();

    this.auth.sessionEmitter.subscribe(data => {
      this.session = data;
    });
  }

  ngAfterViewInit(): void {
    this.captchaIsLoaded = true;
    this.cdr.detectChanges();
  }

  private verifyEmail() {
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params["t"];

      if (token) {
        this.auth.verifyEmail(token).subscribe(
          data => {
            this.toastr.success(
              "Die Emailadresse wurde erflogeich verifiziert."
            );
            this.router.navigate(["login"]);
          },
          error => {
            this.toastr.error(
              "Die Emailadresse konnte nicht verifiziert werden.",
              "Fehler",
              { timeOut: 0 }
            );
          }
        );
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  get fR() {
    return this.passwordResetForm.controls;
  }

  sendResetPasswordEmail() {
    this._form.markFormGroupTouched(this.passwordResetForm);
    this.validationTriggerReset++;

    if (this.passwordResetForm.valid) {
      this.submittedReset = true;

      const credentials = new Credentials();
      credentials.username = this.passwordResetForm.value.email;

      this.auth
        .sendResetPasswordEmail(credentials)
        .finally(() => (this.submittedReset = false))
        .subscribe(
          data => {
            this.toastr.success(
              "Sie werden in Kürze ein Email erhalten, um Ihr Passwort zurückzusetzen."
            );
            this.resetFormVisible = false;
          },
          error => {
            this.toastr.error(
              "Das Email konnte nicht gesendet werden. Möglicherweise wurde ein falscher Benutzername angegeben.",
              "Fehler",
              { timeOut: 0 }
            );
          }
        );
    }
  }

  onSubmit() {
    this._form.markFormGroupTouched(this.loginForm);
    this.validationTrigger++;

    if (this.loginForm.valid) {
      this.submitted = true;
      this.auth
        .authenticate(this.loginForm.value)
        .finally(() => {
          this.submitted = false;
        })
        .subscribe(
          data => {
            localStorage.setItem("auth-token", data["token"]);
            this.authError = "";
            this.isAuth = this.auth.isAuthenticated();
            this.auth.emitSession();
            if (this.isAuth) {
              this.toastr.success("Sie haben sich erfolgreich angemeldet.");

              if (this.session.organisationId) {
                this.router.navigate([
                  "manage",
                  "organisationen",
                  this.session.organisationId
                ]);
              } else if (this.auth.hasRole("ADMIN")) {
                this.router.navigate(["admin"]);
              } else if (this.auth.hasRole("ORG")) {
                this.router.navigate(["manage", "organisationen"]);
              } else {
                this.router.navigate(["start"]);
              }
            }
          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              this.authError = "Client-side error occured.";
            } else {
              this.toastr.error(
                "Benutzername oder Passwort sind falsch.",
                "Fehler",
                { timeOut: 0 }
              );
            }
          }
        );
    }
  }

  onLogout() {
    this.auth.logout();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      recaptcha: ["", Validators.required]
    });
  }

  createResetForm() {
    this.passwordResetForm = this.fb.group({
      email: ["", [Validators.required]]
    });
  }

  showResetForm() {
    this.resetFormVisible = true;
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    this.cdr.detectChanges();
  }
}
