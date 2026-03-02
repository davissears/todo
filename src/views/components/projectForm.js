export default class Modal {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("modal requires a root element to mount.");
    }

    // the native <dialog> element provides built-in accessibility features
    // like focus trapping and automatic closing on the 'escape' key.
    this.root = rootElement;
    this.dialog = document.createElement("dialog");
    this.dialog.className = "project-modal";

    // aria-labelledby links the dialog to its title for screen readers.
    this.dialog.setAttribute("aria-labelledby", "modal-title");

    this.root.append(this.dialog);

    // build the form structure immediately upon creation.
    this.renderProjectForm();
  }

  // this method builds the form surgically inside the dialog.
  renderProjectForm() {
    this.dialog.innerHTML = "";

    // we store a reference to the form so we can easily bind listeners to it.
    this.form = document.createElement("form");
    this.form.className = "modal-form";

    const title = document.createElement("h2");
    title.id = "modal-title";
    title.textContent = "create new project";

    // each input is paired with a label for accessibility.
    // the label provides the clickable area and the screen reader description.
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "project title";
    titleLabel.setAttribute("for", "project-title-input");

    const titleInput = document.createElement("input");
    titleInput.id = "project-title-input";
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.required = true;
    titleInput.placeholder = "e.g., house renovation";

    const descLabel = document.createElement("label");
    descLabel.textContent = "description (optional)";
    descLabel.setAttribute("for", "project-desc-input");

    const descInput = document.createElement("textarea");
    descInput.id = "project-desc-input";
    descInput.name = "description";
    descInput.placeholder = "add some details about this project...";

    // a container for the action buttons to allow for flexbox alignment.
    const actions = document.createElement("div");
    actions.className = "modal-actions";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button"; // 'button' type prevents form submission.
    cancelBtn.className = "btn-secondary";
    cancelBtn.textContent = "cancel";

    // manually close on cancel to ensure focus returns to the sidebar.
    cancelBtn.addEventListener("click", () => this.dialog.close());

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn-primary";
    submitBtn.textContent = "create project";

    actions.append(cancelBtn, submitBtn);
    this.form.append(title, titleLabel, titleInput, descLabel, descInput, actions);
    this.dialog.append(this.form);
  }

  show() {
    // showmodal() is superior to show() as it provides the 'backdrop'
    // and correctly manages the 'top layer' stacking context.
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
