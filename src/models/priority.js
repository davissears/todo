export default class Priority {
  #priority;
  #tier = "";
  constructor(priority) {
    this.priority = priority;
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
// TEST
const sample = new Priority("HIGH"); // ! PASS
// sample.priority = "nONE"; // ! PASS: should throw
sample.priority = 'NONE' // ! PASS
console.log(sample, sample.priority);
