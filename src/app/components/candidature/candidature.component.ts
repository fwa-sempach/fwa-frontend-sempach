import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Ad } from "@app/shared/models/ad";
import { Participant } from "@app/shared/models/participant";
import { Skill } from "@app/shared/models/skill";
import { FormService } from "@app/shared/services/form/form.service";
import { ParticipantService } from "@app/shared/services/participant/participant.service";
import { InvisibleReCaptchaComponent } from "ngx-captcha";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "fwas-candidature",
  templateUrl: "./candidature.component.html",
  styleUrls: ["./candidature.component.scss"]
})
export class CandidatureComponent implements OnInit {
  @Input()
  ad: Ad;
  @Output()
  formSubmitted = new EventEmitter();

  candidatureForm: FormGroup;
  skillItems = [];

  submitted = false;

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

  constructor(
    private fb: FormBuilder,
    private participantService: ParticipantService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private _form: FormService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.candidatureForm = this.fb.group({
      skills: ["", Validators.required],
      annotation: ["", [Validators.maxLength(500)]],
      recaptcha: ["", Validators.required]
    });
  }

  get f() {
    return this.candidatureForm.controls;
  }

  sendCandidature() {
    this._form.markFormGroupTouched(this.candidatureForm);
    this.validationTrigger++;

    if (this.candidatureForm.valid) {
      const waitMessage = this.toastr.info(
        "Die Bewerbung wird gesendet",
        "Bitte warten...",
        { timeOut: 0 }
      );
      const participant = new Participant();
      participant.adId = this.ad.id;
      participant.organisationId = this.ad.offer.organisation.id;
      participant.person = this.candidatureForm.value.person;
      participant.annotation = this.candidatureForm.value.annotation;
      participant.skills = this.mapSkills(this.candidatureForm.value.skills);

      this.participantService
        .save(participant, true)
        .finally(() => (this.submitted = false))
        .subscribe(
          data => {
            this.toastr.remove(waitMessage.toastId);
            this.toastr.success(
              "Die Bewerbung wurde erfolgreich abgeschickt." +
                " Die Organisation wird sich zeitnah bei ihnen melden. Vielen Dank!"
            );

            this.formSubmitted.emit(participant);
          },
          err => {
            this.toastr.error(
              "Hoppla. Da scheint etwas schief gegangen zu sein." +
                " Bitte versuchen Sie es später noch einmal.",
              "Fehler",
              { timeOut: 0 }
            );
          }
        );
    }
  }

  private mapSkills(skillValues: Array<string>): Array<Skill> {
    return skillValues.map(s => {
      const skill = new Skill();
      skill.description = s["description"];
      return skill;
    });
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
