# Evolutionary Sandbox (browser-only)

A single-player, 2D evolution toy that runs entirely in the browser. Guide an organism from a lone cell toward more complex forms across staged prototypes. No backend, no networking. A tiny static server script is included so you can launch the game quickly without extra tooling.

## Architecture overview
- **index.html** – Entry point, layout, HUD, evolution menu.
- **style.css** – Visual theme and layout.
- **src/main.js** – Bootstraps the canvas, input, stage selection, HUD, and evolution menu wiring.
- **src/core/** – Small utilities (input handling, math helpers).
- **src/config/evolutionTree.js** – Data-driven descriptors for trait costs/bonuses.
- **src/stages/** – Each stage encapsulates update/render logic and its own evolution options.
  - `stage1/` Single-cell stage (playable).
  - `stage2/` Aquatic creature prototype with herbivore/carnivore leanings (playable).
  - `stage3/` Land creature skeleton (TODO stubs for terrain, packs, defenses).
  - `stage4/` Civilization skeleton (TODO stubs for resources and tech).

## How to run locally
Everything is already committed—no build step or npm install is required. You just need a static server so the browser will allow ES module imports.

1. **Choose a simple server** from the repo root:
   - **Node helper (included here):**
     ```bash
     node serve.js
     ```
     The script prints the local URL (defaults to `http://localhost:8000`).
   - **Python (if you have it):**
     ```bash
     python -m http.server 8000
     ```
   - **VS Code Live Server:** Right-click `index.html` → “Open with Live Server.”
2. Open the printed URL (usually `http://localhost:8000`) in your browser.
3. Use the top bar to switch stages or restart the current one. Press **E** or click **Evolution Menu** to spend points.
4. If the page is blank, verify you are using `http://` and not `file://` (browsers block ES module imports when opened directly from disk).

## Gameplay notes
- Stage 1: Move a single cell, collect food for energy and evolution points, avoid hazards, and upgrade speed/perception/health.
- Stage 2: Control a multi-part aquatic creature. Choose herbivore or carnivore to earn bonuses from plants or prey; perception upgrades expand detection.
- Stage 3 & 4: Framework only with TODO markers to extend into land and civilization gameplay.
