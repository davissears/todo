import { beforeEach, describe, expect, mock, test } from "bun:test";
import View from "../../src/views/views.js";

function createCompletedProject(overrides = {}) {
  return {
    id: "completed-project-id",
    title: "Completed Project",
    status: "COMPLETE",
    items: [],
    ...overrides,
  };
}

describe("View", () => {
  let root;
  let view;

  beforeEach(() => {
    document.body.replaceChildren();
    root = document.createElement("div");
    document.body.append(root);
    view = new View(root);
  });

  test("bindDeleteProject handles completed-project sidebar delete clicks", () => {
    const handler = mock(() => {});
    view.bindDeleteProject(handler);
    view.updateProjectList([createCompletedProject()]);

    view.layout.sidebar.completedProjectsDrawer
      .querySelector(".delete-project-btn")
      .click();

    expect(handler).toHaveBeenCalledWith("completed-project-id");
  });

  test("bindRestoreProject handles completed-project sidebar restore clicks", () => {
    const handler = mock(() => {});
    view.bindRestoreProject(handler);
    view.updateProjectList([createCompletedProject()]);

    view.layout.sidebar.completedProjectsDrawer
      .querySelector(".restore-project-btn")
      .click();

    expect(handler).toHaveBeenCalledWith("completed-project-id");
  });

  test("toggleCompletedProjectsDrawer toggles the sidebar drawer", () => {
    view.toggleCompletedProjectsDrawer();
    expect(view.layout.sidebar.completedProjectsDrawer.classList.contains("open")).toBe(true);

    view.toggleCompletedProjectsDrawer();
    expect(view.layout.sidebar.completedProjectsDrawer.classList.contains("open")).toBe(false);
  });
});
