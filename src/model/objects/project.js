import Jot from "./jot.js";
import Priority from "./properties/priority.js";
import Note from "./properties/note.js";

// TODO: remove `return` statements from setters

export default class Project extends Jot {
  #note;
  #priority;
  constructor(title) {
    super("PROJECT", title);
    this.tier = "PROJECT";
  }

  get note() {
    //   this.#note= object.this.#note.note= objectsnote` prop
    return this.#note.note;
  }

  set note(value) {
    const group = this.groupId; //captures instance groupId
    this.#note = new Note(value, group); //pass groupId to `Note`
  }

  get priority() {
    return this.#priority.priority;
  }

  set priority(value) {
    const group = this.groupId;
    this.#priority = new Priority(value, group);
  }
}
