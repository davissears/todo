import Jot from "./jot";
import Priority from "./priority";
import Note from "./note";

// TODO: remove `return` statements from setters

export default class Project extends Jot {
  #note;
  #priority;
  constructor(title) {
    super("PROJECT", title);
    this.tier = "PROJECT";
    // const groupId = this.#groupId;
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
    this.#priority = new Priority(value);
  }
}
