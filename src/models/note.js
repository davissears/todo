export default class Note {
  #note;
  constructor(note) {
    this.note = note;
  }
  get note() {
    return this.#note;
  }
  set note(note) {
    return (this.#note = note);
  }
}

const sample = new Note("this is a note");
console.log(sample, sample.note); //  ! PASS
sample.note = "this is a different note";
console.log(sample, sample.note); //  ! PASS
