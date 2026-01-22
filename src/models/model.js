import StorageService from "../services/storage.js";
import { createProject, createTodo } from "./factories.js";
import { Jot } from "./todo.js";

export default class Model {
	constructor() {
		this.projects = [];
		this.storage = new StorageService("todo-app-data");
		this.load();
	}

	save() {
		this.storage.save(this.projects);
  }
  // TODO: create rehydrate function. then:
	// TODO: refacttor `load()` to call the rehydrate function

	load() {
		const data = this.storage.load();
    if (data) {
      // NOTE: after verifying and testing project rehydration
      // * refactor conditional to read:
      // *  if data exists
      // *    project are items with a tier of `project`
			this.projects = data.map((item) => {
				let instance;
				if (item.tier === "project") {
					instance = createProject(item.title);
				} else {
					instance = createTodo(item.title);
				}
				Object.assign(instance, item);
				return instance;
			});
		} else {
			this.projects = [];
		}
	}

	createProject(title) {
		const project = createProject(title);
		this.projects.push(project);
		this.save();
	}

	createTodo(title) {
		const todo = createTodo(title);
		this.projects.push(todo);
		this.save();
	}
}
