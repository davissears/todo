function normalizeAttributeName(key) {
  return key === "className" ? "class" : key;
}

function normalizeAttributeValue(attributeName, value) {
  return attributeName === "class" && Array.isArray(value)
    ? value.join(" ")
    : value;
}

function setAttributes(element, attributes) {
  for (const key in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, key)) {
      const attributeName = normalizeAttributeName(key);
      const value = normalizeAttributeValue(attributeName, attributes[key]);
      element.setAttribute(attributeName, value);
    }
  }
}

function isBlankChild(child) {
  return child === null || child === undefined;
}

function appendChild(parent, child) {
  if (Array.isArray(child)) {
    child.forEach((nestedChild) => appendChild(parent, nestedChild));
    return;
  }

  if (typeof child === "string") {
    parent.append(document.createTextNode(child));
    return;
  }

  if (isBlankChild(child)) return;

  parent.append(child);
}

export function createElement(tagName, attributes = {}, children = []) {
  const element = document.createElement(tagName);
  setAttributes(element, attributes);
  appendChild(element, children);
  return element;
}
