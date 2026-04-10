# Azurita — Claude Compatibility Guide

## Source Of Truth
- The canonical repo guidance is maintained in the Codex-native surfaces: `AGENTS.md`, `backend/AGENTS.md`, `.agents/skills/*`, `.codex/config.toml`. There is no `frontend/AGENTS.md` for Azurita because the frontend lives in `advent-calendar/`, not `frontend/`.
- This `CLAUDE.md` file is a compatibility mirror for mixed-tool teams and should stay aligned with the Codex guidance.
- Project-level context lives in `README.md`, `BUILD.md`, and `docs/`. There is no `docs/methodology/` Memory Bank yet.

## Project Overview
- **What it is**: an interactive advent-calendar / daily-puzzles experience.
- **Stack**: Django 5.2 + DRF (backend, mostly an SPA shell + Huey schedule) / Vue 3 + TypeScript + Vite (frontend in `advent-calendar/`) / SQLite / Redis / Huey / GSAP + Tailwind for animation/UI.
- **Production path**: `/home/ryzepeck/webapps/azurita`.
- **Services**: `azurita.service`, `azurita.socket`, `azurita-huey.service`.
- **Environment**: staging-class workload. SQLite at `backend/db.sqlite3`. SMTP not used; emails are not part of the current scope.
- **Frontend output is served by Django** through `templates/index.html` + the catch-all `index` view.

## Architecture Invariants
- The backend has **no business-logic Django app** yet. `puzzles/` is an empty stub. New business logic should either land in `puzzles/` or in a new app under `backend/`.
- The single existing view (`azurita_project.views.index`) renders `templates/index.html`. When adding API endpoints, prefer **function-based views with `@api_view`** for consistency with the rest of the user's project ecosystem.
- The frontend lives in `advent-calendar/` (Vue 3 + TS + Vite). Do **not** create a `frontend/` directory or move things into it.
- Build output (`static/frontend/`) and DB (`db.sqlite3`) are gitignored generated artifacts.
- Settings are split into `azurita_project/{settings,settings_dev,settings_prod}.py`. Production must set `DJANGO_SETTINGS_MODULE=azurita_project.settings_prod`, plus `DJANGO_SECRET_KEY` and `DJANGO_ALLOWED_HOSTS`.
- `huey.contrib.djhuey` is used; tasks live in `backend/azurita_project/tasks.py`. In dev, `HUEY['immediate']=True` so no worker is needed.
- `django-silk` is gated behind `ENABLE_SILK=True` env var. Off by default.

## Working Rules
- Prefer existing project patterns over generic framework advice.
- The repo is Django-light: don't fabricate apps, models, or services that aren't there. Read first.
- Do not change old migrations; add new migrations when schema changes are required.
- Keep security basics intact: validated serializer inputs, ORM-first queries, escaped rendering, CSRF/session boundaries, and no secrets in code.
- `manage.py` and `venv/` live at the **repo root**, not inside `backend/`.

## Commands
- Activate venv: `source venv/bin/activate` (from repo root).
- Backend dev server: `python manage.py runserver`
- Backend tests: `pytest backend/path/to/test_file.py -v` (or `--no-cov` for speed).
- Frontend dev server: `npm --prefix advent-calendar run dev`
- Frontend build: `npm --prefix advent-calendar run build`
- Frontend tests: not yet established.
- Make migrations: `python manage.py makemigrations <app>` then `python manage.py migrate`.

## Testing Constraints
- Never run the full test suite.
- Maximum 20 tests per batch and 3 test commands per cycle.
- Run only the smallest backend slice needed for the changed behavior.
- `pytest.ini` enables `--cov=azurita_project --cov-branch` by default — pass `--no-cov` for fast iteration.

## Memory Bank
- **Not yet established.** No `docs/methodology/` and no `tasks/` directory exist.
- Long-lived project context lives in `README.md` (overview, stack, dev setup) and `BUILD.md` (build instructions for the SPA).
- If you need to bootstrap a Memory Bank, use the `methodology-setup` skill.
