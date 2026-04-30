# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

This is a static site with no build step or package manager. Open `index.html` directly in a browser:

```bash
open index.html
# or serve locally:
python3 -m http.server 8080
```

## Architecture

Single-page to-do app built with plain HTML/CSS/JS — no frameworks, no bundler, no dependencies.

- **`index.html`** — markup only; references `style.css` and `script.js`
- **`script.js`** — all app logic in one `DOMContentLoaded` listener; state is a plain `todos` array (`{ text, completed }`) persisted to `localStorage`
- **`style.css`** — all styles; no preprocessor

State flow: every mutation (`addTodo`, `toggleTodo`, `deleteTodo`) calls `saveTodos()` then `renderTodos()`, which does a full re-render of `#todo-list` from the in-memory array.
