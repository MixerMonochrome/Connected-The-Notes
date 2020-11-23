import { Note } from './note';
import { User } from './user';

export class Group {
    id:number;
    user:User;
    name:string;
    parent:Note;
    base:boolean;
}
