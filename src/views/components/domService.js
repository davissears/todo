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

export function createTextElement(tagName, attributes, text) {
  const item = document.createElement(tagName);

  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      item.setAttribute(key, attributes[key]);
    }
  }

  item.textContent = text;

  return item;
}

export function createElement(tagName, attributes, children) {
  const item = document.createElement(tagName);

  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      item.setAttribute(key, attributes[key]);
    }
  }

  if (typeof children === "string") {
    item.textContent = children;
  } else if (Array.isArray(children)) {
    item.append(...children);
  } else if (children instanceof HTMLElement) {
    item.append(children);
  }

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


