import Jot from "./jot";

export default class Checklist extends Jot {
  constructor(title) {
    super(title);
    this.tier = "CHECKLIST";
  }
}
