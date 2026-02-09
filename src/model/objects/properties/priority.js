export default class Priority {
  #priority;
  #id = crypto.randomUUID();
  constructor(priority, groupId) {
    this.priority = priority;
    this.groupId = groupId;
  }

  get id() {
    return this.#id;
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
