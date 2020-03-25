import { Image } from '@app/shared/models/image';
import { Person } from '@app/shared/models/person';
import { Skill } from '@app/shared/models/skill';

import { ParticipantState } from '../enums/participantState';

export class Participant {
  id: number;
  person: Person;
  image: Image;
  organisationId: number;
  adId: number;
  status: ParticipantState;
  skills: Array<Skill>;
  annotation: string;
  deleted: boolean;
}
