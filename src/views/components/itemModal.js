import { createElement } from "./domService";

export default class ItemModal {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("ItemModal requires a root element to mount.");
    }

    this.root = rootElement;
    this.tier = "TODO"; // Default tier
    this.dialog = createElement("dialog", {
      className: "item-modal",
      "aria-labelledby": "item-modal-title"
    });

    this.root.append(this.dialog);
    this.render();
  }

  render() {
    this.dialog.replaceChildren();

    let titleText = "Create New Item";
    if (this.tier === "TODO") titleText = "Create New Todo";
    else if (this.tier === "CHECKLIST") titleText = "Create New Checklist";
    else if (this.tier === "CHECKITEM") titleText = "Create New Check Item";
    
    // Toggle switch - only show for TODO vs CHECKLIST
    const toggleContainer = this.tier !== "CHECKITEM" ? createElement("div", { class: "modal-toggle-container" }, [
      createElement("span", {}, "Type: "),
      createElement("button", {
        type: "button",
        class: `toggle-btn ${this.tier === "TODO" ? "active" : ""}`,
        "data-tier": "TODO"
      }, "Todo"),
      createElement("button", {
        type: "button",
        class: `toggle-btn ${this.tier === "CHECKLIST" ? "active" : ""}`,
        "data-tier": "CHECKLIST"
      }, "Checklist")
    ]) : null;

    if (toggleContainer) {
      toggleContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("toggle-btn")) {
          this.tier = e.target.dataset.tier;
          this.render();
        }
      });
    }

    const cancelBtn = createElement("button", {
      type: "button",
      className: "btn-secondary"
    }, "cancel");

    cancelBtn.addEventListener("click", () => this.close());

    const submitBtn = createElement("button", {
      type: "submit",
      className: "btn-primary"
    }, "Add Item");

    const formChildren = [
      createElement("h2", { id: "item-modal-title" }, titleText),
    ];

    if (toggleContainer) formChildren.push(toggleContainer);
    
    formChildren.push(
      // title
      createElement("label", { for: "item-title-input" }, "Title"),
      createElement("input", {
        id: "item-title-input",
        type: "text",
        name: "title",
        required: "true",
        placeholder: "e.g., Buy groceries"
      })
    );

    // Checkitems only need title and status (maybe desc)
    if (this.tier !== "CHECKITEM") {
      formChildren.push(
        // desc
        createElement("label", { for: "item-desc-input" }, "Description"),
        createElement("textarea", {
          id: "item-desc-input",
          name: "description",
          placeholder: "add some details..."
        })
      );
    }

    formChildren.push(
      // status
      createElement("label", { for: "item-status-input" }, "Status"),
      createElement("select", { id: "item-status-input", name: "status" }, [
        createElement("option", { value: "ACTIVE" }, "Active"),
        createElement("option", { value: "COMPLETE" }, "Complete"),
        createElement("option", { value: "BLOCKED" }, "Blocked"),
      ])
    );

    if (this.tier !== "CHECKITEM") {
      formChildren.push(
        // due date
        createElement("label", { for: "item-dueDate-input" }, "Due Date"),
        createElement("input", {
          id: "item-dueDate-input",
          type: "datetime-local",
          name: "dueDate"
        })
      );
    }

    // Todo-specific fields
    if (this.tier === "TODO") {
      formChildren.push(
        createElement("label", { for: "item-note-input" }, "Note"),
        createElement("input", {
          id: "item-note-input",
          type: "text",
          name: "note",
          placeholder: "private notes..."
        }),

        createElement("label", { for: "item-priority-input" }, "Priority"),
        createElement("select", { id: "item-priority-input", name: "priority" }, [
          createElement("option", { value: "NONE" }, "None"),
          createElement("option", { value: "LOW" }, "Low"),
          createElement("option", { value: "MED" }, "Medium"),
          createElement("option", { value: "HIGH" }, "High"),
          createElement("option", { value: "EMERGENCY" }, "Emergency"),
        ])
      );
    }

    formChildren.push(
      createElement("div", { className: "modal-actions" }, [
        cancelBtn,
        submitBtn
      ])
    );

    this.form = createElement("form", { className: "modal-form" }, formChildren);
    this.dialog.append(this.form);

    // Re-bind submit listener because form element was recreated
    if (this.submitHandler) {
      this.bindSubmit(this.submitHandler);
    }
  }

  show(projectId, tier = "TODO", checklistId = null, data = null) {
    this.projectId = projectId;
    this.tier = tier;
    this.checklistId = checklistId;
    this.isEdit = !!data;
    this.editId = data ? data.id : null;
    
    this.render();
    
    if (data) {
      this.setFormData(data);
      this.dialog.querySelector("#item-modal-title").textContent = `Edit ${this.tier.charAt(0) + this.tier.slice(1).toLowerCase()}`;
      this.dialog.querySelector('button[type="submit"]').textContent = "Update Item";
    }

    this.dialog.showModal();
  }

  setFormData(data) {
    const titleInput = this.form.querySelector("#item-title-input");
    const descInput = this.form.querySelector("#item-desc-input");
    const statusInput = this.form.querySelector("#item-status-input");
    const dueDateInput = this.form.querySelector("#item-dueDate-input");
    const noteInput = this.form.querySelector("#item-note-input");
    const priorityInput = this.form.querySelector("#item-priority-input");

    if (titleInput) titleInput.value = data.title || "";
    if (descInput) descInput.value = data.description || "";
    if (statusInput) statusInput.value = data.status || "ACTIVE";
    
    if (dueDateInput && data.dueDateTime) {
      const date = new Date(data.dueDateTime.date);
      const formattedDate = date.toISOString().slice(0, 16);
      dueDateInput.value = formattedDate;
    }

    if (noteInput) {
      noteInput.value = (typeof data.note === 'string' ? data.note : (data.note ? data.note.note : "")) || "";
    }
    if (priorityInput) {
      priorityInput.value = (typeof data.priority === 'string' ? data.priority : (data.priority ? data.priority.priority : "NONE")) || "NONE";
    }
  }

  close() {
    this.dialog.close();
    this.form.reset();
  }

  bindSubmit(handler) {
    this.submitHandler = handler;
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      data.tier = this.tier;
      data.projectId = this.projectId;
      data.checklistId = this.checklistId;
      
      if (this.isEdit) {
        data.id = this.editId;
        data.isEdit = true;
      }

      handler(data);
      this.close();
    });
  }
}
