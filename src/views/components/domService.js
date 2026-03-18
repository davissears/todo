//   className="drawer-item-btn"
// <button
//   data-id={item.id}
//   aria-label={`View details for ${item.title}`}
// >
//   {item.title}
// </button>;
//
// <HorizontalDrawer isOpen={true} project={project} />
// React.createElement('button', {
//   className="drawer-item-btn",
//  data-id={item.id},
//   aria-label={`View details for ${item.title}`}
// }, item.title)

// function HorizontalDrawer(attributes) {
//   if (!attributes.isOpen) {
//     return createElement('div', {}, [])
//   }
//   const project = attributes.project;
//   // the code from the other place
// }

//-------------------------------------default parameters: prevents undefined errors
export function createElement(tagName, attributes = {}, children = []) {
  const item = document.createElement(tagName);

  // handle attributes
  for (const key in attributes) {
    // if gaurd protects from:
    // --null objects throwing type errors
    // --hasOwnProperty shadowing
    // --prototype polution: ignores attributes not explicitly defined
    if (Object.prototype.hasOwnProperty.call(attributes, key)) {
      // map className to class just to be safe
      const attributeName = key === "className" ? "class" : key;
      let value = attributes[key];

      // class utility: join arrays for classes (ex. class: ['btn', 'btn-primary'])
      // why?: easier dynamic styling
      if (attributeName === "class" && Array.isArray(value)) {
        value = value.join(" ");
      }
      // gives DOM node provided properties
      item.setAttribute(attributeName, value);
    }
  }

  // appends children (handles strings, elements, and nested arrays)
  const appendChild = (parent, child) => {
    // de-nesting
    if (Array.isArray(child)) {
      child.forEach((nestedChild) => appendChild(parent, nestedChild));

      //gaurds null / undefined values
    } else if (child !== null && child !== undefined) {
      parent.append(child);
    }
  };

  appendChild(item, children);

  return item;
}

// Children can be:
// element[] | element
//
// element is
// string | HTMLElement

// createElement('h1', { class: 'welcome' }, 'Hello world')

// createElement('h1', { class: 'welcome' }, ['Hello world', 'My name is', 'Carlos'])

// createElement('h1', { class: 'welcome' }, createElement('span', {}, 'Hello world'))

// createElement('h1', { class: 'welcome' }, [
//   createElement('span', {}, 'Hello world'),
//   'My name is carlos',
//   ['Welcome', 'to app']
// ])

// const attributes = {
//   class: "drawer-item-btn",
//   "data-id": "stringId",
//   "aria-label": `View details for item.title`,
// };
// const item = createTextElement("testTag", attributes, "textContent");
// console.log(item);

// function createElement(tagName, attributes, children) {
//   if (children is a string) {
//     createTextElement
//   }
//   if (children is an array) {

//   }
// }
