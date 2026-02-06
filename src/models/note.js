export default class Note {
  #note;
  #groupId;
  constructor(note, groupId) {
    this.note = note;
    this.#groupId = groupId;
  }
  get note() {
    return this.#note;
  }
  set note(note) {
    return (this.#note = note);
  }
  get groupId() {
    return this.#groupId;
  }
}
// TEST
