export default class Jot {
  #title;
  #id = crypto.randomUUID();
  #groupId = crypto.randomUUID();
  #tier = "";
  #description;
  #status;
  #dueDateTime;
  constructor(tier, title) {
    this.tier = tier;
    this.title = title;
  }

  get title() {
    return this.#title;
  }
  set title(title) {
    this.#title = title; //remove `return`
  }

  get tier() {
    return this.#tier;
  }
  set tier(tier) {
    const validTiers = ["PROJECT", "TODO", "CHECKLIST", "CHECKITEM"];
    if (validTiers.includes(tier)) {
      this.#tier = tier; // remove `return`
    } else {
      throw new Error(`invalid jot tier value:${tier}`);
    }
  }

  get id() {
    return this.#id;
  }

  get groupId() {
    return this.#groupId;
  }
  set groupId(value) {
    this.#groupId = value;
  }

  get description() {
    return this.#description;
  }
  set description(description) {
    this.#description = description; // remove `return`
  }

  get status() {
    return this.#status;
  }
  set status(status) {
    const validStatus = ["COMPLETE", "ACTIVE", "BLOCKED"];
    if (validStatus.includes(status)) {
      this.#status = status; // remove `return`
    } else {
      throw new Error(`invalid jot status value: ${status}`);
    }
  }

  get dueDateTime() {
    return new Date(this.#dueDateTime);
  }

  set dueDateTime(date) {
    this.#dueDateTime = { date: new Date(date) };
  }
}
