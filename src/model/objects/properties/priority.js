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
    if (validPriority.includes(value)) {
      this.#priority = value;
    } else {
      throw new Error(`${value} is not a valid priority value`);
    }
  }
}
