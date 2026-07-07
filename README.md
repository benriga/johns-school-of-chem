# John's School of Chem — Interactive Periodic Table

A simple, static web app that renders all 118 elements as a clickable periodic
table. Click an element for details; filter the table with the search box.

This is the **first pass** — a web prototype written in plain HTML/CSS/JS with
no build step, so it can be served directly from GitHub Pages. Future
iterations may rebuild this as native iOS (Swift/SwiftUI) and Android (Kotlin)
apps.

## Run on Github

<https://benriga.github.io/johns-school-of-chem/>


## Run locally

It's a static site, so any local web server works. From the project root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (Opening `index.html` via `file://` will
fail because the JS uses ES module imports, which browsers block on `file://`.)

## Project layout

- `index.html` — page shell, search box, details panel
- `styles.css` — CSS Grid layout and category colors
- `elements.js` — data for all 118 elements (number, symbol, name, mass,
  category, and `x`/`y` grid position)
- `app.js` — renders the table, legend, and details panel; handles search

## Deploying to GitHub Pages

1. Create a repo on GitHub and push this directory.
2. In **Settings → Pages**, set the source to the `main` branch root.
3. Visit the published URL (a minute or so after the first deploy).

## Roadmap

- Richer element details (electron configuration, discovery, uses)
- Filter by category / state of matter / metal vs. nonmetal
- Element images
- Native iOS port (Swift / SwiftUI)
- Native Android port (Kotlin)
