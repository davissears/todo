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
  set id(value) {
    this.#id = value;
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
    if (status === undefined || status === null || status === "") {
      this.#status = undefined;
      return;
    }
    const normalizedStatus = status.toString().toUpperCase();
    const validStatus = ["COMPLETE", "ACTIVE", "BLOCKED"];
    if (validStatus.includes(normalizedStatus)) {
      this.#status = normalizedStatus;
    } else {
      throw new Error(`invalid jot status value: ${status}`);
    }
  }

  get dueDateTime() {
    return this.#dueDateTime;
  }

  set dueDateTime(value) {
    if (value === undefined || value === null || value === "") {
      this.#dueDateTime = undefined;
      return;
    }

    // Extract date from various possible formats
    let dateValue = value;
    if (typeof value === 'object' && value.date) {
      dateValue = value.date;
    }
    
    const newDate = new Date(dateValue);

    if (!isNaN(newDate.getTime())) {
      // Store as a simple object with a date property for consistent serialization
      this.#dueDateTime = { date: newDate };
    } else {
      this.#dueDateTime = undefined;
    }
  }
}
