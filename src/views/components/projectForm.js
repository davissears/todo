import { createElement } from "./domService";

export default class Modal {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("modal requires a root element to mount.");
    }

    // the native <dialog> element provides built-in accessibility features
    // like focus trapping and automatic closing on the 'escape' key.
    this.root = rootElement;
    this.dialog = createElement("dialog", {
      className: "project-modal",
      "aria-labelledby": "modal-title"
    });

    this.root.append(this.dialog);

    // build the form structure immediately upon creation.
    this.renderProjectForm();
  }

  // this method builds the form surgically inside the dialog.
  renderProjectForm() {
    this.dialog.replaceChildren();

    const cancelBtn = createElement("button", {
      type: "button",
      className: "btn-secondary"
    }, "cancel");

    // manually close on cancel to ensure focus returns to the sidebar.
    cancelBtn.addEventListener("click", () => this.dialog.close());

    const submitBtn = createElement("button", {
      type: "submit",
      className: "btn-primary"
    }, "create project");

    // we store a reference to the form so we can easily bind listeners to it.
    // each input is paired with a label for accessibility.
    this.form = createElement("form", { className: "modal-form" }, [
      createElement("h2", { id: "modal-title" }, "create new project"),
      
      // title
      createElement("label", { for: "project-title-input" }, "Title"),
      createElement("input", {
        id: "project-title-input",
        type: "text",
        name: "title",
        required: "true",
        placeholder: "e.g., house renovation"
      }),

      // desc
      createElement("label", { for: "project-desc-input" }, "description "),
      createElement("textarea", {
        id: "project-desc-input",
        name: "description",
        placeholder: "add some details about this project..."
      }),

      // status
      createElement("label", { for: "project-status-input" }, "Status"),
      createElement("input", {
        id: "project-status-input",
        type: "text",
        name: "status",
        required: "true",
        placeholder: "ACTIVE or BLOCKED"
      }),

      // note
      createElement("label", { for: "project-note-input" }, "Note"),
      createElement("input", {
        id: "project-note-input",
        type: "text",
        name: "note",
        placeholder: "add notes you may need to remember concerning this project"
      }),

      // priority
      createElement("label", { for: "project-priority-input" }, "Priority"),
      createElement("input", {
        id: "project-priority-input",
        type: "text",
        name: "priority",
        placeholder: "NONE, LOW, MED, HIGH, or EMERGENCY"
      }),

      // due date
      createElement("label", { for: "project-dueDate-input" }, "Due Date"),
      createElement("input", {
        id: "project-dueDate-input",
        type: "datetime-local",
        name: "dueDate"
      }),

      // a container for the action buttons to allow for flexbox alignment.
      createElement("div", { className: "modal-actions" }, [
        cancelBtn,
        submitBtn
      ])
    ]);

    this.dialog.append(this.form);
  }

  show() {
    this.dialog.showModal();
  }

  close() {
    this.dialog.close();
  }

  // this method allows the view to pass a handler from the controller.
  bindSubmitProject(handler) {
    this.form.addEventListener("submit", (e) => {
      // prevent the default browser reload.
      e.preventDefault();

      // extract data using the modern formdata api.
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      handler(data);

      // cleanup ui state after successful submission.
      this.close();
      this.form.reset();
    });
  }
}
