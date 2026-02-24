# TacDraw — MCOO Generator

> A browser-based tactical overlay editor for intelligence and operations products.
> No install, no account, no data leaves your machine.

**[Live app →](https://kelaxten.github.io/mcoo-generator/)**

---

## What is this?

TacDraw is a free, open-source tool for building **Modified Combined Obstacle Overlays (MCOOs)** and other doctrinal intelligence graphics. Load a map image, place ATP 2-01.3 compliant symbols and overlays, and export a clean JPG, PNG, or PDF — all in the browser.

It is designed for analysts and planners who need to produce quick, professional-looking terrain products without access to AMDCOORD, ArcGIS, or other enterprise GIS tooling.

---

## Features

**Canvas**
- Load any PNG, JPG, or WEBP map image (drag-and-drop or file picker)
- Ctrl+scroll wheel zoom (0.25×–8×), auto-fit on load
- Snap-to-grid with configurable grid size (20 / 40 / 80 px)
- Right-click context menu: bring forward/backward, duplicate, delete

**Elements**
- 30+ doctrinal overlay types across 10 ATP 2-01.3 categories
- Per-element: label/text edit, color, opacity, rotation, resize
- Lock elements to prevent accidental edits
- Toggle visibility without deleting
- Drag-to-reorder layers in the Layers panel

**Export**
- JPG (high-quality), PNG (lossless), PDF (print-ready)
- All exports are 2× pixel ratio for crisp output
- Unobtrusive watermark composited at export time

**Project**
- Save/load `.mcoo` project files (JSON, stays on your machine)
- 50-step undo/redo history

**Keyboard shortcuts**

| Shortcut | Action |
|---|---|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Ctrl+D` | Duplicate selected |
| `Ctrl+S` | Save project |
| `Ctrl+0` | Reset zoom |
| `Ctrl+]` | Bring to front |
| `Ctrl+[` | Send to back |
| `Ctrl+Shift+E` | Export JPG |
| `Ctrl+Shift+P` | Export PDF |
| `Delete` / `Backspace` | Delete selected |
| `Escape` | Deselect / close panel |

---

## Element library

| Category | Elements |
|---|---|
| Terrain Overlays | Water / Unfordable, Restrictive Terrain, Severely Restrictive, Dead Ground / Defilade |
| Linear Obstacles | Linear Obstacle, Elevated Rail, Wire / Concertina |
| Obstacle Effects | Fix, Block, Disrupt, Turn |
| Obstacle Areas | Minefield Area, Breach Lane, Obstacle Group |
| Tactical | Avenue of Approach, Mobility Corridor, Key Terrain, Objective |
| Areas of Interest | NAI, TAI, Decision Point |
| Control Measures | Phase Line, Limit of Advance, Battle Position, Engagement Area |
| Threat / SITEMP | Enemy Axis of Advance, Enemy Avenue (Templated), Threat / Enemy Area |
| Callouts & Labels | Analyst Callout, AA Label Box |
| Map Elements | Legend Block, Title Block, AO Boundary, Header Bar, FOUO Footer |

---

## Getting started

```bash
npm install
npm run dev        # development server at http://localhost:5173
npm run build      # production build (runs tests first)
npm test           # run the full test suite (262 tests)
npm run test:watch # watch mode
npm run test:coverage
```

The project uses [Vitest](https://vitest.dev/) with a jsdom environment. Tests cover the full Zustand store, element registry structural integrity, and export utility behavior. A failing test blocks `npm run build` and the GitHub Pages deploy.

---

## Tech stack

| | |
|---|---|
| Framework | React 19 + Vite 5 |
| Canvas | react-konva (Konva.js) |
| State | Zustand 5 |
| PDF export | jsPDF 4 |
| Styling | Tailwind CSS + custom design tokens |
| Tests | Vitest 4 + jsdom |

---

## Contributing

Bug reports and feature requests welcome — open an issue or use the **[?] Feedback** button inside the app.

If you're adding a new element type, add it to `src/elements/index.js` and include it in a `TOOLBAR_SECTIONS` entry — the registry structural tests will catch any mismatches automatically.

---

## License

MIT — see [LICENSE](LICENSE).
