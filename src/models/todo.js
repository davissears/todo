import Project from "./project";
import Note from "./note";

export default class Todo extends Project {
  #note;
  constructor(title) {
    super(title);
    this.tier = "TODO";
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

// TEST
const sample = new Todo("finish this");
// console.log(sample, sample.title, sample.tier);
sample.setNote("this is a note");
console.log(
  "sample::1:",
  sample,
  "sample note::1:",
  sample.note,
  "sample note note::1:",
  sample.note.note,
);

// ! `sample.note` accesses the `Note` object that `sample` owns.
// ! `sample.note.note` accesses the `note` property of the `Note` object
sample.note = "this is a different note"; // this should throw
console.log("xxxxxxx", sample.note, "!!!!!!!", sample.note.note);
sample.setNote("!!!! this is a very different note !!!!");
console.log(
  "sample::2:",
  sample,
  "sample note::2:",
  sample.note,
  "sample note note::2:",
  sample.note.note,
);
