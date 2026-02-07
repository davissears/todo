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
  }

  get note() {
    //   this.#note= object.this.#note.note= objectsnote` prop
    return this.#note.note;
  }

  set note(value) {
    this.#note = new Note(value);
  }

  get priority() {
    return this.#priority.priority;
  }

  set priority(value) {
    this.#priority = new Priority(value);
  }
}

const sample = new Project("Make a Project");
console.log(sample, sample.note);
sample.note = "HIGH";
console.log(
  "!!!init sample.priority object, use setter & getter:::HIGH:::!!!",
  sample,
  sample.note,
); // ! PASS
sample.note = "LOW";
console.log(
  "!!!overwrite priority value with set:::LOW:::",
  sample,
  sample.note,
);
