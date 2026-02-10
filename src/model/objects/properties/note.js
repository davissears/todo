export default class Note {
  #note;
  #id = crypto.randomUUID();
  #prop = "NOTE";
  constructor(note, groupId) {
    this.groupId = groupId;
    this.id;
    this.note = note;
  }

  get prop() {
    return this.#prop;
  }

  get id() {
    return this.#id;
  }
  set id(value) {
    this.#id = value;
  }
  get note() {
    return this.#note;
  }
  set note(note) {
    this.#note = note;
  }
}
