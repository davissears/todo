# Repository Guidelines

## Project Overview

This is a Bun-powered vanilla JavaScript todo/project manager for The Odin
Project Todo List assignment. It uses an MVC-style structure:

- `src/index.js` creates the `Model`, `View`, and controller wiring.
- `src/model/` owns app state and object classes for projects, todos,
  checklists, and check items.
- `src/services/storage.js` handles `localStorage` serialization and
  deserialization for the `todo-app-data` key.
- `src/views/` owns DOM layout, rendering, modals, drawers, and event binding.
- `tests/unit/` contains Bun tests; `tests/unit/setup.js` registers `happy-dom`
  globals for DOM and `localStorage` support.

## Commands

Use Bun for this repository.

```sh
bun install
bun run dev
bun run build
bun run test:unit
```

Avoid npm, yarn, pnpm, vite, webpack, jest, and vitest unless the project is
explicitly migrated.

## Development Conventions

- Preserve the existing MVC boundary: model code should stay DOM-free, view code
  should handle DOM concerns, and controller code should coordinate between
  them.
- Prefer explicit persistence. Some model methods intentionally mutate state
  without calling `save()` so the controller can control save and render timing.
- Keep generated build output in `dist/` out of manual edits. Change source files
  and rebuild with `bun run build`.
- When changing object shape, persistence, or date/priority/note behavior,
  update `src/services/storage.js` and the related unit tests.
- Keep comments useful and sparse. The codebase already has some orienting
  comments; add new ones only where they reduce genuine ambiguity.

## Testing Guidance

- Run `bun run test:unit` after model, storage, or DOM helper changes.
- Add focused tests under `tests/unit/` for new model behavior, storage
  serialization, and reusable DOM helpers.
- Use the existing `happy-dom` setup instead of introducing another browser test
  environment.

## Frontend Guidance

- Keep the current vanilla JS module approach unless asked to migrate.
- Reuse existing view components and DOM service helpers before adding new
  rendering patterns.
- For UI changes, verify both behavior and layout in the browser when practical.
