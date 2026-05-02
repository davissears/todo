import StorageService from "../services/storage.js";
import Checklist from "./objects/checklist.js";
import Project from "./objects/project.js";
import Todo from "./objects/todo.js";
import CheckItem from "./objects/checkItem.js";

function createFindResult(project, item, parent) {
  return { project, item, parent };
}

function findFirstLevelItem(project, itemId) {
  const item = project.items.find(item => item.id === itemId);
  return item ? createFindResult(project, item, project) : null;
}

function findNestedChecklistItem(project, itemId) {
  const checklist = project.items.find(item => item.tier === "CHECKLIST"
    && item.items?.some(child => child.id === itemId));
  const item = checklist?.items.find(child => child.id === itemId);
  return item ? createFindResult(project, item, checklist) : null;
}

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
  
  // delete an object
  deleteProject(projectId) {
    this.projects = this.projects.filter(p => p.id !== projectId);
    this.save();
  }

  createProject(title, description) {
    const project = new Project(title);
    if (description) {
      project.description = description;
    }
    this.projects.push(project);
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
  }

  findItem(projectId, itemId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return null;

    return findFirstLevelItem(project, itemId)
      || findNestedChecklistItem(project, itemId);
  }
}
