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
    this.items = [];
  }

  get note() {
    //   this.#note= object ::: this.#note.note= `object note prop`
    // return this.#note?.note; // ?. used to return `undefined` if prop isn't set
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
    // return this.#priority?.priority;
    return this.#priority;
  }

  set priority(value) {
    const group = this.groupId;
    this.#priority = new Priority(value, group);
  }
}
