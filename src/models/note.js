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
 // TEST

