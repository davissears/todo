import Jot from "./jot";
import Priority from "./priority";
import Note from "./note";

export default class Project extends Jot {
  #note;
  constructor(title) {
    super("PROJECT", title);
    this.tier = "PROJECT";
  }

  setNote(value) {
    if (this.#note) {
      return (this.#note.note = value);
    } else if (!this.note) {
      return (this.#note = new Note(value, this.groupId));
    }
  }

  get note() {
    return this.#note;
  }

  set note(value) {
    return this.setNote(value);
  }

  setPriority(value) {
    return (this.priority = new Priority(value));
  }
}
