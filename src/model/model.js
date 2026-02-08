import StorageService from "../services/storage.js";
import Project from "./objects/project.js";

export default class Model {
  constructor() {
    this.projects = [];
    this.storage = new StorageService("todo-app-data");
    this.load();
  }

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
    this.storage.save(this.projects);
  }

  createProject(title) {
    const project = new Project(title);
    this.projects.push(project);
    this.save();
  }
}
