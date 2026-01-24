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
    // use:
    // app.model.projects[0]
  }

  // instantiates todo
  createTodo(title, project) {
    const todo = createTodo(title);
    project = this.projects.find((pr) => pr.id === pr.id);
    project.todos.push(todo);
    this.save();
    // use:
    // app.model.projects[0]
    // app.model.createTodo('wipe', app.model.projects[0])
  }

  // In src/models/model.js
  deleteTodo(todoId, projectId) {
    // get reference to the project object
    const project = this.projects.find((p) => p.id === projectId);
    if (project) {
      // create a new array with the item removed
      project.todos = project.todos.filter((t) => t.id !== todoId);
      // `this` now points to new filtered array
      this.save();
    }
  }
}
