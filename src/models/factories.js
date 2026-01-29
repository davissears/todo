// INFO: ASSIGNMENT LOGIC
// * define factory functions
// *  these functions should:
// *    handle object creation
// *    return the object

// import behaviors to compose properties into created projects
import {
  addPriority,
  addDescription,
  addStatus,
  addNote,
  addDueDate,
  addDueTime,
} from "./behaviors.js";
// import class for object instantiation
import { Jot } from "./todo.js";

// composes `priority` onto object
const createProject = (title) => {
  // return value is new class Object
  const project = new Jot(title);
  // identify object as a project
  //    gives project `tier` property with a value of project
  project.tier = "project";
  // give project a group id for it and it's children
  project.groupId = crypto.randomUUID();
  // give project a unique id
  project.id = crypto.randomUUID();
  // create arrays for todos
  project.todos = [];
  // compose priority property in object
  addPriority(project);
  addDescription(project);
  addStatus(project);
  addNote(project);
  addDueDate(project);
  addDueTime(project);
  return project;
};

const createTodo = (title) => {
  const todo = new Jot(title);
  todo.id = crypto.randomUUID();
  todo.tier = "todo";
  // attach behaviors
  addPriority(todo);
  addDescription(todo);
  addStatus(todo);
  addNote(todo);
  addDueDate(todo);
  addDueTime(todo);
  return todo;
};

const createChecklist = (title) => {
  const checklist = new Jot(title);
  checklist.checkitems = [];
  checklist.id = crypto.randomUUID();
  checklist.tier = "checklist";
  addPriority(checklist);
  addDescription(checklist);
  addStatus(checklist);
  addNote(checklist);
  addDueDate(checklist);
  addDueTime(checklist);
  return checklist;
};

const createCheckItem = (title) => {
  const checkItem = new Jot(title);
  checkItem.id = crypto.randomUUID();
  checkItem.tier = "checkItem";
  addDescription(checkItem);
  addStatus(checkItem);
  addNote(checkItem);
  addDueDate(checkItem);
  addDueTime(checkItem);
  return checkItem;
};

// TODO: write addDescription
export { createProject, createTodo, createChecklist };
