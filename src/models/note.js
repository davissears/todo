export default class Note {
  #note;

  constructor(note, groupId) {
    this.note = note;
    this.groupId = groupId;
  }
  get note() {
    return this.#note;
  }
  set note(note) {
    this.#note = note;
  }
}
