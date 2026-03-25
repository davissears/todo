import { createElement } from "./domService";

export default class Header {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("header requires a root element to mount.");
    }



    this.root = rootElement;
    this.root.classList.add("header");

    this.sidebarToggleBtn = createElement("button", {
      className: "sidebar-toggle-btn",
      "aria-label": "Toggle sidebar",
      style: "background: none; border: none; cursor: pointer; color: var(--text-primary); display: flex; align-items: center; justify-content: center; padding: 0.5rem; border-radius: 50%;"
    }, createElement("span", { className: "material-icons", style: "font-size: 1.5rem;" }, "menu"));

    this.themeToggleBtn = createElement("button", {
      className: "theme-toggle-btn",
      "aria-label": "Toggle dark mode",
      style: "background: none; border: none; cursor: pointer; color: var(--text-primary); display: flex; align-items: center; justify-content: center; padding: 0.5rem; border-radius: 50%;"
    }, createElement("span", { className: "material-icons", style: "font-size: 1.5rem;" }, "dark_mode"));


    this.headerContent = createElement("div", { className: "header-content", style: "display: flex; justify-content: space-between; align-items: center; width: 100%;" }, [
      createElement("div", { style: "display: flex; align-items: center; gap: 1rem;" }, [
        this.sidebarToggleBtn,
        createElement("h1", {}, "jot")
      ]),
      this.themeToggleBtn
    ]);

    this.root.append(this.headerContent);
  }
}
