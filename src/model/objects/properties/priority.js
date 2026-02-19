export default class Priority {
  #priority;
  #id = crypto.randomUUID();
  #prop = "PRIORITY";
  constructor(priority, groupId) {
    this.groupId = groupId;
    this.id;
    this.#priority = priority;
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
  get priority() {
    return this.#priority;
  }

  set priority(value) {
    const validPriority = [
      undefined,
      "NONE",
      "LOW",
      "MED",
      "HIGH",
      "EMERGENCY",
    ];
    if (validPriority.includes(value) && value instanceof Priority) {
      this.#priority = value;
    } else if (!validPriority.includes(value)) {
      throw new Error(`${value} is not a valid value`);
    } else {
      this.#priority = new Priority(value, this.groupId);
    }
  }
}
