const VALID_TIERS = ["PROJECT", "TODO", "CHECKLIST", "CHECKITEM"];
const VALID_STATUSES = ["COMPLETE", "ACTIVE", "BLOCKED"];

function isBlankValue(value) {
  return value === undefined || value === null || value === "";
}

function normalizeStatus(status) {
  if (isBlankValue(status)) return undefined;

  const normalizedStatus = status.toString().toUpperCase();
  if (VALID_STATUSES.includes(normalizedStatus)) {
    return normalizedStatus;
  }

  throw new Error(`invalid jot status value: ${status}`);
}

function getDateValue(value) {
  return typeof value === "object" && value.date ? value.date : value;
}

function normalizeDueDateTime(value) {
  if (isBlankValue(value)) return undefined;

  const newDate = new Date(getDateValue(value));
  return isNaN(newDate.getTime()) ? undefined : { date: newDate };
}

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
    if (VALID_TIERS.includes(tier)) {
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
    this.#status = normalizeStatus(status);
  }

  get dueDateTime() {
    return this.#dueDateTime;
  }

  set dueDateTime(value) {
    this.#dueDateTime = normalizeDueDateTime(value);
  }
}
