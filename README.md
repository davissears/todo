# Todo

A browser-based todo/project manager built for The Odin Project's JavaScript
Todo List assignment:

https://www.theodinproject.com/lessons/node-path-javascript-todo-list

## Tech Stack

- Bun for scripts, development server, builds, and tests
- Vanilla JavaScript modules
- HTML and CSS bundled through Bun's HTML entrypoint
- `localStorage` persistence through `StorageService`
- `happy-dom` for DOM-capable unit tests

## Getting Started

Install dependencies:

```sh
bun install
```

Run the development server:

```sh
bun run dev
```

Build the production bundle:

```sh
bun run build
```

Run unit tests:

```sh
bun run test:unit
```

## Project Structure

- `index.html` is the Bun HTML entrypoint.
- `src/index.js` wires the model and view through the controller.
- `src/model/` contains the app data model and task object classes.
- `src/services/storage.js` serializes and deserializes projects for
  `localStorage`.
- `src/views/` contains layout and DOM-facing view components.
- `tests/unit/` contains Bun unit tests with `happy-dom` browser globals.
- `dist/` contains generated build output.

## App Notes

The app uses a small MVC-style architecture. The model owns project/task state,
the view owns DOM rendering and events, and the controller coordinates user
actions by updating the model and asking the view to re-render.

Projects can contain todos and checklists. Checklists can contain check items.
Project and item state is persisted under the `todo-app-data` localStorage key.

## Development Notes

- Prefer Bun commands over Node/npm equivalents.
- Keep model mutations explicit: some model methods intentionally do not save
  automatically because the controller decides when persistence and rendering
  happen.
- When changing serialized data shapes, update `src/services/storage.js` and
  add or adjust storage-focused tests.
- Do not hand-edit generated files in `dist/`; rebuild them with
  `bun run build`.
