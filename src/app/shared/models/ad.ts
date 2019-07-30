import { Offer } from '@app/shared/models/offer';
import { Image } from '@app/shared/models/image';
import { BasicCondition } from '@app/shared/models/basicCondition';
import { Task } from '@app/shared/models/task';

export class Ad {
    id: number;
    title: string;
    numberOfVolunteersNeeded: number;
    offer: Offer;
    image: Image;
    releaseDate: Date;
    validUntil: Date;
    active: boolean;
    deleted: boolean;
    basicConditions: Array<BasicCondition>;
    tasks: Array<Task>;
}
