import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    component.activeGroup = {
      id:1,
      user:null,
      name:"Test Group 1",
      parent:null,
      base:true
    };
    component.notes = [{
      id:1,
      title:"Test Note",
      note:"Test Note Body",
      inGroup:component.activeGroup,
      childGroup:null,
      priority:1
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
    component.deleteNote(0);
    expect(component.notes).toBeFalsy();
  });

  it('should create new note', ()=>{
    (<HTMLInputElement>document.getElementById("newTitle")).value = "Test New Title";
    (<HTMLInputElement>document.getElementById("newBody")).value = "Test New Body";
    component.createNote(1);
    expect(component.notes.length == 2).toBeTrue();
    expect(component.notes[1].title).toBe("Test New Title");

  })

  it('should edit selected note', ()=>{
    var old:Note = component.notes[0];
    (<HTMLInputElement>document.getElementById("changeTitle")).value = "Test Alter Title";
    (<HTMLInputElement>document.getElementById("changeBody")).value = "Test Alter Body";
    component.alterNote(0);
    expect(component.notes[0]).toBeTruthy();
    expect(component.notes[0] == old).toBeFalse();
  });

  it('should move notes WITHIN subgroups', ()=>{
    component.notes = [
    {
      id:1,
      title:"Test Note",
      note:"Test Note Body",
      inGroup:component.activeGroup,
      childGroup:null,
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
    component.moveNote(3,2);
    expect(component.notes.length == 3).toBeTrue();
    expect(component.notes[2].title).toBe("Test Note 2");
    expect(component.notes[1].title).toBe("Test Note 3");
  });

  it('should create subgroups', ()=>{
    (<HTMLInputElement>document.getElementById("newGroupName")).value = "Test SubGroup 1";
    component.addChildGroup(0);
  });

  it('should delete subgroups', ()=>{

  });

  it('should move notes BETWEEN subgroups', ()=>{

  });

  it('should move subgroups', ()=>{

  });
});
