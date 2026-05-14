# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Source Of Truth
- The canonical repo guidance is maintained in the Codex-native surfaces: `AGENTS.md`, `backend/AGENTS.md`, `.agents/skills/*`, `.codex/config.toml`. There is no `frontend/AGENTS.md` for Azurita because the frontend lives in `advent-calendar/`, not `frontend/`.
- This `CLAUDE.md` file is a compatibility mirror for mixed-tool teams and should stay aligned with the Codex guidance.
- Project-level context lives in `README.md`, `BUILD.md`, and `docs/`. Memory Bank is at `docs/methodology/` + `tasks/`.

## Project Overview
- **What it is**: an interactive advent-calendar / daily-puzzles experience.
- **Stack**: Django 5.2 + DRF (backend, mostly an SPA shell + Huey schedule) / Vue 3 + TypeScript + Vite (frontend in `advent-calendar/`) / SQLite / Redis / Huey / GSAP + Tailwind for animation/UI.
- **Production path**: `/home/ryzepeck/webapps/azurita`.
- **Services**: `azurita.service` (Gunicorn), `azurita-huey.service`.
- **Environment**: staging-class workload. SQLite at `backend/db.sqlite3`. SMTP not used.
- **Frontend output is served by Django** through `templates/index.html` + the catch-all `index` view.

## Directory Structure

```mermaid
flowchart TD
    Root[Project Root]
    Root --> Backend[backend/ — Django project]
    Root --> AdventCal[advent-calendar/ — Vue 3 SPA source]
    Root --> Templates[templates/ — index.html SPA shell]
    Root --> Static[static/frontend/ — Vite build output]
    Root --> Puzzles[puzzles/ — Django app stub]
    Root --> Docs[docs/ — standards and guides]
    Root --> Scripts[scripts/ — quality and test runners]
    Root --> AgentSkills[.agents/skills/]

    Backend --> BProject[azurita_project/ — settings, urls, tasks, views]
    Backend --> BConftest[conftest.py + pytest.ini]
    Backend --> BLogs[logs/]

    AdventCal --> AdventSrc[src/ — Vue components, stores, router]
    AdventCal --> AdventPkg[package.json + vite.config]

    AgentSkills --> SkillSet[plan, implement, debug, deploy-and-check, git-commit, etc.]
```

- `manage.py` and `venv/` live at the **repo root**, not inside `backend/`.
- `static/frontend/` and `backend/db.sqlite3` are gitignored generated artifacts.

## Architecture Invariants
- The backend has **no business-logic Django app** yet. `puzzles/` is an empty stub. New business logic should either land in `puzzles/` or in a new app under `backend/`.
- The single existing view (`azurita_project.views.index`) renders `templates/index.html`. When adding API endpoints, prefer **function-based views with `@api_view`** for consistency.
- The frontend lives in `advent-calendar/` (Vue 3 + TS + Vite). Do **not** create a `frontend/` directory or move things into it.
- Settings are split into `azurita_project/{settings,settings_dev,settings_prod}.py`. `DJANGO_SETTINGS_MODULE` is always `azurita_project.settings`; production mode is activated by `DJANGO_ENV=production` (which auto-imports `settings_prod.py`). Never use `settings_prod` as the module directly.
- `huey.contrib.djhuey` is used; tasks live in `backend/azurita_project/tasks.py`. In dev, `HUEY['immediate']=True` so no worker is needed.
- `django-silk` is gated behind `ENABLE_SILK=True` env var. Off by default.

## Architecture Patterns

**Minimal backend, SPA-heavy frontend** — The Django backend serves a single `index` view that renders the Vue SPA shell. All product behavior lives in `advent-calendar/`. The catch-all URL pattern routes any non-`/admin/`, non-`/api/`, non-`/silk/` request to Vue Router.

**SPA shell pattern** — `templates/index.html` is the only Django template. It uses `{% load static %}` and injects the Vite-built JS/CSS bundles from `static/frontend/assets/`. Build flow: `npm run build` → `static/frontend/` → `collectstatic` → nginx + Gunicorn serve.

**Huey periodic tasks** (all in `backend/azurita_project/tasks.py`):
- `scheduled_backup` — Mon 03:00 UTC (DB snapshot via `django-dbbackup`, last 4 retained in `/var/backups/azurita`)
- `silk_garbage_collection` — daily 04:30 UTC (gated by `ENABLE_SILK`)
- `weekly_slow_queries_report` — Thu 07:00 UTC (Markdown under `backend/logs/silk-reports/`)
- `silk_reports_cleanup` — 1st of month 05:45 UTC (purges reports older than 6 months)

## Working Rules
- Prefer existing project patterns over generic framework advice.
- The repo is Django-light: don't fabricate apps, models, or services that aren't there. Read first.
- Do not change old migrations; add new migrations when schema changes are required.
- Keep security basics intact: validated serializer inputs, ORM-first queries, escaped rendering, CSRF/session boundaries, and no secrets in code.

## Commands

```bash
# Activate venv (from repo root — venv/ lives here, not in backend/)
source venv/bin/activate

# Backend dev server
python manage.py runserver

# Backend lint
ruff check backend/

# Make and apply migrations
python manage.py makemigrations <app>
python manage.py migrate

# Frontend dev server (Vite, default :5173)
npm --prefix advent-calendar run dev

# Frontend build (emits to static/frontend/)
npm --prefix advent-calendar run build

# Frontend lint
npm --prefix advent-calendar run lint

# Collect static for production
python manage.py collectstatic --noinput

# Backend tests — always specify files, never run bare pytest
pytest backend/path/to/test_file.py -v
pytest backend/path/to/test_file.py --no-cov  # fast, skips coverage
```

## Testing
- **Never run the full test suite.** Always specify files.
- Maximum **20 tests per batch**, **3 test commands per cycle**.
- `pytest.ini` at `backend/pytest.ini` sets `DJANGO_SETTINGS_MODULE=azurita_project.settings` and adds `--cov=azurita_project --cov-branch` by default — pass `--no-cov` for fast iteration.
- Frontend (Vue 3 SPA in `advent-calendar/`): **no test suite yet**. When added: `npm --prefix advent-calendar test -- path/to/file.spec.js`.
- E2E: not yet established.

**Quality rules** (full reference: `docs/TESTING_QUALITY_STANDARDS.md`):
- Each test verifies **one specific behavior** — no conjunctions in test names.
- Follow **AAA pattern**: Arrange → Act → Assert.
- Assert **observable outcomes** (status codes, DB state, rendered UI).
- Mock only at **system boundaries** (external APIs, clock, email). No DB mocks.

## Production Deployment

```bash
# 1. Build frontend
npm --prefix advent-calendar run build

# 2. Collect static
python manage.py collectstatic --noinput

# 3. Restart services
sudo systemctl restart azurita && sudo systemctl restart azurita-huey

# 4. Verify
bash /home/ryzepeck/webapps/ops/vps/scripts/deployment/post-deploy-check.sh azurita
```

See `.agents/skills/deploy-and-check/SKILL.md` for the canonical sequence.

## Quality Tooling
- `scripts/test_quality_gate.py` — semantic test-quality analyzer (assertions, mocks, selectors) run alongside Ruff lint.
- `scripts/run-tests-all-suites.py` — multi-suite orchestrator (backend-focused until frontend tests are added).
- `.pre-commit-config.yaml` — pre-commit hooks at repo root.
<!-- session-start-protocol:begin -->
## Session Start Protocol

Al inicio de **cada sesión y antes de editar archivos**, debes invocar la skill `git-sync` para este repo. Razón: el operador trabaja desde múltiples máquinas y procesos automatizados (cron, CI) pueden haber commiteado cambios que tu copia local no tiene; editar sobre una versión desactualizada genera conflictos o trabajo duplicado.

**Flujo:**
1. Un hook `SessionStart` (definido en `.claude/settings.json`) ejecuta `git fetch + git status` read-only y te inyecta el estado de este repo como contexto.
2. Si el reporte indica `behind > 0` o `dirty > 0`, **invoca la skill `git-sync`** antes de hacer cualquier cambio. `git-sync` hace rebase contra el parent branch y, si hay conflictos, te guía interactivamente por la resolución.
3. Si el reporte indica `behind=0 ahead=0 dirty=0`, el repo ya está sincronizado y puedes proceder.

**Importante:** Nunca uses `git pull --force`, `git reset --hard` ni stash automático para "resolver" el sync — usa siempre la skill `git-sync`, que es segura y reproducible.
<!-- session-start-protocol:end -->
<!-- e2e-user-flows-protocol:begin -->
## E2E User Flows Check

Cuando termines de implementar un cambio que afecte un **flujo de usuario en el frontend** — por ejemplo:
- Crear o editar un formulario (agregar/quitar campos)
- Nueva ruta, página o vista accesible al usuario
- Cambios en flujos de autenticación, checkout, onboarding, búsqueda, perfil
- Modificaciones a `docs/USER_FLOW_MAP.md` o `frontend/e2e/flow-definitions.json`

…debes invocar la skill `e2e-user-flows-check` como **paso final** antes de reportar la implementación como completa. Esa skill audita la cobertura E2E del flujo modificado y reporta brechas/riesgos.

**Por qué:** los flujos de usuario en frontend cambian las assumptions de los tests E2E. Sin auditoría, un campo eliminado deja tests "verdes" pero inválidos, y un form nuevo queda sin cobertura.

**No aplica para:** correcciones aisladas que no cambian el flujo (typos, refactors internos, estilos puros, dependency bumps), ni cambios solo en backend que no alteren UX.

**Recordatorio automático:** un hook `Stop` revisa al cierre del turno si hay cambios uncommitted bajo `frontend/src/`, `frontend/app/`, etc., y te lo inyecta como contexto. El hook es un recordatorio, no bloqueante — la regla aplica igual aunque el hook no dispare.
<!-- e2e-user-flows-protocol:end -->
