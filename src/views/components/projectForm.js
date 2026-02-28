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
  }

  // this method builds the form surgically inside the dialog.
  renderProjectForm() {
    this.dialog.innerHTML = "";

    const form = document.createElement("form");
    form.className = "modal-form";

    // setting the method to 'dialog' allows buttons with type='submit'
    // to close the modal automatically while returning their value.
    form.setAttribute("method", "dialog");

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

    // we manually close on cancel to ensure focus returns to the sidebar.
    cancelBtn.addEventListener("click", () => this.dialog.close());

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn-primary";
    submitBtn.textContent = "create project";

    actions.append(cancelBtn, submitBtn);
    form.append(title, titleLabel, titleInput, descLabel, descInput, actions);
    this.dialog.append(form);
  }

  show() {
    // showmodal() is superior to show() as it provides the 'backdrop'
    // and correctly manages the 'top layer' stacking context.
    this.dialog.showModal();
  }
}
