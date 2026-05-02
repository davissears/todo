import { describe, expect, test } from "bun:test";
import {
  createPrioritySelect,
  formatDateTimeLocal,
  getNoteValue,
  getPriorityValue,
  setInputValue,
} from "../../src/views/components/modalFormHelpers.js";

describe("modal form helpers", () => {
  describe("setInputValue", () => {
    test("sets matching input values and ignores missing inputs", () => {
      const form = document.createElement("form");
      const input = document.createElement("input");
      input.id = "title";
      form.append(input);

      setInputValue(form, "#title", "Write tests");
      setInputValue(form, "#missing", "ignored");

      expect(input.value).toBe("Write tests");
    });
  });

  describe("getNoteValue", () => {
    test("normalizes string and wrapped notes", () => {
      expect(getNoteValue("plain note")).toBe("plain note");
      expect(getNoteValue({ note: "wrapped note" })).toBe("wrapped note");
      expect(getNoteValue(null)).toBe("");
    });
  });

  describe("getPriorityValue", () => {
    test("normalizes string and wrapped priorities with NONE fallback", () => {
      expect(getPriorityValue("HIGH")).toBe("HIGH");
      expect(getPriorityValue({ priority: "LOW" })).toBe("LOW");
      expect(getPriorityValue(null)).toBe("NONE");
      expect(getPriorityValue("")).toBe("NONE");
    });
  });

  describe("formatDateTimeLocal", () => {
    test("formats date values for datetime-local inputs", () => {
      expect(formatDateTimeLocal("2026-05-01T12:34:56.000Z")).toBe("2026-05-01T12:34");
    });
  });

  describe("priority helpers", () => {
    test("createPrioritySelect renders the shared priority options in order", () => {
      const select = createPrioritySelect();
      const options = Array.from(select.options);

      expect(options.map((option) => option.value)).toEqual([
        "NONE",
        "LOW",
        "MED",
        "HIGH",
        "EMERGENCY",
      ]);
      expect(options.map((option) => option.textContent)).toEqual([
        "None",
        "Low",
        "Medium",
        "High",
        "Emergency",
      ]);
    });

    test("createPrioritySelect creates a priority select with caller attributes", () => {
      const select = createPrioritySelect({ id: "item-priority-input" });

      expect(select.tagName).toBe("SELECT");
      expect(select.name).toBe("priority");
      expect(select.id).toBe("item-priority-input");
      expect(select.children.length).toBe(5);
    });
  });
});
