// INFO: ASSIGNMENT LOGIC
// * define factory functions
// *  these functions should:
// *    handle object creation
// *    return the object
import { Jot } from "./todo.js";

const startProject = (title) => {
	// create project
	const project = new Jot(title);
	// identify object as a project
	project.tier = "project";
	// give project a unique id
	project.id = Math.random().toString(36).substr(2, 9);
	// create arrays for todos
	project.todos = [];

	return project;
};

export { startProject };
