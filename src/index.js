import Model from "./models/model.js";
import View from "./views/views.js";

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const app = new Controller(new Model(), new View());

app.model.createTodo("Make Dinner");
