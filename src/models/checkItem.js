import Jot from "./jot";
export default class CheckItem extends Jot {
  // tier = "CHECKITEM";
  constructor(title) {
    super("CHECKITEM", title);
  }
}

// TEST
const sample = new CheckItem("create CheckItem");
// init item
// console.log(sample); // ! PASS
// console.log(sample.tier); //  ! PASS
// set props
// sample.tier = "checklist"; // ! PASS should cause throw
// console.log(sample.tier);
// sample.description = "set description"; //  ! PASS
// console.log(sample, sample.description);
// sample.status = "ACTIVE";
// sample.status = "aCTIVE"; // ! PASS: should cause throw
// console.log(sample, sample.status);
// const sampleDate = "console.log(sample, sample)";
// sample.dueDateTime = "2026-02-05T23:06:53.247Z"; // ! PASS
// console.log(sample, sample.dueDateTime);
// sample.id = 67; //  ! PASS: should throw
// console.log(sample, sample.id);
