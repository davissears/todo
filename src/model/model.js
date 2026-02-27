import StorageService from "../services/storage.js";
import Checklist from "./objects/checklist.js";
import Project from "./objects/project.js";
import Todo from "./objects/todo.js";
import CheckItem from "./objects/checkItem.js";

export default class Model {
  constructor() {
    this.storage = new StorageService("todo-app-data");
    this.projects = [];
    this.load();
  }

  // NOTE: `save()` & `load()` serve to handle object init ONLY!

  save() {
    this.storage.save(this.projects);
  }

  load() {
    this.projects = this.storage.load();
  }
  createProject(title) {
    const project = new Project(title);
    this.projects.push(project);
    this.save();
  }

  createChild(title, tier, parent) {
    let child;
    if (tier === "TODO") {
      child = new Todo(title);
    } else if (tier === "CHECKLIST") {
      child = new Checklist(title);
    } else if (tier === "CHECKITEM") {
      child = new CheckItem(title);
    }

    child.groupId = parent.groupId;
    parent.items.push(child);
    this.save();
  }

  // NOTE: perhaps one method should be should be able to set any prop
  addProp(propName, propValue, obj) {
    obj[propName] = propValue;
    this.save();
  }
}
// TEST
