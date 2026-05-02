import { describe, test, expect, beforeEach } from "bun:test";
import Whiteboard from "../../src/views/components/whiteboard.js";

describe("Whiteboard", () => {
  let whiteboard;
  let drawer;

  const getDetailRows = (container) => Object.fromEntries(
    Array.from(container.querySelectorAll(".detail-row")).map((row) => [
      row.querySelector(".detail-label").textContent,
      row.querySelector(".detail-value, .priority-tag").textContent,
    ])
  );

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

    test("renders normalized todo note and priority details", () => {
      whiteboard.renderItemDetailDrawer({
        id: "todo-1",
        title: "Wrapped todo",
        tier: "TODO",
        status: "ACTIVE",
        note: { note: "Remember the keys" },
        priority: { priority: "HIGH" },
      }, drawer, "project-1", false);

      const detailRows = getDetailRows(drawer);
      const priorityTag = drawer.querySelector(".priority-tag");

      expect(detailRows.Note).toBe("Remember the keys");
      expect(detailRows.Priority).toBe("HIGH");
      expect(priorityTag.classList.contains("priority-high")).toBe(true);
    });

    test("renders checklist items and add-checkitem action", () => {
      whiteboard.renderItemDetailDrawer({
        id: "checklist-1",
        title: "Launch list",
        tier: "CHECKLIST",
        status: "ACTIVE",
        items: [
          {
            id: "checkitem-1",
            title: "Confirm launch window",
            status: "COMPLETE",
          },
        ],
      }, drawer, "project-1", false);

      const checkItemButton = drawer.querySelector(".check-item-btn");
      const checkItemDrawer = drawer.querySelector(".check-item-detail-drawer");
      const addButton = drawer.querySelector(".add-checkitem-btn");

      expect(checkItemButton).not.toBeNull();
      expect(checkItemButton.textContent).toBe("Confirm launch window");
      expect(checkItemButton.classList.contains("item-completed")).toBe(true);
      expect(checkItemButton.dataset.id).toBe("checkitem-1");
      expect(checkItemButton.dataset.checklistId).toBe("checklist-1");
      expect(checkItemButton.dataset.projectId).toBe("project-1");
      expect(checkItemDrawer.dataset.itemId).toBe("checkitem-1");
      expect(addButton.dataset.checklistId).toBe("checklist-1");
      expect(addButton.dataset.projectId).toBe("project-1");
    });
  });

  describe("renderProjectList", () => {
    const createProjectWithChecklist = () => ({
      id: "project-1",
      title: "Home base",
      description: "Keep the house running",
      status: "ACTIVE",
      items: [
        {
          id: "checklist-1",
          title: "Launch list",
          tier: "CHECKLIST",
          status: "ACTIVE",
          items: [
            {
              id: "checkitem-1",
              title: "Confirm launch window",
              tier: "CHECKITEM",
              status: "ACTIVE",
            },
          ],
        },
      ],
    });

    test("renders normalized project details and completed drawer items", () => {
      whiteboard.renderProjectList([
        {
          id: "project-1",
          title: "Home base",
          description: "Keep the house running",
          status: "ACTIVE",
          note: { note: "Check the shared calendar" },
          priority: { priority: "MEDIUM" },
          items: [
            {
              id: "todo-1",
              title: "Active todo",
              tier: "TODO",
              status: "ACTIVE",
              priority: "LOW",
            },
            {
              id: "todo-2",
              title: "Finished todo",
              tier: "TODO",
              status: "COMPLETE",
              priority: { priority: "HIGH" },
            },
          ],
        },
      ]);

      const project = whiteboard.projectListContainer.querySelector(".project-container");
      const detailRows = getDetailRows(project.querySelector(".project-details-column"));
      const projectPriority = project.querySelector(".project-details-column .priority-tag");
      const activeButton = project.querySelector(".drawer-horizontal:not(.drawer-completed) .drawer-item-btn[data-id='todo-1']");
      const completedTrigger = project.querySelector(".completed-tasks-btn");
      const completedButton = project.querySelector(".drawer-completed .drawer-item-btn[data-id='todo-2']");

      expect(detailRows.Description).toBe("Keep the house running");
      expect(detailRows.Note).toBe("Check the shared calendar");
      expect(detailRows.Priority).toBe("MEDIUM");
      expect(projectPriority.classList.contains("priority-medium")).toBe(true);
      expect(activeButton.classList.contains("priority-low")).toBe(true);
      expect(completedTrigger.textContent).toBe("Completed Tasks (1)");
      expect(completedButton.classList.contains("item-completed")).toBe(true);
      expect(completedButton.classList.contains("priority-high")).toBe(true);
    });

    test("preserves open project and nested item state across rerenders", () => {
      const project = createProjectWithChecklist();
      const checklist = project.items[0];
      const checkItem = checklist.items[0];
      whiteboard.renderProjectList([project]);

      const projectContainer = whiteboard.projectListContainer.querySelector(".project-container");
      projectContainer.querySelector(".drawer-horizontal").classList.add("open");

      const checklistDrawer = projectContainer.querySelector(".item-detail-drawer[data-item-id='checklist-1']");
      whiteboard.renderItemDetailDrawer(checklist, checklistDrawer, project.id, false);
      checklistDrawer.classList.add("open");

      const checkItemButton = projectContainer.querySelector(".drawer-item-btn[data-id='checkitem-1']");
      checkItemButton.classList.add("expanded");
      checkItemButton.closest(".check-item-wrapper").classList.add("expanded");

      const checkItemDrawer = projectContainer.querySelector(".item-detail-drawer[data-item-id='checkitem-1']");
      whiteboard.renderItemDetailDrawer(checkItem, checkItemDrawer, project.id, false);
      checkItemDrawer.classList.add("open");

      whiteboard.renderProjectList([project]);

      const rerenderedProject = whiteboard.projectListContainer.querySelector(".project-container");
      const restoredChecklistDrawer = rerenderedProject.querySelector(".item-detail-drawer[data-item-id='checklist-1']");
      const restoredCheckItemButton = rerenderedProject.querySelector(".drawer-item-btn[data-id='checkitem-1']");
      const restoredCheckItemDrawer = rerenderedProject.querySelector(".item-detail-drawer[data-item-id='checkitem-1']");

      expect(rerenderedProject.querySelector(".drawer-horizontal").classList.contains("open")).toBe(true);
      expect(restoredChecklistDrawer.classList.contains("open")).toBe(true);
      expect(restoredCheckItemButton.classList.contains("expanded")).toBe(true);
      expect(restoredCheckItemButton.closest(".check-item-wrapper").classList.contains("expanded")).toBe(true);
      expect(restoredCheckItemDrawer.classList.contains("open")).toBe(true);
      expect(restoredCheckItemDrawer.querySelector(".detail-content")).not.toBeNull();
    });
  });
});
