import { Group } from './group';

export class Note {
    id:number;
    title:string;
    note:string;
    inGroup:Group;
    childGroup:Group;
    priority:number;
}
