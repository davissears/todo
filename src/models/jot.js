export default class Jot {
  #title;
  #id = crypto.randomUUID();
  #tier = "";
  #description;
  #status;
  #note;
  #dueDateTime;
  constructor(tier, title) {
    this.tier = tier;
    this.title = title;
  }

  get title() {
    return this.#title;
  }
  set title(title) {
    return (this.#title = title);
  }

  get id() {
    return this.#id;
  }

  get tier() {
    return this.#tier;
  }
  set tier(tier) {
    const validTiers = ["PROJECT", "TODO", "CHECKLIST", "CHECKITEM"];
    if (validTiers.includes(tier)) {
      return (this.#tier = tier);
    } else {
      throw new Error(`invalid jot tier value:${tier}`);
    }
  }

  get description() {
    return this.#description;
  }
  set description(description) {
    return (this.#description = description);
  }

  get status() {
    return this.#status;
  }
  set status(status) {
    const validStatus = ["COMPLETE", "ACTIVE", "BLOCKED"];
    if (validStatus.includes(status)) {
      return (this.#status = status);
    } else {
      throw new Error(`invalid jot status value: ${status}`);
    }
  }

  get dueDateTime() {
    return new Date(this.#dueDateTime);
  }

  set dueDateTime(date) {
    return (this.#dueDateTime = new Date(date).toISOString());
  }
}
