// INFO: ASSIGNMENT LOGIC
// * define factory functions
// *  these functions should:
// *    handle object creation
// *    return the object

import { addPriority } from "./behaviors.js";
import { Jot } from "./todo.js";

const createProject = (title) => {
	// declare project
	const project = new Jot(title);
	// identify object as a project
	//    gives project tier property with a value of property
	project.tier = "project";
	// give project a unique id
	project.id = Math.random().toString(36).substr(2, 9);
	// create arrays for todos
	project.todos = [];
	addPriority(project);
	return project;
};

const createTodo = (title) => {
	const todo = new Jot(title);
	// attach behaviors
	addPriority(todo);
	return todo;
};

export { createProject, createTodo };
