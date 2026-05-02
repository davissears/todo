import { describe, test, expect, beforeEach, mock } from "bun:test";
import Model from "../../src/model/model.js";
import Project from "../../src/model/objects/project.js";
import Todo from "../../src/model/objects/todo.js";
import Checklist from "../../src/model/objects/checklist.js";
import CheckItem from "../../src/model/objects/checkItem.js";

describe("Model", () => {
  let model;

  beforeEach(() => {
    localStorage.clear();
    model = new Model();
  });

  const createProject = (title = "P") => {
    model.createProject(title);
    return model.projects[model.projects.length - 1];
  };

  const createProjectWithTodo = (todoTitle = "T") => {
    const project = createProject();
    model.createChild(todoTitle, "TODO", project);
    return { project, todo: project.items[0] };
  };

  const createProjectWithCheckItem = (
    checklistTitle = "CL",
    checkItemTitle = "CI",
  ) => {
    const project = createProject();
    model.createChild(checklistTitle, "CHECKLIST", project);
    const checklist = project.items[0];
    model.createChild(checkItemTitle, "CHECKITEM", checklist);
    return { project, checklist, checkItem: checklist.items[0] };
  };

  describe("createProject", () => {
    test("adds a Project to the projects array", () => {
      model.createProject("Test");
      expect(model.projects).toHaveLength(1);
      expect(model.projects[0]).toBeInstanceOf(Project);
    });

    test("sets the title correctly", () => {
      model.createProject("My Project");
      expect(model.projects[0].title).toBe("My Project");
    });

    test("sets description when provided", () => {
      model.createProject("Title", "A description");
      expect(model.projects[0].description).toBe("A description");
    });

    test("does NOT call save internally (controller is responsible)", () => {
      const saveSpy = mock(() => {});
      model.storage.save = saveSpy;
      model.createProject("No Save");
      expect(saveSpy).not.toHaveBeenCalled();
    });

    test("does not persist without an explicit save", () => {
      model.createProject("Unsaved");
      const fresh = new Model();
      expect(fresh.projects).toHaveLength(0);
    });

    test("persists after explicit save", () => {
      model.createProject("Saved");
      model.save();
      const fresh = new Model();
      expect(fresh.projects).toHaveLength(1);
      expect(fresh.projects[0].title).toBe("Saved");
    });
  });

  describe("createChild", () => {
    test("creates a Todo on the parent", () => {
      const { todo } = createProjectWithTodo("My Todo");
      expect(todo).toBeInstanceOf(Todo);
      expect(todo.title).toBe("My Todo");
    });

    test("creates a Checklist on the parent", () => {
      const project = createProject();
      model.createChild("My Checklist", "CHECKLIST", project);
      expect(project.items[0]).toBeInstanceOf(Checklist);
    });

    test("creates a CheckItem on a Checklist", () => {
      const { checkItem } = createProjectWithCheckItem();
      expect(checkItem).toBeInstanceOf(CheckItem);
      expect(checkItem.title).toBe("CI");
    });

    test("inherits groupId from parent", () => {
      const { project, todo } = createProjectWithTodo();
      expect(todo.groupId).toBe(project.groupId);
    });

    test("does NOT call save internally (controller is responsible)", () => {
      const project = createProject();
      const saveSpy = mock(() => {});
      model.storage.save = saveSpy;
      model.createChild("T", "TODO", project);
      expect(saveSpy).not.toHaveBeenCalled();
    });

    test("does not persist without an explicit save", () => {
      const project = createProject();
      model.save();
      model.createChild("Unsaved Item", "TODO", project);
      const fresh = new Model();
      expect(fresh.projects[0].items).toHaveLength(0);
    });
  });

  describe("findItem", () => {
    test("finds a first-level Todo", () => {
      const { project, todo } = createProjectWithTodo();

      expect(model.findItem(project.id, todo.id)).toEqual({
        project,
        item: todo,
        parent: project,
      });
    });

    test("finds a first-level Checklist", () => {
      const project = createProject();
      model.createChild("CL", "CHECKLIST", project);
      const checklist = project.items[0];

      expect(model.findItem(project.id, checklist.id)).toEqual({
        project,
        item: checklist,
        parent: project,
      });
    });

    test("finds a nested CheckItem and returns its checklist parent", () => {
      const { project, checklist, checkItem } = createProjectWithCheckItem();

      expect(model.findItem(project.id, checkItem.id)).toEqual({
        project,
        item: checkItem,
        parent: checklist,
      });
    });

    test("returns null for a missing project", () => {
      const { todo } = createProjectWithTodo();

      expect(model.findItem("not-a-real-project", todo.id)).toBeNull();
    });

    test("returns null for a missing item", () => {
      const project = createProject();

      expect(model.findItem(project.id, "not-a-real-item")).toBeNull();
    });

    test("does NOT call save internally", () => {
      const { project, todo } = createProjectWithTodo();
      const saveSpy = mock(() => {});
      model.storage.save = saveSpy;

      model.findItem(project.id, todo.id);

      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe("deleteProject", () => {
    test("removes the project from the array", () => {
      model.createProject("Delete Me");
      const id = model.projects[0].id;
      model.deleteProject(id);
      expect(model.projects).toHaveLength(0);
    });

    test("does not affect other projects", () => {
      model.createProject("Keep");
      model.createProject("Delete Me");
      const idToDelete = model.projects[1].id;
      model.deleteProject(idToDelete);
      expect(model.projects).toHaveLength(1);
      expect(model.projects[0].title).toBe("Keep");
    });

    test("persists deletion (saves internally)", () => {
      model.createProject("Gone");
      model.save();
      const id = model.projects[0].id;
      model.deleteProject(id);
      const fresh = new Model();
      expect(fresh.projects).toHaveLength(0);
    });

    test("is a no-op for a non-existent id", () => {
      model.createProject("Stay");
      model.deleteProject("not-a-real-id");
      expect(model.projects).toHaveLength(1);
    });
  });

  describe("save and load", () => {
    test("save persists current projects to storage", () => {
      model.createProject("Persisted");
      model.save();
      expect(localStorage.getItem("todo-app-data")).not.toBeNull();
    });

    test("load restores projects from storage", () => {
      model.createProject("Loaded");
      model.save();
      model.load();
      expect(model.projects).toHaveLength(1);
      expect(model.projects[0].title).toBe("Loaded");
    });
  });
});
