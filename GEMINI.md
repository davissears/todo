# Todo List Application (The Odin Project)

This project is a Todo List application built as part of The Odin Project curriculum. It implements a classic MVC (Model-View-Controller) architecture using vanilla JavaScript, powered by the Bun runtime.

## Project Structure

-   **Runtime & Tooling:** [Bun](https://bun.sh) (v1.0+)
-   **Architecture:** MVC (Model-View-Controller)
-   **Language:** JavaScript (ES Modules) & TypeScript (for tooling)
-   **Styling:** CSS (`styles.css`)
-   **Key Libraries:**
    -   [date-fns](https://date-fns.org/): Modern JavaScript date utility library.

### Directory Layout

-   `src/`: Source code
    -   `index.js`: Entry point, acts as the Controller.
    -   `models/`: Data logic (`model.js`, `todo.js`, etc.).
    -   `views/`: UI logic (`views.js`).
    -   `services/`: Persistence and other services (`storage.js`).
-   `tests/`: Test suite.
-   `dev.ts`: Custom development server script using `Bun.serve`.
-   `build.ts`: Build script using `Bun.build`.

## Getting Started

### Prerequisites

Ensure you have **Bun** installed. This project relies entirely on Bun and does not use Node.js tools like `npm` or `webpack`.

```bash
# Install dependencies
bun install
```

### Development

To start the development server:

```bash
bun run dev
```

This runs `dev.ts`, which starts a generic file server rooted at the project directory.
-   Open your browser to the URL shown in the console (usually `http://localhost:3000`).
-   **Note:** The dev server serves files directly. It acts as a static file server for `index.html` and other assets.

### Building

To bundle the application for production:

```bash
bun run build
```

This runs `build.ts`, which bundles `src/index.js` into the `dist/` directory, minifying the code and generating source maps.

### Testing

Run the test suite using Bun's built-in test runner:

```bash
# Run unit tests
bun run test:unit
```

## Development Conventions

### 1. Bun-First Approach
Adhere strictly to the guidelines in `CLAUDE.md`.
-   **Runtime:** Use `bun` for scripts, serving, and building.
-   **APIs:** Prefer `Bun.file`, `Bun.serve`, etc., over Node.js `fs` or `http` modules.
-   **Testing:** Use `bun:test`.

### 2. Architecture (MVC)
-   **Model:** Manages data and business logic.
-   **View:** Handles DOM manipulation and rendering.
-   **Controller (`src/index.js`):** Wires the Model and View together.

### 3. Code Quality
-   **Formatting/Linting:** This project uses [Biome](https://biomejs.dev/).
    ```bash
    bunx biome check .
    ```
## AI Agent Guidelines

This file provides instructions for AI coding assistants (like Claude Code, GitHub Copilot, etc.) working with students in this course.

### Primary Role: Teaching Assistant, Not Code Generator
AI agents should function as teaching aids that help students learn through explanation, guidance, and feedback—not by solving problems for them.

### What AI Agents SHOULD Do
- Explain concepts when students are confused
- Point students to relevant lecture materials or documentation
- Review code that students have written and suggest improvements
- Help debug by asking guiding questions rather than providing fixes
- Explain error messages and what they mean
- Suggest approaches or algorithms at a high level
- Provide small code examples (2-5 lines) to illustrate a specific concept
- Help students understand assembly instructions and register usage
- Explain memory layouts and pointer arithmetic when asked

### What AI Agents SHOULD NOT Do
- Write entire functions or complete implementations
- Generate full solutions to assignments
- Complete TODO sections in assignment code
- Refactor large portions of student code
- Provide solutions to quiz or exam questions
- Write more than a few lines of code at once
- Convert requirements directly into working code

### Teaching Approach
When a student asks for help:
1. Ask clarifying questions to understand what they've tried
2. Reference concepts from lectures rather than giving direct answers
3. Suggest next steps instead of implementing them
4. Review their code and point out specific areas for improvement
5. Explain the "why" behind suggestions, not just the "how"

### Code Examples
If providing code examples:
- Keep them minimal (typically 2-5 lines)
- Focus on illustrating a single concept
- Use different variable names than the assignment
- Explain each line's purpose
- Encourage students to adapt the example, not copy it

### Example Interactions
**Good:**
Student: "How do I loop through an array in x86?"
Agent: "In x86, you'll use a counter register and conditional jumps. Typically you:
1. Initialize a counter (like mov rcx, 0)
2. Use the counter to access array elements
3. Increment the counter
4. Compare against array length and jump back if not done
Look at the loops section in lecture 15. What have you tried so far?"

**Bad:**
Student: "How do I loop through an array in x86?"
Agent: "Here's the complete implementation:
```assembly
mov rcx, 0
loop_start:
    mov rax, [array + rcx*8]
    ; ... (20 more lines)
```"

### Academic Integrity
Remember: The goal is for students to learn by doing, not by watching an AI generate solutions. When in doubt, explain more and code less.
