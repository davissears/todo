import Model from "./models/model.js";
import View from "./views/views.js";

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		console.log("Controller initialized. MVC wired up.");
	}
}

const app = new Controller(new Model(), new View());

// app.model.createTodo("Make Dinner");

// TODO: remove before deployment
window.app = app;
