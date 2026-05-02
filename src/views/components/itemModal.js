import { createElement } from "./domService";
import {
  createPrioritySelect,
  formatDateTimeLocal,
  getNoteValue,
  getPriorityValue,
  setInputValue,
} from "./modalFormHelpers";

const CREATE_TITLES = {
  TODO: "Create New Todo",
  CHECKLIST: "Create New Checklist",
  CHECKITEM: "Create New Check Item",
};

function getCreateTitle(tier) {
  return CREATE_TITLES[tier] || "Create New Item";
}

function getEditTitle(tier) {
  return `Edit ${tier.charAt(0) + tier.slice(1).toLowerCase()}`;
}

function createTierToggle(tier, onChange) {
  if (tier === "CHECKITEM") return null;

  const toggleContainer = createElement("div", { class: "modal-toggle-container" }, [
    createElement("span", {}, "Type: "),
    createElement("button", {
      type: "button",
      class: `toggle-btn ${tier === "TODO" ? "active" : ""}`,
      "data-tier": "TODO"
    }, "Todo"),
    createElement("button", {
      type: "button",
      class: `toggle-btn ${tier === "CHECKLIST" ? "active" : ""}`,
      "data-tier": "CHECKLIST"
    }, "Checklist")
  ]);

  toggleContainer.addEventListener("click", (e) => {
    const toggleButton = e.target.closest(".toggle-btn");
    if (toggleButton) {
      onChange(toggleButton.dataset.tier);
    }
  });

  return toggleContainer;
}

function createTitleFields() {
  return [
    createElement("label", { for: "item-title-input" }, "Title"),
    createElement("input", {
      id: "item-title-input",
      type: "text",
      name: "title",
      required: "true",
      placeholder: "e.g., Buy groceries"
    })
  ];
}

function createDescriptionFields() {
  return [
    createElement("label", { for: "item-desc-input" }, "Description"),
    createElement("textarea", {
      id: "item-desc-input",
      name: "description",
      placeholder: "add some details..."
    })
  ];
}

function createStatusFields() {
  return [
    createElement("label", { for: "item-status-input" }, "Status"),
    createElement("select", { id: "item-status-input", name: "status" }, [
      createElement("option", { value: "ACTIVE" }, "Active"),
      createElement("option", { value: "COMPLETE" }, "Complete"),
      createElement("option", { value: "BLOCKED" }, "Blocked"),
    ])
  ];
}

function createDueDateFields() {
  return [
    createElement("label", { for: "item-dueDate-input" }, "Due Date"),
    createElement("input", {
      id: "item-dueDate-input",
      type: "datetime-local",
      name: "dueDate"
    })
  ];
}

function createTodoFields() {
  return [
    createElement("label", { for: "item-note-input" }, "Note"),
    createElement("input", {
      id: "item-note-input",
      type: "text",
      name: "note",
      placeholder: "private notes..."
    }),
    createElement("label", { for: "item-priority-input" }, "Priority"),
    createPrioritySelect({ id: "item-priority-input" })
  ];
}

function createFieldsForTier(tier) {
  const fields = [...createTitleFields()];

  if (tier !== "CHECKITEM") {
    fields.push(...createDescriptionFields());
  }

  fields.push(...createStatusFields());

  if (tier !== "CHECKITEM") {
    fields.push(...createDueDateFields());
  }

  if (tier === "TODO") {
    fields.push(...createTodoFields());
  }

  return fields;
}

function createModalActions(onCancel) {
  const cancelBtn = createElement("button", {
    type: "button",
    className: "btn-secondary"
  }, "cancel");

  cancelBtn.addEventListener("click", onCancel);

  return createElement("div", { className: "modal-actions" }, [
    cancelBtn,
    createElement("button", {
      type: "submit",
      className: "btn-primary"
    }, "Add Item")
  ]);
}

function setDueDateValue(form, data) {
  if (data.dueDateTime) {
    setInputValue(form, "#item-dueDate-input", formatDateTimeLocal(data.dueDateTime.date));
  }
}

function setTodoValues(form, data) {
  setInputValue(form, "#item-note-input", getNoteValue(data.note));
  setInputValue(form, "#item-priority-input", getPriorityValue(data.priority));
}

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

    const formChildren = [
      createElement("h2", { id: "item-modal-title" }, getCreateTitle(this.tier)),
    ];

    const toggleContainer = createTierToggle(this.tier, (tier) => {
      this.tier = tier;
      this.render();
    });

    if (toggleContainer) {
      formChildren.push(toggleContainer);
    }

    formChildren.push(
      ...createFieldsForTier(this.tier),
      createModalActions(() => this.close())
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
      this.dialog.querySelector("#item-modal-title").textContent = getEditTitle(this.tier);
      this.dialog.querySelector('button[type="submit"]').textContent = "Update Item";
    }

    this.dialog.showModal();
  }

  setFormData(data) {
    setInputValue(this.form, "#item-title-input", data.title || "");
    setInputValue(this.form, "#item-desc-input", data.description || "");
    setInputValue(this.form, "#item-status-input", data.status || "ACTIVE");
    setDueDateValue(this.form, data);
    setTodoValues(this.form, data);
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
