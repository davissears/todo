import Jot from "./jot";
import Priority from "./priority";
import Note from "./note";

export default class Project extends Jot {
  constructor(title) {
    super("PROJECT", title);
    this.tier = "PROJECT";
  }

  setNote(value) {
    // this.note.id = this.id;
    return (this.note = new Note(value, this.groupId));
  }

  setPriority(value) {
    return (this.priority = new Priority(value));
  }
}
// TEST
// const sample = new Project("create a project");
// sample.setNote("this is a Project note"); // ! setNote PASS
// sample.setPriority("HIGH");
// console.log(
//   "init Project w/ Priority & Note",
//   sample,
//   sample.note,
//   sample.priority,
// ); // ! PASS

// console.log("Project Priority inst methods", sample.priority.priority);
// console.log(
//   "Project Priority inst methods",
//   (sample.priority.priority = "LOW"),
//   sample.priority.priority,
// );
// console.log(sample, sample.title); // ! init PASS

// console.log("sample Project object:", sample); // ! Note init PASS
// console.log("sample Project Note object", sample.note);
// console.log("getter test", sample.getNote()); // ! call method on parent object PASS
// console.log("sample Project Note inst methods", sample.note.note, sample.note.groupId); // ! PASS
