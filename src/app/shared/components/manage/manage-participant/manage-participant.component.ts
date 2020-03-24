import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParticipantState } from '@app/shared/enums/participantState';
import { Ad } from '@app/shared/models/ad';
import { Image } from '@app/shared/models/image';
import { Participant } from '@app/shared/models/participant';
import { Skill } from '@app/shared/models/skill';
import { FormService } from '@app/shared/services/form/form.service';
import { ParticipantService } from '@app/shared/services/participant/participant.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fwas-manage-participant',
  templateUrl: './manage-participant.component.html',
  styleUrls: ['./manage-participant.component.scss'],
})
export class ManageParticipantComponent implements OnInit, OnChanges {
  @Input()
  participant: Participant;
  @Input()
  ads: Array<Ad>;
  @Output()
  cancelParticipant = new EventEmitter();
  @Output()
  changedParticipant = new EventEmitter();

  participantForm: FormGroup;
  status = Object.keys(ParticipantState).map((key) => {
    return { value: key, label: ParticipantState[key] };
  });
  skillItems = [];

  submitted = false;
  deleted = false;
  sureDelete = false;

  validationTrigger = 0;

  constructor(
    private fb: FormBuilder,
    private _participant: ParticipantService,
    private toastr: ToastrService,
    private _form: FormService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges() {
    this.createForm();
    this.submitted = false;
    this.sureDelete = false;
  }

  private createForm() {
    this.participantForm = this.fb.group({
      id: [this.participant.id],
      organisationId: [this.participant.organisationId],
      adId: [this.participant.adId],
      status: [this.participant.status, [Validators.required]],
      // TODO: skill validator
      skills: [this.participant.skills, [Validators.required]],
      annotation: [this.participant.annotation, [Validators.maxLength(500)]],
    });
  }

  get f() {
    return this.participantForm.controls;
  }

  delete() {
    if (!this.sureDelete) {
      this.sureDelete = true;
    } else {
      this.deleted = true;
      this._participant
        .delete(this.participant)
        .finally(() => (this.deleted = false))
        .subscribe(
          (data) => {
            this.participant.deleted = true;
            this.changedParticipant.emit(this.participant);
            this.toastr.success('Die Person wurde erfolgreich gelöscht.');
          },
          (error) => {
            this.toastr.error(
              'Die Person konnte nicht gelöscht werden.',
              'Fehler',
              { timeOut: 0 }
            );
          }
        );
    }
  }

  save() {
    this._form.markFormGroupTouched(this.participantForm);
    this.validationTrigger++;

    if (this.participantForm.valid) {
      this.submitted = true;
      const participantToSave: Participant = this.participantForm.value;

      if (participantToSave.id) {
        participantToSave.skills = this.mapSkills(
          this.participantForm.value.skills
        );

        this._participant
          .update(participantToSave)
          .finally(() => (this.submitted = false))
          .subscribe(
            (data) => {
              this.postSave(data);
            },
            (err) => {
              this.toastr.error(
                'Die Person konnte nicht gespeichert werden.',
                'Fehler',
                { timeOut: 0 }
              );
            }
          );
      } else {
        this._participant
          .save(participantToSave)
          .finally(() => (this.submitted = false))
          .subscribe(
            (data) => {
              this.postSave(data);
            },
            (err) => {
              this.toastr.error(
                'Die Person konnte nicht gespeichert werden.',
                'Fehler',
                { timeOut: 0 }
              );
            }
          );
      }
    }
  }

  private postSave(data) {
    this.participant = data;
    this.createForm();
    this.changedParticipant.emit(this.participant);
    this.toastr.success('Sie Person wurde erfolgreich gespeichert.');
  }

  reset() {
    this.createForm();
  }

  cancel() {
    this.participant = new Participant();
    this.createForm();
    this.cancelParticipant.emit();
  }

  private mapSkills(skillValues: Array<string>): Array<Skill> {
    return skillValues.map((s) => {
      const skill = new Skill();
      skill.description = s['description'];
      return skill;
    });
  }
}
