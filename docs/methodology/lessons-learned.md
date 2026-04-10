# Lessons Learned — Azurita

Updated as new insights are discovered during development.

---

## Architecture Patterns

### Minimal Backend, SPA-Heavy Frontend
- The Django backend is intentionally thin: one FBV view (`index`), one health endpoint, admin, and Huey ops tasks. All product logic (puzzles, unlock rules, animations) lives in the Vue 3 SPA.
- When adding product features, default to the Vue SPA layer. Only add Django endpoints when server-side state or validation is genuinely needed.

### SPA Shell Pattern
- `templates/index.html` is the only Django template. It uses `{% load static %}` and injects Vite-built bundles via their hashed filenames.
- The catch-all URL (`path('', views.index)`) must remain LAST in `urlpatterns` so `/admin/` and `/api/` take precedence.
- `vite-plugin-django.ts` converts Vite asset paths to Django `{% static %}` template syntax during build.

### Client-Side State via localStorage
- Auth state (`authenticated`, `username`) and puzzle progress (`puzzle_N_solved`, `puzzle_N_response`) live entirely in localStorage.
- This is intentional for the current scope (single shared user, no backend persistence needed).
- If individual users or server-side validation are added later, this layer needs to be replaced with an API.

### Puzzle Unlock: Strict Date Guard
- The router guard uses `today > unlockDate` (strict greater-than), deliberately preventing day-of access. This means puzzle 1 unlocks on Dec 2, not Dec 1. Verify this is the intended UX before changing.

### Settings Split by Environment
- `settings.py` auto-imports `settings_dev` or `settings_prod` based on `DJANGO_ENV`.
- Never use `DJANGO_SETTINGS_MODULE=azurita_project.settings_prod` — it is not a standalone module.
- Production: set `DJANGO_ENV=production` in `.env` or in the deploy command prefix.

### Huey Immediate Mode
- In dev (`DJANGO_ENV != production`), `HUEY['immediate'] = True` runs tasks synchronously. No Redis or Huey worker needed for development. Tasks still need to be importable — check for syntax errors after changes to `tasks.py`.

### Conditional Silk Profiling
- `django-silk` is entirely off unless `ENABLE_SILK=True` in env. Good practice for staging: flip on for one session, then off. Log cleanup is automated via `silk_reports_cleanup` Huey task.

---

## Code Conventions

### Backend: FBV-Only
- No DRF endpoints yet. When adding APIs, use `@api_view` with FBVs — do not introduce CBVs/APIViews.
- Keep views thin: request/response wiring only. Business logic belongs in services, model methods, or Huey tasks.

### Frontend: No HTTP Client Yet
- No axios or centralized API service configured. When the first API endpoint is added, set up a `composables/useApi.ts` (or equivalent) backed by native `fetch`.
- Keep API calls out of components; route them through a composable or Pinia store action.

### Puzzle Components: Hardcoded Answers
- Each `puzzle_N.vue` has its answer hardcoded as a string literal in `checkAnswer()`. This is fine for the current scope but exposes answers to anyone reading the bundle. Document this risk before launching publicly.

### Component Naming
- PascalCase for reusable components (`CountdownTimer.vue`, `PuzzleCompleted.vue`).
- Puzzle views use snake_case (`puzzle_1.vue` … `puzzle_31.vue`) to match the URL parameter pattern.

---

## Development Workflow

### venv is at Repo Root
- `venv/`, `manage.py`, and `requirements.txt` are all at `/home/ryzepeck/webapps/azurita/`.
- Never `cd backend` before activating the venv. The correct pattern: `source venv/activate && python manage.py ...` from the repo root.

### pytest Finds Config via pytest.ini in `backend/`
- `pytest.ini` lives at `backend/pytest.ini`. When you run `pytest backend/path/to/test.py` from the repo root, pytest finds `backend/pytest.ini` and adds `backend/` to `sys.path`, making `azurita_project` importable.
- Always run with a specific file, e.g., `pytest backend/azurita_project/tests/test_health.py -v`.

### Frontend Tests: Not Established Yet
- Vitest is configured (`advent-calendar/vitest.config.ts`) but no test files exist.
- When writing the first test: `advent-calendar/src/__tests__/` for unit tests.

---

## Production Deployment

### Build Flow (always in this order)
1. `npm --prefix advent-calendar run build` → emits hashed assets to `static/frontend/`
2. `DJANGO_ENV=production python manage.py collectstatic --noinput` → copies to `staticfiles/`
3. `sudo systemctl restart azurita && sudo systemctl restart azurita-huey`
4. Run post-deploy check script

### Missing Step: Django's Two Settings Systems
- The gunicorn service uses `backend.wsgi:application` which defaults to `DJANGO_SETTINGS_MODULE=backend.settings` (the simple auto-generated settings at `backend/settings.py`).
- `manage.py` defaults to `azurita_project.settings` (the full settings with Huey, decouple, etc.).
- Run all deploy-time management commands (`migrate`, `collectstatic`) via `manage.py` from the repo root — they use the full settings.
