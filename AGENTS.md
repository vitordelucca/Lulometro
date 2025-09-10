# Repository Guidelines

## Project Structure & Module Organization
- Rooted static app. Key files:
  - `index.html` (entry), `styles.css` (UI), `chart.js` (main chart logic).
  - Feature modules: `advanced-analytics.js`, `advanced-export.js`, `chart-type-toggle*.js`, `data-table.js`, `date-filter.js`, `keyboard-nav.js`, `loading.js`, `error-handler.js`, `theme-toggle.js`.
  - PWA: `service-worker.js`, `manifest.json`, icons (`icon-192.png`, `icon-512.png`).
  - Tooling: `package.json`, `test-setup.js`, `README.md`.
- Keep new JS files in root, kebab-case: `feature-name.js`. Co-locate small helpers with the feature; avoid nested folders unless necessary.

## Build, Test, and Development Commands
- `npm start` — serves the project locally (`npx serve .`). Visit `http://localhost:3000`.
- `npm run build` — minifies JS (`terser`) and CSS (`csso`) into `chart.min.js` and `styles.min.css`.
- `npm test` — runs lightweight smoke setup via `test-setup.js`.
- You can also open `index.html` directly for quick checks (no server), but use `npm start` to test PWA/service worker.

## Coding Style & Naming Conventions
- JavaScript: ES6+, 2-space indentation, camelCase for variables/functions, UPPER_SNAKE_CASE for constants.
- Filenames: kebab-case (e.g., `date-filter.js`, `error-handler.js`).
- Avoid frameworks; prefer vanilla JS and small utilities. Keep globals minimal; expose only needed functions on `window` like existing code.
- Keep UI text in Portuguese to match the current app.

## Testing Guidelines
- Current tests are minimal. Prefer small, focused checks run by `npm test`.
- If adding tests, place under `tests/` or co-locate as `*.spec.js`. Use Node-based assertions or introduce Jest/Vitest only if scoped and documented.
- Ensure `npm test` passes in CI and locally.

## Commit & Pull Request Guidelines
- Commits: imperative mood, concise subject, meaningful scope (e.g., "chart: adjust y-bounds").
- PRs: clear description, rationale, and before/after screenshots for UI changes; link issues when applicable. Confirm `npm run build` output and basic flows (load chart, export CSV/PNG).

## Security & Configuration Tips
- Do not commit secrets; this is a static client app.
- When changing cached assets, bump `CACHE_NAME` in `service-worker.js` to invalidate old caches.
