// connects to services for persistance
import StorageService from "../services/storage.js";
// connect to factories for access to object instantiation
// import {
//   createProject,
//   createTodo,
//   createChecklist,
//   createCheckItem,
// } from "./factories.js";
import Project from "./objects/project.js";

// `Model` class acts as entrypoint for all modules
export default class Model {
  constructor() {
    // storage for project instances
    this.projects = [];
    // instantiates local storage
    this.storage = new StorageService("todo-app-data");
    // load this instance
    // TODO: create gaurd clause around loading
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
  // FIX: current `load()` is effectively using a switch statement
  // !: the current pattern will comprpomise extensibility

  // load this instnace from storage
  load() {
    // `data` = `this instance of storage loaded`
    const data = this.storage.load();
    // if data exists
    if (data) {
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

  deleteProject(project) {
    // find project
    const index = this.projects.findIndex((p) => p.groupId === project.groupId);
    // safety check: if not found, index is -1
    if (index !== -1) {
      this.projects.splice(index, 1);
      this.save();
    }
  }

  // instantiates todo
  createTodo(title, targetProject) {
    const todo = createTodo(title);
    const project = this.projects.find(
      (pr) => pr.groupId === targetProject.groupId,
    );
    todo.groupId = project.groupId;
    targetProject.todos.push(todo);
    this.save();
    // use:
    // app.model.projects[0]
    // app.model.createTodo('wipe', app.model.projects[0])
  }

  deleteTodo(todo, project) {
    // ensure target project exists
    if (!project || !project.todos) {
      console.error("specified project or todos array in undefined");
      return;
    }
    // follows same pattern as `deleteProject()`
    const index = project.todos.findIndex((t) => t.groupId === todo.groupId);
    if (index !== -1) {
      project.todos.splice(index, 1);
      this.save();
    }
  }

  createChecklist(title, targetProject) {
    const checklist = createChecklist(title);
    const project = this.projects.find(
      (pr) => pr.groupId === targetProject.groupId,
    );
    checklist.groupId = project.groupId;
    targetProject.todos.push(checklist);
    this.save();
  }

  createCheckItem(title, targetList) {
    const checkItem = createCheckItem(title);
    const project = this.projects.find(
      (pr) => pr.groupId === targetList.groupId,
    );

    if (project) {
      const checklist = project.todos.find(
        (ch) => ch.listId === targetList.listId,
      );

      // validation
      // if checklist exists
      if (checklist) {
        // ensure the array exists before pushing
        // if array doesn't exist
        if (!checklist.checkItems) {
          checklist.checkItems = [];
        }
        // add `listId` for checklist grouping
        checkItem.listId = checklist.listId;
        checklist.checkItems.push(checkItem);
        this.save();
        // error message if checklist not found
      } else {
        console.error("Checklist not found in project");
      }
      // error message if project not found
    } else {
      console.error("Project not found");
    }
  }
}
