import { beforeEach, describe, expect, mock, test } from "bun:test";
import ItemModal from "../../src/views/components/itemModal.js";

const SHARED_OPTIONAL_FIELDS = [
  "#item-desc-input",
  "#item-dueDate-input",
];

const TODO_ONLY_FIELDS = [
  "#item-note-input",
  "#item-priority-input",
];

function expectSelectorsPresent(container, selectors) {
  selectors.forEach((selector) => {
    expect(container.querySelector(selector)).not.toBeNull();
  });
}

function expectSelectorsMissing(container, selectors) {
  selectors.forEach((selector) => {
    expect(container.querySelector(selector)).toBeNull();
  });
}

describe("ItemModal", () => {
  let root;
  let modal;

  beforeEach(() => {
    document.body.replaceChildren();
    root = document.createElement("div");
    document.body.append(root);
    modal = new ItemModal(root);
    modal.dialog.showModal = mock(() => {});
  });

  test("renders TODO fields by default", () => {
    expect(modal.dialog.querySelector("#item-modal-title").textContent).toBe("Create New Todo");
    expect(modal.dialog.querySelector(".modal-toggle-container")).not.toBeNull();
    expectSelectorsPresent(modal.dialog, [
      ...SHARED_OPTIONAL_FIELDS,
      ...TODO_ONLY_FIELDS,
    ]);
  });

  test("renders CHECKLIST fields without todo-only fields", () => {
    modal.tier = "CHECKLIST";
    modal.render();

    expect(modal.dialog.querySelector("#item-modal-title").textContent).toBe("Create New Checklist");
    expect(modal.dialog.querySelector(".modal-toggle-container")).not.toBeNull();
    expectSelectorsPresent(modal.dialog, SHARED_OPTIONAL_FIELDS);
    expectSelectorsMissing(modal.dialog, TODO_ONLY_FIELDS);
  });

  test("renders CHECKITEM fields without toggles or optional item fields", () => {
    modal.tier = "CHECKITEM";
    modal.render();

    expect(modal.dialog.querySelector("#item-modal-title").textContent).toBe("Create New Check Item");
    expect(modal.dialog.querySelector(".modal-toggle-container")).toBeNull();
    expect(modal.dialog.querySelector("#item-title-input")).not.toBeNull();
    expect(modal.dialog.querySelector("#item-status-input")).not.toBeNull();
    expectSelectorsMissing(modal.dialog, [
      ...SHARED_OPTIONAL_FIELDS,
      ...TODO_ONLY_FIELDS,
    ]);
  });

  test("prefills edit mode and updates modal labels", () => {
    modal.show("project-id", "TODO", null, {
      id: "todo-id",
      title: "Existing Todo",
      description: "Already planned",
      status: "BLOCKED",
      dueDateTime: { date: new Date("2026-06-01T12:30:00Z") },
      note: { note: "Remember this" },
      priority: { priority: "HIGH" },
    });

    expect(modal.dialog.querySelector("#item-modal-title").textContent).toBe("Edit Todo");
    expect(modal.dialog.querySelector('button[type="submit"]').textContent).toBe("Update Item");
    expect(modal.dialog.querySelector("#item-title-input").value).toBe("Existing Todo");
    expect(modal.dialog.querySelector("#item-desc-input").value).toBe("Already planned");
    expect(modal.dialog.querySelector("#item-status-input").value).toBe("BLOCKED");
    expect(modal.dialog.querySelector("#item-dueDate-input").value).toBe("2026-06-01T12:30");
    expect(modal.dialog.querySelector("#item-note-input").value).toBe("Remember this");
    expect(modal.dialog.querySelector("#item-priority-input").value).toBe("HIGH");
    expect(modal.dialog.showModal).toHaveBeenCalled();
  });
});
