import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { FormService } from "@app/shared/services/form/form.service";
import { UserService } from "@app/shared/services/user/user.service";
import { InvisibleReCaptchaComponent } from "ngx-captcha";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "fwas-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  registrationSuccessful = false;
  registerForm: FormGroup;
  email: String;

  validationTrigger = 0;

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

  constructor(
    private fb: FormBuilder,
    private _user: UserService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private _form: FormService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group(
      {
        username: [
          "",
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[\.\-_A-Za-z0-9]*$/)
          ]
        ],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        passwordRepeat: ["", [Validators.required]],
        recaptcha: ["", Validators.required]
      },
      {
        validator: passwordMatcher
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this._form.markFormGroupTouched(this.registerForm);
    this.validationTrigger++;

    if (this.registerForm.valid) {
      delete this.registerForm.value["recaptcha"];
      delete this.registerForm.value["passwordRepeat"];

      this.submitted = true;
      this._user
        .register(this.registerForm.value)
        .finally(() => {
          this.submitted = false;
        })
        .subscribe(
          data => {
            this.toastr.success("Registrierung erfolgreich");
            this.email = this.registerForm.value.email;
            this.registrationSuccessful = true;
          },
          error => {
            this.toastr.error("Benutzername existiert bereits.", "Fehler", {
              timeOut: 0
            });
          }
        );
    }
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

export function passwordMatcher(c: AbstractControl) {
  const error = { passwordMismatch: true };

  const password = c.get("password");
  const passwordRepeat = c.get("passwordRepeat");

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
