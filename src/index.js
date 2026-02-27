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

function init() {
  const rootElement = document.querySelector("#root");
  if (rootElement) {
    rootElement.innerHTML = ""; // Clear existing content for HMR
  }

  // init app: creates new instance of controller
  //    accepts a new instance of Model and View
  const app = new Controller(new Model(), new View(rootElement));
  window.app = app;
}

init();

// HMR Support
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log("HMR: Reloading application...");
    init();
  });
}
