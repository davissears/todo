import Jot from "./jot.js";

export default class Checklist extends Jot {
  constructor(title) {
    super("CHECKLIST", title);
    this.items = [];
  }
}
