import StorageService from "../services/storage.js";
import Project from "./objects/project.js";
// import Todo from "./objects/todo.js";
// import Checklist from "./objects/checklist.js";

export default class Model {
  constructor() {
    this.storage = new StorageService("todo-app-data");
    this.load();
  }

  // FIX: implement functional serialize/deserialize functions
  // NOTE: `save()` & `load()` serve to handle object init ONLY!
  load() {
    const data = this.storage.load();
    if (data) {
      this.projects = data.map((item) => {
        let instance;
        if ((item.tier = "PROJECT")) {
          instance = new Project(item.title);
        }
      });
    }
  }

  save() {
    try {
      this.storage.save(this.projects);
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }
  }
  // TEST: !PASS: init project
  createProject(title) {
    const project = new Project(title);
    this.projects.push(project);
    this.save();
  }
  // TODO: CRUD for Project, Todo, Checklist, CheckItem
  // ?: can a single create function init all objects?
  // createChild(title, tier, parent) {
  //   const project = parent.groupId;
  // }
}

// TEST
const model = new Model();
console.log(model);
model.createProject("CREATE A PROJECT");
