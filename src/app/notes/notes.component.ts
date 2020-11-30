import { Component, OnInit } from '@angular/core';
import { Note } from '../models/note';
import { Group } from '../models/group';
import { User } from '../models/user';
import { NotesService } from '../services/notes.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  activeNote:Note; 
  notes:Note[];
  activeGroup:Group;
  allGroups:Group[];
  currentUser:User;
  newNote:Note;
  newGroup:Group;
  tempNotes:Note[];


  constructor(private noteServ:NotesService) { }

  ngOnInit(): void {
    //grabs default user until I put a login method lmao
    this.currentUser = {
      id:0,
      username:"Groot",
      password:"GrootGroot"
    }
    //replace with below when login impl
    //this.currentUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    
    this.noteServ.getGroups(this.currentUser).subscribe(
      data =>{
        this.allGroups = data;
        this.activeGroup = this.allGroups[0];
        this.noteServ.getNotes(this.activeGroup).subscribe(
          data=>{
            this.notes = data;
            this.activeNote = null;
          },
          error=>{
            alert("Note Retrieval Failed!");
          }
        )
      },
      error =>{
        alert("Group Retrieval Failed!");
      }
    );
  }

  sendUpdate(note:Note){
    this.noteServ.updateNote(note).subscribe(
      data=>{
        this.activeNote = null;
        this.notes = data;
      },
      error=>{
        this.activeNote = null;
        alert("Failed to Update Note!");
      }
    );
  }

  selectNote(note:Note){
    this.activeNote = note;
  }

  initNote(){
    this.newNote = new Note;
  }

  initGroup(){
    this.newGroup = new Group;
  }

  deleteNote() {
    this.noteServ.deleteNote(this.activeNote).subscribe(
      data=>{
        this.notes = data;
        this.activeNote = null;
      },
      error=>{
        alert("Failed to Delete Note!");
        this.activeNote = null;
      }
    )
  }
  
  alterNote() {
    var title = (<HTMLInputElement>document.getElementById("changeTitle")).value;
    var body = (<HTMLInputElement>document.getElementById("changeBody")).value;
    this.activeNote.title = title;
    this.activeNote.note = body;
    this.sendUpdate(this.activeNote);
  }

  addChildGroup() {
    this.newGroup.id = 0;
    this.newGroup.name = (<HTMLInputElement>document.getElementById("newGroupName")).value;
    this.newGroup.user = this.currentUser;
    this.newGroup.base = false;
    this.noteServ.newGroup(this.newGroup,this.activeNote).subscribe(
      data=>{
        this.allGroups = data;
        this.noteServ.getNotes(this.activeGroup).subscribe(
          data=>{
            this.notes = data;
            this.activeNote = null;
            this.newGroup = null;
          },
          error=>{
            alert("Failed to Get Notes!");
            this.activeNote = null;
            this.newGroup = null;
          }
        )
      },
      error=>{
        alert("Failed to Add Group!");
        this.activeNote = null;
        this.newGroup = null;
      }
    );
  }

  moveNote(moveFrom: Note, moveTo: number) {
    var oldSpot = moveFrom.priority;
    moveFrom.priority = moveTo;
    this.sendUpdate(moveFrom);
  }

  createNote() {
    this.newNote.title = (<HTMLInputElement>document.getElementById("newTitle")).value;
    this.newNote.note = (<HTMLInputElement>document.getElementById("newBody")).value;
    this.newNote.inGroup = this.activeGroup;
    this.newNote.priority = <number>(<unknown>(<HTMLSelectElement>document.getElementById("newPriority")).value);
    this.newNote.id = 0;
    this.noteServ.insertNote(this.newNote).subscribe(
      data=>{
        this.notes = data;
        this.newNote = null;
      },
      error=>{
        this.newNote = null;
        alert("Failed to Create Note!");
      }
    )
  }
  
  moveSubgroupTo(group:Group, id:string) {
    var groupInd = <number>(<unknown>(<HTMLSelectElement>document.getElementById("inGroup_sub"+id)).value);
    var noteInd = <number>(<unknown>(<HTMLSelectElement>document.getElementById("onNote_sub"+id)).value);
    var note = this.tempNotes[noteInd];
    var newChildren = this.activeNote.childGroup;
    var index = newChildren.indexOf(group);
    if(newChildren.length == 1){
      this.activeNote.childGroup = null;
    }
    else if(index == 0){
      this.activeNote.childGroup = newChildren.slice(1);
    }
    else if(index == newChildren.length - 1){
      this.activeNote.childGroup = newChildren.slice(0,newChildren.length-1);
    }
    else{
      newChildren = newChildren.slice(0,index).concat(newChildren.slice(index+1));
      this.activeNote.childGroup = newChildren;
    }
    note.childGroup.push(this.allGroups[groupInd]);
    this.sendUpdate(this.activeNote);
    this.noteServ.updateNote(note).subscribe(
      data=>{
        if(note.inGroup == this.activeGroup){
          this.notes = data;
        }
      }
      error=>{
        //V BAD. LOST SUBGROUP IN VOID??? Find out way to consolidate so this doesn't happen.
      }
    )
  }

  switchActiveGroup() {
    var whichGroup = <number>(<unknown>(<HTMLSelectElement>document.getElementById("switchGroup")).value);
    this.noteServ.getNotes(this.allGroups[whichGroup]).subscribe(
      data=>{
        this.activeGroup = this.allGroups[whichGroup];
        this.notes = data;
      },
      error=>{
        alert("Failed to Switch Groups");
      }
    );
  }
  
  moveToSubgroup() {
    var newGroup = <number>(<unknown>(<HTMLSelectElement>document.getElementById("newParent")).value);
    this.activeNote.inGroup = this.allGroups[newGroup];
    this.sendUpdate(this.activeNote);
  }
  
  deleteChildGroup(toTrash:Group) {
    this.noteServ.deleteGroup(toTrash).subscribe(
      data=>{
        this.noteServ.getNotes(this.activeGroup).subscribe{
          this.activeNote = null;
          this.notes = data;
          alert("Group Deleted!");
        }
      },
      error=>{
        this.activeNote=null;
        alert("Failed to Delete Group!");
      }
    );
  }
}
