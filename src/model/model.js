import StorageService from "../services/storage.js";
import Checklist from "./objects/checklist.js";
import Project from "./objects/project.js";
import Todo from "./objects/todo.js";
// import Checklist from "./objects/checklist.js";

export default class Model {
  constructor() {
    this.storage = new StorageService("todo-app-data");
    this.projects = [];
    // this.load();
  }

  // FIX: implement functional serialize/deserialize functions
  // NOTE: `save()` & `load()` serve to handle object init ONLY!
  // load() {
  //   const data = this.storage.load();
  //   if (data) {
  //     this.projects = data.map((item) => {
  //       let instance;
  //       if ((item.tier = "PROJECT")) {
  //         instance = new Project(item.title);
  //       }
  //     });
  //   }
  // }

  // save() {
  //   try {
  //     this.storage.save(this.projects);
  //   } catch (e) {
  //     console.error("Error saving to localStorage", e);
  //   }
  // }
  // TEST: !PASS: init project
  createProject(title) {
    const project = new Project(title);
    this.projects.push(project);
    // this.save();
  }
  // TODO: CRUD for Project, Todo, Checklist, CheckItem
  // ?: can a single create function init all objects?
  createChild(title, tier, parent) {
    if (tier === "TODO") {
      return (child = new Todo(title));
    } else if (tier === "CHECKLIST") {
      return (child = new Checklist(title));
    } else if (tier === "CHECKITEM") {
      return (child = new CheckItem(title));
    }

    child.groupId = parent.groupId;
    parent.items.push(child);
  }
}
// TEST
// const model = new Model();
// console.log(model);
