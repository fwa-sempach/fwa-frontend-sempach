import { Image } from '@app/shared/models/image';
import { Person } from '@app/shared/models/person';

export class Organisation {
  id: number;
  userId: number;
  contactPerson: Person;
  name: string;
  websiteUrl: string;
  description: string;
  verified: boolean;
  deleted: boolean;
  image: Image;
}
