import { Component, OnInit } from '@angular/core';
import { Note } from '../models/note';
import { Group } from '../models/group';
import { User } from '../models/user';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  activeNote:Note; 
  notes:Note[];
  activeGroup:Group;

  constructor() { }

  ngOnInit(): void {
  }

  deleteNote(index: number) {
    throw new Error("Method not implemented.");
  }
  
  alterNote(index:number) {
    throw new Error("Method not implemented.");
  }

  addChildGroup(arg0: number) {
    throw new Error("Method not implemented.");
  }

  moveNote(arg0: number, arg1: number) {
    throw new Error("Method not implemented.");
  }

  createNote(index: number) {
    throw new Error("Method not implemented.");
  }

  toggleModal(modalId: string){
    var modal = document.getElementById(modalId);
    modal.hidden = !modal.hidden;
  }
}
