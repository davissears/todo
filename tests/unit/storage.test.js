import { describe, test, expect, beforeEach } from "bun:test";
import StorageService from "../../src/services/storage.js";
import Project from "../../src/model/objects/project.js";
import Todo from "../../src/model/objects/todo.js";
import Checklist from "../../src/model/objects/checklist.js";
import CheckItem from "../../src/model/objects/checkItem.js";

const KEY = "test-storage-key";

function makeProject(title = "Test Project") {
  const p = new Project(title);
  p.description = "A test project";
  p.status = "ACTIVE";
  p.priority = "HIGH";
  p.note = "some note";
  return p;
}

describe("StorageService", () => {
  let storage;

  beforeEach(() => {
    localStorage.clear();
    storage = new StorageService(KEY);
  });

  describe("save and load", () => {
    test("load returns empty array when nothing stored", () => {
      expect(storage.load()).toEqual([]);
    });

    test("save writes to localStorage under the correct key", () => {
      const project = makeProject();
      storage.save([project]);
      const raw = localStorage.getItem(KEY);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].title).toBe("Test Project");
    });

    test("load returns Project instances, not plain objects", () => {
      storage.save([makeProject()]);
      const loaded = storage.load();
      expect(loaded[0]).toBeInstanceOf(Project);
    });

    test("save then load round-trips multiple projects", () => {
      const projects = [makeProject("Alpha"), makeProject("Beta")];
      storage.save(projects);
      const loaded = storage.load();
      expect(loaded).toHaveLength(2);
      expect(loaded[0].title).toBe("Alpha");
      expect(loaded[1].title).toBe("Beta");
    });
  });

  describe("Project serialization round-trip", () => {
    test("preserves title, description, status, id, groupId", () => {
      const p = makeProject("Round-trip Project");
      p.status = "BLOCKED";
      storage.save([p]);
      const [loaded] = storage.load();
      expect(loaded.title).toBe("Round-trip Project");
      expect(loaded.description).toBe("A test project");
      expect(loaded.status).toBe("BLOCKED");
      expect(loaded.id).toBe(p.id);
      expect(loaded.groupId).toBe(p.groupId);
    });

    test("preserves priority as Priority instance", () => {
      const p = makeProject();
      p.priority = "MED";
      storage.save([p]);
      const [loaded] = storage.load();
      expect(loaded.priority.priority).toBe("MED");
    });

    test("preserves note as Note instance", () => {
      const p = makeProject();
      p.note = "important note";
      storage.save([p]);
      const [loaded] = storage.load();
      expect(loaded.note.note).toBe("important note");
    });

    test("preserves dueDateTime", () => {
      const p = makeProject();
      p.dueDateTime = "2026-12-31T00:00:00Z";
      storage.save([p]);
      const [loaded] = storage.load();
      expect(loaded.dueDateTime).toBeDefined();
      expect(loaded.dueDateTime.date).toBeInstanceOf(Date);
    });

    test("ignores invalid stored dueDateTime instead of throwing", () => {
      localStorage.setItem(KEY, JSON.stringify([{
        title: "Legacy Project",
        tier: "PROJECT",
        id: "legacy-project-id",
        groupId: "legacy-group-id",
        items: [],
        dueDateTime: { date: "not-a-date" },
      }]));

      let loaded;
      expect(() => {
        loaded = storage.load();
      }).not.toThrow();
      expect(loaded[0].dueDateTime).toBeUndefined();
    });

    test("handles project with no optional fields", () => {
      const p = new Project("Minimal");
      storage.save([p]);
      const [loaded] = storage.load();
      expect(loaded.title).toBe("Minimal");
      expect(loaded.note).toBeUndefined();
      expect(loaded.priority).toBeUndefined();
      expect(loaded.dueDateTime).toBeUndefined();
    });
  });

  describe("Todo serialization round-trip", () => {
    test("Todo inside project is deserialized as Todo instance", () => {
      const p = new Project("With Todo");
      const todo = new Todo("My Todo");
      todo.groupId = p.groupId;
      p.items.push(todo);
      storage.save([p]);
      const [loaded] = storage.load();
      expect(loaded.items[0]).toBeInstanceOf(Todo);
      expect(loaded.items[0].title).toBe("My Todo");
      expect(loaded.items[0].tier).toBe("TODO");
    });

    test("Todo priority and note survive round-trip", () => {
      const p = new Project("With Todo");
      const todo = new Todo("Prioritized Todo");
      todo.groupId = p.groupId;
      todo.priority = "HIGH";
      todo.note = "urgent";
      p.items.push(todo);
      storage.save([p]);
      const [loaded] = storage.load();
      expect(loaded.items[0].priority.priority).toBe("HIGH");
      expect(loaded.items[0].note.note).toBe("urgent");
    });
  });

  describe("Checklist and CheckItem round-trip", () => {
    test("Checklist inside project is deserialized as Checklist instance", () => {
      const p = new Project("With Checklist");
      const cl = new Checklist("My Checklist");
      cl.groupId = p.groupId;
      p.items.push(cl);
      storage.save([p]);
      const [loaded] = storage.load();
      expect(loaded.items[0]).toBeInstanceOf(Checklist);
      expect(loaded.items[0].tier).toBe("CHECKLIST");
    });

    test("CheckItems inside Checklist survive round-trip", () => {
      const p = new Project("Nested");
      const cl = new Checklist("Steps");
      cl.groupId = p.groupId;
      const ci = new CheckItem("Step 1");
      ci.groupId = p.groupId;
      cl.items.push(ci);
      p.items.push(cl);
      storage.save([p]);
      const [loaded] = storage.load();
      const loadedCl = loaded.items[0];
      expect(loadedCl.items[0]).toBeInstanceOf(CheckItem);
      expect(loadedCl.items[0].title).toBe("Step 1");
    });
  });
});
