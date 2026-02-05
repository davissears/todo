import Jot from "./jot";
export default class CheckItem extends Jot {
  // tier = "CHECKITEM";
  constructor(title) {
    super("CHECKITEM", title);
  }
}

// TEST
const sample = new CheckItem("create CheckItem");

