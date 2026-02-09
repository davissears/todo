export default class Note {
  #note;
  #id = crypto.randomUUID();

  constructor(note, groupId) {
    this.note = note;
    this.groupId = groupId;
  }

  get id() {
    return this.#id;
  }
  get note() {
    return this.#note;
  }
  set note(note) {
    this.#note = note;
  }
}
