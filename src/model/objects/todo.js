import Project from "./project.js";

export default class Todo extends Project {
  constructor(title) {
    super(title);
    this.tier = "TODO";
  }
}
