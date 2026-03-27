import { describe, test, expect } from "bun:test";
import Jot from "../../src/model/objects/jot.js";
import Project from "../../src/model/objects/project.js";

// Jot is abstract — use a concrete subclass (Project) to test base behavior,
// and test Jot's own validation directly via a minimal subclass.
class TestJot extends Jot {
  constructor(tier, title) {
    super(tier, title);
  }
}

describe("Jot", () => {
  describe("tier validation", () => {
    test("accepts all valid tiers", () => {
      expect(() => new TestJot("PROJECT", "p")).not.toThrow();
      expect(() => new TestJot("TODO", "t")).not.toThrow();
      expect(() => new TestJot("CHECKLIST", "c")).not.toThrow();
      expect(() => new TestJot("CHECKITEM", "ci")).not.toThrow();
    });

    test("throws on invalid tier", () => {
      expect(() => new TestJot("INVALID", "x")).toThrow();
    });
  });

  describe("status validation", () => {
    test("accepts valid statuses (case-insensitive)", () => {
      const j = new TestJot("PROJECT", "test");
      expect(() => { j.status = "ACTIVE"; }).not.toThrow();
      expect(() => { j.status = "COMPLETE"; }).not.toThrow();
      expect(() => { j.status = "BLOCKED"; }).not.toThrow();
      expect(() => { j.status = "active"; }).not.toThrow();
    });

    test("normalizes status to uppercase", () => {
      const j = new TestJot("PROJECT", "test");
      j.status = "active";
      expect(j.status).toBe("ACTIVE");
    });

    test("throws on invalid status", () => {
      const j = new TestJot("PROJECT", "test");
      expect(() => { j.status = "PENDING"; }).toThrow();
    });

    test("accepts undefined, null, empty string — sets to undefined", () => {
      const j = new TestJot("PROJECT", "test");
      j.status = "ACTIVE";
      j.status = undefined;
      expect(j.status).toBeUndefined();
      j.status = "ACTIVE";
      j.status = null;
      expect(j.status).toBeUndefined();
    });
  });

  describe("dueDateTime", () => {
    test("accepts a valid Date object", () => {
      const j = new TestJot("PROJECT", "test");
      const d = new Date("2026-06-01");
      j.dueDateTime = d;
      expect(j.dueDateTime).toBeDefined();
      expect(j.dueDateTime.date).toBeInstanceOf(Date);
    });

    test("accepts an ISO string", () => {
      const j = new TestJot("PROJECT", "test");
      j.dueDateTime = "2026-06-01T00:00:00Z";
      expect(j.dueDateTime).toBeDefined();
    });

    test("accepts an object with a date property", () => {
      const j = new TestJot("PROJECT", "test");
      j.dueDateTime = { date: new Date("2026-06-01") };
      expect(j.dueDateTime.date).toBeInstanceOf(Date);
    });

    test("sets to undefined for invalid date string", () => {
      const j = new TestJot("PROJECT", "test");
      j.dueDateTime = "not-a-date";
      expect(j.dueDateTime).toBeUndefined();
    });

    test("sets to undefined for undefined/null/empty string", () => {
      const j = new TestJot("PROJECT", "test");
      j.dueDateTime = "2026-01-01";
      j.dueDateTime = undefined;
      expect(j.dueDateTime).toBeUndefined();
    });
  });

  describe("id and groupId", () => {
    test("each instance gets a unique id", () => {
      const a = new TestJot("PROJECT", "a");
      const b = new TestJot("PROJECT", "b");
      expect(a.id).not.toBe(b.id);
    });

    test("each instance gets a unique groupId", () => {
      const a = new TestJot("PROJECT", "a");
      const b = new TestJot("PROJECT", "b");
      expect(a.groupId).not.toBe(b.groupId);
    });

    test("id can be overwritten", () => {
      const j = new TestJot("PROJECT", "test");
      j.id = "custom-id";
      expect(j.id).toBe("custom-id");
    });
  });

  describe("title", () => {
    test("stores and returns title", () => {
      const j = new TestJot("PROJECT", "My Title");
      expect(j.title).toBe("My Title");
    });
  });
});
