// INFO:entrypoint

// import model and view to act as a entrypoint
//    controller utilized both
import Model from "./model/model.js";
import View from "./views/views.js";

// called to init app
//
class Controller {
  // accepts an instance of Model & view
  constructor(model, view) {
    this.model = model;
    this.view = view;
    // TODO: remove before deployment
    console.log("Controller initialized. MVC wired up.");
  }
}

// init app: creates new instance of controller
//    accepts a new instance of Model and View
const app = new Controller(new Model(), new View());

window.app = app;
