// INFO: ASSIGNMENT LOGIC
// * define factory functions
// *  these functions should:
// *    handle object creation
// *    return the object

// import behaviors to compose properties into created projects
import { addPriority } from "./behaviors.js";
// import class for object instantiation
import { Jot } from "./todo.js";

// composes `priority` onto object
const createProject = (title) => {
	// return value is new class Object
	const project = new Jot(title);
	// identify object as a project
	//    gives project `tier` property with a value of project
	project.tier = "project";
	// give project a unique id
	project.id = crypto.randomUUID();
	// create arrays for todos
	project.todos = [];
	// compose priority property in object
	addPriority(project);
	return project;
};

// TODO: refactor createTodo:
//  should push created object to `todos` array w/ matching project id.
const createTodo = (title) => {
	const todo = new Jot(title);
	// attach behaviors
	addPriority(todo);
	return todo;
};

export { createProject, createTodo };
