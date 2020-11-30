import { ComponentFixture, TestBed } from '@angular/core/testing';

import {HttpClient} from '@angular/common/http';

import { NotesComponent } from './notes.component';
import { Note } from '../models/note';
import { Group } from '../models/group';
import { User } from '../models/user';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    component.allGroups = [
      {
        id:1,
        user:null,
        name:"Test Group 1",
        base:true
      },
      {
        id:2,
        user:null,
        name:"Test Group 2",
        base:false
      }
    ];
    component.activeGroup = component.allGroups[0];
    component.notes = [
      {
        id:1,
        title:"Test Note",
        note:"Test Note Body",
        inGroup:component.activeGroup,
        childGroup:[component.allGroups[1]],
        priority:1
      },
      {
        id:2,
        title:"Test Note 2",
        note:"Test Note Body 2",
        inGroup:component.activeGroup,
        childGroup:null,
        priority:2},
      {
        id:3,
        title:"Test Note 3",
        note:"Test Note Body 3",
        inGroup:component.activeGroup,
        childGroup:null,
        priority:3
      }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); 
  });

  it('should display existing notes', () =>{
    expect(component.notes).toBeTruthy();
  });

  it('should delete notes', () =>{
    var oldNote = component.notes[0];
    component.activeNote = oldNote;
    component.deleteNote();
    expect(component.notes.includes(oldNote)).toBeFalse();
  });

  it('should create new note', ()=>{
    var oldLen = component.notes.length;
    (<HTMLInputElement>document.getElementById("newTitle")).value = "Test New Title";
    (<HTMLInputElement>document.getElementById("newBody")).value = "Test New Body";
    component.createNote();
    expect(component.notes.length == oldLen + 1).toBeTrue();
    expect(component.notes[oldLen].title).toBe("Test New Title");

  })

  it('should edit selected note', ()=>{
    var old:Note = component.notes[0];
    component.activeNote = component.notes[0];
    (<HTMLInputElement>document.getElementById("changeTitle")).value = "Test Alter Title";
    (<HTMLInputElement>document.getElementById("changeBody")).value = "Test Alter Body";
    component.alterNote();
    expect(component.notes[0]).toBeTruthy();
    expect(component.notes[0] == old).toBeFalse();
  });

  it('should move notes WITHIN subgroups', ()=>{
    component.moveNote(this.notes[2],2);
    expect(component.notes.length == 3).toBeTrue();
    expect(component.notes[2].title).toBe("Test Note 2");
    expect(component.notes[1].title).toBe("Test Note 3");
  });

  it('should create subgroups', ()=>{
    var oldGroupLen = component.allGroups.length;
    var oldNoteLen = component.notes[1].childGroup.length;
    component.activeNote = component.notes[1];
    component.newGroup = new Group;
    (<HTMLInputElement>document.getElementById("newGroupName")).value = "Test SubGroup 1";
    component.addChildGroup();
    expect(component.allGroups.length == oldGroupLen + 1).toBeTrue();
    expect(component.notes[1].childGroup.length == oldNoteLen + 1).toBeTrue();
  });

  it('should delete subgroup if not base', ()=>{
    var oldLen = component.allGroups.length;
    component.deleteChildGroup(1);
    expect(component.allGroups.length == oldLen - 1).toBeTrue();
  });

  it('should NOT delete subgroup if base', ()=>{
    expect(component.deleteChildGroup(0)).toThrowError();
  });

  it('should move notes BETWEEN subgroups', ()=>{
      var movedNote = component.notes[1];
      component.activeNote = component.notes[1];
      (<HTMLSelectElement>document.getElementById("toGroup")).value = "1";
      component.moveToSubgroup();
      expect(component.notes.includes(movedNote)).toBeFalse;
      component.switchActiveGroup(component.allGroups[1]);
      expect(component.activeGroup == component.allGroups[1] && component.notes.includes(movedNote)).toBeTrue();
  });

  it('should move subgroups to a different note', ()=>{
    (<HTMLSelectElement>document.getElementById("inGroup")).value = "0";
    (<HTMLSelectElement>document.getElementById("onNote")).value = "1";
    component.moveSubgroupTo();
    expect(component.notes[0].childGroup.includes(component.allGroups[1])).toBeFalse();
    expect(component.notes[1].childGroup.includes(component.allGroups[1])).toBeTrue();
  });
});
