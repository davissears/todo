import StorageService from "../services/storage.js";
import { Jot } from "./todo.js";
import { factories } from

export default class Model {
  constructor() {
    this.projects = [];
    this.storage = new StorageService("todo-app-data");
    this.load();
  }

  save() {
    this.storage.save(this.projects);
  }

  load() {
    const data = this.storage.load();
    if (data) {
      this.projects = data.map((item) => Jot.fromJSON(item));
    } else {
      this.projects = [];
    }
  }

  createTodo(title) {
    const todo = new Jot(title);
    this.projects.push(todo);
    this.save();
  }
}
