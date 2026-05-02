import { createElement } from "./domService";

const PRIORITY_OPTIONS = [
  { value: "NONE", label: "None" },
  { value: "LOW", label: "Low" },
  { value: "MED", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "EMERGENCY", label: "Emergency" },
];

export function setInputValue(form, selector, value) {
  const input = form.querySelector(selector);

  if (input) {
    input.value = value;
  }
}

export function getNoteValue(note) {
  return (typeof note === "string" ? note : (note ? note.note : "")) || "";
}

export function getPriorityValue(priority) {
  return (typeof priority === "string" ? priority : (priority ? priority.priority : "NONE")) || "NONE";
}

export function formatDateTimeLocal(dateValue) {
  if (!dateValue) return "";

  return new Date(dateValue).toISOString().slice(0, 16);
}

function createPriorityOptions() {
  return PRIORITY_OPTIONS.map(({ value, label }) => (
    createElement("option", { value }, label)
  ));
}

export function createPrioritySelect(attributes = {}) {
  return createElement("select", { name: "priority", ...attributes }, createPriorityOptions());
}
