import { beforeEach, describe, expect, mock, test } from "bun:test";
import Modal from "../../src/views/components/projectForm.js";

describe("Project form modal", () => {
  let root;
  let modal;

  beforeEach(() => {
    document.body.replaceChildren();
    root = document.createElement("div");
    document.body.append(root);
    modal = new Modal(root);
    modal.dialog.showModal = mock(() => {});
  });

  test("prefills edit mode project fields", () => {
    modal.show({
      id: "project-id",
      title: "Existing Project",
      description: "Already scoped",
      status: "BLOCKED",
      note: { note: "Bring receipts" },
      priority: { priority: "HIGH" },
      dueDateTime: { date: new Date("2026-06-01T12:30:00Z") },
    });

    expect(modal.dialog.querySelector("#modal-title").textContent).toBe("Edit Project");
    expect(modal.dialog.querySelector('button[type="submit"]').textContent).toBe("Update Project");
    expect(modal.dialog.querySelector("#project-title-input").value).toBe("Existing Project");
    expect(modal.dialog.querySelector("#project-desc-input").value).toBe("Already scoped");
    expect(modal.dialog.querySelector("#project-status-input").value).toBe("BLOCKED");
    expect(modal.dialog.querySelector("#project-note-input").value).toBe("Bring receipts");
    expect(modal.dialog.querySelector("#project-priority-input").value).toBe("HIGH");
    expect(modal.dialog.querySelector("#project-dueDate-input").value).toBe("2026-06-01T12:30");
    expect(modal.dialog.showModal).toHaveBeenCalled();
  });
});
