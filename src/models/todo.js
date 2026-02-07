import Project from "./project";

export default class Todo extends Project {
  constructor(title) {
    super(title);
    this.tier = "TODO";
  }
}
