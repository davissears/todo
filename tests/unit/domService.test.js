import { describe, test, expect } from "bun:test";
import { createElement } from "../../src/views/components/domService.js";

describe("createElement", () => {
  describe("children: strings", () => {
    test("string child is appended as a TextNode, not raw string", () => {
      const el = createElement("p", {}, "hello");
      expect(el.childNodes.length).toBe(1);
      expect(el.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
      expect(el.childNodes[0].textContent).toBe("hello");
    });

    test("string child content is preserved exactly", () => {
      const el = createElement("span", {}, "  spaces  ");
      expect(el.textContent).toBe("  spaces  ");
    });
  });

  describe("children: elements", () => {
    test("element child is appended directly", () => {
      const child = document.createElement("span");
      const el = createElement("div", {}, child);
      expect(el.children.length).toBe(1);
      expect(el.children[0]).toBe(child);
    });
  });

  describe("children: arrays", () => {
    test("array of children appended in order", () => {
      const el = createElement("ul", {}, [
        createElement("li", {}, "a"),
        createElement("li", {}, "b"),
        createElement("li", {}, "c"),
      ]);
      expect(el.children.length).toBe(3);
      expect(el.children[0].textContent).toBe("a");
      expect(el.children[2].textContent).toBe("c");
    });

    test("nested arrays are flattened", () => {
      const el = createElement("div", {}, [
        "first",
        ["second", "third"],
      ]);
      expect(el.childNodes.length).toBe(3);
      expect(el.childNodes[0].textContent).toBe("first");
      expect(el.childNodes[1].textContent).toBe("second");
      expect(el.childNodes[2].textContent).toBe("third");
    });

    test("mixed array of strings and elements", () => {
      const span = document.createElement("span");
      const el = createElement("div", {}, ["text", span]);
      expect(el.childNodes.length).toBe(2);
      expect(el.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
      expect(el.childNodes[1]).toBe(span);
    });
  });

  describe("children: null and undefined", () => {
    test("null child is silently skipped", () => {
      const el = createElement("div", {}, null);
      expect(el.childNodes.length).toBe(0);
    });

    test("undefined child is silently skipped", () => {
      const el = createElement("div", {}, undefined);
      expect(el.childNodes.length).toBe(0);
    });

    test("null inside array is skipped", () => {
      const el = createElement("div", {}, ["a", null, "b"]);
      expect(el.childNodes.length).toBe(2);
    });
  });

  describe("attributes", () => {
    test("className maps to class attribute", () => {
      const el = createElement("div", { className: "foo" });
      expect(el.getAttribute("class")).toBe("foo");
    });

    test("class attribute set directly", () => {
      const el = createElement("div", { class: "bar" });
      expect(el.getAttribute("class")).toBe("bar");
    });

    test("class as array is joined with spaces", () => {
      const el = createElement("div", { class: ["btn", "btn-primary"] });
      expect(el.getAttribute("class")).toBe("btn btn-primary");
    });

    test("data attributes are set", () => {
      const el = createElement("button", { "data-id": "abc123" });
      expect(el.getAttribute("data-id")).toBe("abc123");
    });

    test("aria attributes are set", () => {
      const el = createElement("button", { "aria-label": "close" });
      expect(el.getAttribute("aria-label")).toBe("close");
    });

    test("empty attributes object produces no attributes", () => {
      const el = createElement("div", {});
      expect(el.attributes.length).toBe(0);
    });
  });

  describe("tag name", () => {
    test("creates element with the correct tag", () => {
      expect(createElement("section").tagName).toBe("SECTION");
      expect(createElement("button").tagName).toBe("BUTTON");
      expect(createElement("ul").tagName).toBe("UL");
    });
  });
});
