# Repository Guidelines

## Project Structure & Module Organization
This is a rooted static application served directly from the repository. `index.html` bootstraps the UI, `styles.css` handles presentation, and `chart.js` manages the chart lifecycle. Feature modules (such as `advanced-analytics.js`, `advanced-export.js`, `chart-type-toggle.js`, `data-table.js`, `date-filter.js`, `keyboard-nav.js`, `loading.js`, `error-handler.js`, and `theme-toggle.js`) live in the project root to keep imports simple. PWA assets include `service-worker.js`, `manifest.json`, and icons `icon-192.png`/`icon-512.png`. Build artifacts `chart.min.js` and `styles.min.css` are generated in place, so avoid editing them manually. Create new modules in the root using kebab-case filenames and co-locate lightweight helpers with their owning feature.

## Build, Test, and Development Commands
- `npm start` — serves the repository locally via `npx serve .`; open http://localhost:3000 for full PWA behaviour.
- `npm run build` — bundles and minifies JavaScript with Terser and CSS with csso into the `.min` files.
- `npm test` — runs the lightweight smoke suite defined in `test-setup.js` to catch obvious regressions.
For quick HTML-only checks you may open `index.html` directly, but always rely on `npm start` before shipping.

## Coding Style & Naming Conventions
Write modern ES6+ JavaScript with 2-space indentation. Use camelCase for variables and functions, and reserve UPPER_SNAKE_CASE for shared constants. Stick to vanilla JS and lean utilities; expand global surface only when a module must expose behavior on `window`. Maintain the app’s Portuguese UI copy and mirror tone when introducing new strings. Default to concise inline comments only where the intent is non-obvious.

## Testing Guidelines
Existing coverage is intentionally light. When adding tests, place them under `tests/` or alongside the feature as `*.spec.js`, reuse the Node assertion helpers in `test-setup.js`, and keep scenarios focused. Run `npm test` before submitting work and describe any areas left untested.

## Commit & Pull Request Guidelines
Write commit subjects in imperative mood with a clear scope prefix when helpful (e.g., `chart: ajustar limites`). Pull requests should summarise the change, link related issues, and attach before/after screenshots for UI updates. Confirm `npm run build` succeeds and manually exercise core flows: chart load, CSV/PNG export, theme toggles, and date filtering.

## Security & Configuration Tips
Never commit secrets or external tokens. When changing cached assets or build outputs, bump `CACHE_NAME` in `service-worker.js` to invalidate old caches. Verify that `manifest.json` and icon dimensions stay aligned with PWA requirements after asset tweaks.
