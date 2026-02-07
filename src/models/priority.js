export default class Priority {
  #priority;
  // TODO: priority should not know about `tier`
  #tier = "";
  constructor(priority, groupId) {
    this.priority = priority;
    this.groupId = groupId;
  }

  get priority() {
    return this.#priority;
  }

  set priority(priority) {
    if (this.#tier === "CHECKITEM") {
      throw new Error(`'CHECKITEM' cannot have a priority`);
    }
    const validPriority = ["NONE", "LOW", "MED", "HIGH", "EMERGENCY"];
    if (validPriority.includes(priority)) {
      return (this.#priority = priority);
    } else {
      throw new Error(`${priority} is not a valid value`);
    }
  }
}
