---
trigger: model_decision
description: Project intelligence and lessons learned for Azurita. Reference for project-specific patterns, preferences, and key insights discovered during development.
---

# Lessons Learned — Azurita

---

## 1. Architecture Patterns

### Minimal Backend, SPA-Heavy Frontend
- The Django backend is intentionally minimal: a single `index` view that serves the Vue SPA, a `/api/health/` health check, and an admin site. There is **no business-logic Django app** — the `puzzles/` app is a stub with empty `models.py` and `views.py`.
- All product behavior (puzzles, advent calendar interactions, animations) lives in the Vue 3 + TypeScript + Vite SPA in `advent-calendar/`.

### SPA Shell Pattern
- `templates/index.html` is the only Django template. It uses `{% load static %}` and injects the Vite-built JS/CSS bundles from `static/frontend/assets/`.
- The catch-all URL pattern routes any non-`/admin/`, non-`/api/` request to the `index` view, letting the Vue Router handle client-side routing.
- Build flow: `npm --prefix advent-calendar run build` → emits to `static/frontend/` → `manage.py collectstatic` → nginx serves.

### SQLite + Automated Backups
- Production uses SQLite (`backend/db.sqlite3`) — appropriate for the staging-class workload.
- `django-dbbackup` runs every Monday 03:00 UTC via Huey, retaining the last 4 backups in `BACKUP_STORAGE_PATH` (default `/var/backups/azurita`).

### Huey Periodic Tasks (all in `backend/azurita_project/tasks.py`)
- `scheduled_backup` — Mon 03:00 UTC (DB snapshot + retention)
- `silk_garbage_collection` — daily 04:30 UTC (gated by `ENABLE_SILK`)
- `weekly_slow_queries_report` — Thu 07:00 UTC (Markdown under `backend/logs/silk-reports/`)
- `silk_reports_cleanup` — 1st of month 05:45 UTC (purges reports older than 6 months)
- In dev (`DJANGO_ENV != production`), `HUEY['immediate'] = True` — tasks run synchronously, no worker needed.

### Conditional Silk Profiling
- `django-silk` activates only when `ENABLE_SILK=True` in env. Off by default.
- When active, adds `/silk/` (staff-only) for ad-hoc performance investigation.

---

## 2. Code Style & Conventions

### Backend Views: FBV Only
- One existing view: `azurita_project.views.index` — plain FBV rendering `index.html`.
- No DRF endpoints yet. When adding APIs, use `@api_view` FBVs. Do not introduce CBVs/APIView.

### Settings Split by Environment
- `azurita_project/settings.py` — base, uses python-decouple for env vars.
- `azurita_project/settings_dev.py` — `DEBUG=True`, `ALLOWED_HOSTS=['*']`.
- `azurita_project/settings_prod.py` — `DEBUG=False`, HSTS (1y), `SECURE_SSL_REDIRECT`, secure cookies, requires `DJANGO_SECRET_KEY` + `DJANGO_ALLOWED_HOSTS`.
- `DJANGO_SETTINGS_MODULE` is always `azurita_project.settings`. Production mode is activated by `DJANGO_ENV=production`. **Never use `settings_prod` as the module name directly.**

### Frontend: Vue 3 + TypeScript + Vite (in `advent-calendar/`)
- State management: Pinia (composition API style with `defineStore`).
- No HTTP client configured yet — uses native fetch or will be added.
- Component naming: PascalCase (CountdownTimer.vue, CustomCursor.vue).
- Puzzle views use lowercase with underscores (puzzle_1.vue … puzzle_31.vue).
- Tailwind CSS v4 with custom Christmas-themed color palette.

---

## 3. Development Workflow

### Backend Commands
```bash
source venv/bin/activate    # venv at repo root, not in backend/
python manage.py runserver  # manage.py is at repo root
pytest backend/path/to/test_file.py -v  # always specify files
```

### Frontend Dev
```bash
npm --prefix advent-calendar run dev    # Vite dev server, default :5173
npm --prefix advent-calendar run build  # emits to static/frontend/
npm --prefix advent-calendar run lint
```

### Test Execution Rules
- Never run the full test suite — always specify files.
- Backend: `pytest backend/path/to/test_file.py -v` (max 20 tests/batch, 3 commands/cycle).
- Frontend: Vitest configured but no tests yet. When added: `npm --prefix advent-calendar test -- path/to/file.spec.ts`.
- E2E: not yet established.

---

## 4. Production Deployment

### Build Flow
1. Frontend: `npm --prefix advent-calendar run build` → generates `static/frontend/`
2. Backend: `DJANGO_ENV=production python manage.py collectstatic --noinput`
3. Restart: `sudo systemctl restart azurita && sudo systemctl restart azurita-huey`
4. Verify: `bash /home/ryzepeck/webapps/ops/vps/scripts/deployment/post-deploy-check.sh azurita`

See `.agents/skills/deploy-and-check/SKILL.md` for the canonical sequence.

---

## 5. Known Issues

_No known issues recorded yet. When a bug warrants long-lived documentation, add it here:_
```
#### [KNOWN-NNN] short title
- **Context**: ...
- **Workaround**: ...
```
