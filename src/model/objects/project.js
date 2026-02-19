import Jot from "./jot.js";
import Priority from "./properties/priority.js";
import Note from "./properties/note.js";

export default class Project extends Jot {
  #note;
  #priority;
  constructor(title) {
    super("PROJECT", title);
    this.tier = "PROJECT";
    this.items = [];
  }

  get note() {
    return this.#note;
  }

  set note(value) {
    if (value instanceof Note) {
      this.#note = value;
    } else {
      this.#note = new Note(value, this.groupId);
    }
  }

  get priority() {
    return this.#priority;
  }

  set priority(value) {
    if (value instanceof Priority) {
      this.#priority = value;
    } else {
      this.#priority = new Priority(value, this.groupId);
    }
  }
}
