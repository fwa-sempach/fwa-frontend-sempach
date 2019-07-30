import { Category } from '@app/shared/models/category';
import { Image } from '@app/shared/models/image';
import { Organisation } from '@app/shared/models/organisation';
import { Person } from '@app/shared/models/person';

export class Offer {
    id: number;
    title: string;
    description: string;
    active: boolean;
    deleted: boolean;
    organisation: Organisation;
    category: Category;
    image: Image;
    contactPerson: Person;
}
