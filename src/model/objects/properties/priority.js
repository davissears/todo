export default class Priority {
  #priority;
  #id = crypto.randomUUID();
  #prop = "PRIORITY";
  constructor(priority, groupId) {
    this.groupId = groupId;
    this.id;
    this.priority = priority;
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

  set priority(priority) {
    const validPriority = ["NONE", "LOW", "MED", "HIGH", "EMERGENCY"];
    if (validPriority.includes(priority)) {
      return (this.#priority = priority);
    } else {
      throw new Error(`${priority} is not a valid value`);
    }
  }
}
