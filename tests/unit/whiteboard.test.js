import { describe, test, expect, beforeEach } from "bun:test";
import Whiteboard from "../../src/views/components/whiteboard.js";

describe("Whiteboard", () => {
  let whiteboard;
  let drawer;

  beforeEach(() => {
    document.body.innerHTML = "";
    const root = document.createElement("div");
    document.body.append(root);
    whiteboard = new Whiteboard(root);
    drawer = document.createElement("div");
  });

  describe("renderItemDetailDrawer", () => {
    test("renders a complete task button for active items", () => {
      whiteboard.renderItemDetailDrawer({
        id: "todo-1",
        title: "Active todo",
        tier: "TODO",
        status: "ACTIVE",
      }, drawer, "project-1", false);

      const completeButton = drawer.querySelector(".complete-task-btn");
      const restoreButton = drawer.querySelector(".restore-task-btn");

      expect(completeButton).not.toBeNull();
      expect(completeButton.dataset.id).toBe("todo-1");
      expect(completeButton.dataset.projectId).toBe("project-1");
      expect(restoreButton).toBeNull();
    });

    test("renders a restore task button for completed items", () => {
      whiteboard.renderItemDetailDrawer({
        id: "todo-1",
        title: "Completed todo",
        tier: "TODO",
        status: "COMPLETE",
      }, drawer, "project-1", false);

      const completeButton = drawer.querySelector(".complete-task-btn");
      const restoreButton = drawer.querySelector(".restore-task-btn");

      expect(restoreButton).not.toBeNull();
      expect(restoreButton.dataset.id).toBe("todo-1");
      expect(restoreButton.dataset.projectId).toBe("project-1");
      expect(completeButton).toBeNull();
    });
  });
});
