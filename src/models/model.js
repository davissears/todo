// connects to services for persistance
import StorageService from "../services/storage.js";
// connect to factories for access to object instantiation
import { createProject, createTodo } from "./factories.js";
// import { Jot } from "./todo.js";

// `Model` class acts as entrypoint for all modules
export default class Model {
	constructor() {
		// storage for project instances
		this.projects = [];
		// instantiates local storage
		this.storage = new StorageService("todo-app-data");
		// load this instance
		this.load();
	}

	// save this instance
	save() {
		// this instance of project is saved
		// in this instance of storage
		this.storage.save(this.projects);
	}
	// TODO: create rehydrate function. then:
	// TODO: refactor `load()` to call the rehydrate function

	// load this instnace from storage
	load() {
		// `data` = `this instance of storage loaded`
		const data = this.storage.load();
		// if data exists
		if (data) {
			// NOTE:
			// * refactor conditional to read:
			// *  if data exists
			// *    project are items with a tier of `project`
			// *    todo are items with a tier of `todo` etc

			// this instance of projects
			//  is map of all items loaded in storage
			this.projects = data.map((item) => {
				// declare value to store return
				let instance;
				// if item has a tier of project
				if (item.tier === "project") {
					//projects have `tier: project`

					// return value is all projects in storage
					instance = createProject(item.title);
				} else {
					// return value is  all todos in storage
					instance = createTodo(item.title);
				}
				// assign properties of mapped items to `instance`
				Object.assign(instance, item);
				return instance;
			});
		} else {
			// otherwise return an empty `projects` array
			this.projects = [];
		}
	}
	// instantiates Project
	createProject(title) {
		const project = createProject(title);
		this.projects.push(project);
		this.save();
	}

	// TODO: refactor Todo instantiation to also:
	// *       push `Todo` to the `todos` array of Project
	// *       with same `project`id
	// instantiates todo
	createTodo(title) {
		const todo = createTodo(title);
		this.projects.push(todo);
		this.save();
	}
}
