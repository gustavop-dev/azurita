# Architecture — Azurita

## System Overview

```
Browser
  └── Vue 3 SPA (advent-calendar/src/)
        ├── Vue Router (client-side routing)
        ├── Pinia stores
        └── localStorage (auth + puzzle state)
                │ (API calls — none yet)
                ▼
Django 5.2 (backend/)
  ├── index view → serves templates/index.html (SPA shell)
  ├── /api/health/ → health check JSON
  ├── /admin/ → Django admin
  └── Huey task queue (periodic ops tasks)
```

---

## Backend (Django)

### Django Project Module: `azurita_project/`
| File | Purpose |
|------|---------|
| `settings.py` | Base settings; auto-imports `settings_dev` or `settings_prod` via `DJANGO_ENV` |
| `settings_dev.py` | `DEBUG=True`, `ALLOWED_HOSTS=['*']` |
| `settings_prod.py` | `DEBUG=False`, HSTS, `SECURE_SSL_REDIRECT`, requires `DJANGO_SECRET_KEY` + `DJANGO_ALLOWED_HOSTS` |
| `urls.py` | admin + health + catch-all to `index` |
| `views.py` | Single FBV `index` → renders `templates/index.html` |
| `tasks.py` | Huey periodic tasks (backups, silk GC, slow query reports) |
| `apps.py` | `AzuritaProjectConfig` — imports tasks on ready for Huey discovery |

### INSTALLED_APPS (active)
`django.contrib.admin`, `django.contrib.auth`, `django.contrib.contenttypes`, `django.contrib.sessions`, `django.contrib.messages`, `django.contrib.staticfiles`, `dbbackup`, `huey.contrib.djhuey`, `azurita_project`

### No Business-Logic App Yet
`puzzles/` is a stub (not in `INSTALLED_APPS`). When business logic is needed, add it to `puzzles/` or create a new app under `backend/`.

### Settings Selection
Always `DJANGO_SETTINGS_MODULE=azurita_project.settings`. Production behavior activated by `DJANGO_ENV=production` (python-decouple reads from `.env`). `settings_prod.py` is NOT a standalone module.

### URL Routing
- `/admin/` → Django admin
- `/api/health/` → `{"status": "ok"}`
- `/silk/` → Silk profiler (only when `ENABLE_SILK=True`)
- `""` (catch-all) → `index` view → Vue Router takes over

---

## Frontend (Vue 3 SPA)

**Location**: `advent-calendar/src/`

### Key Libraries
| Library | Version | Role |
|---------|---------|------|
| Vue 3 | 3.5.22 | Core framework |
| vue-router | 4.6.3 | Client-side routing |
| Pinia | 3.0.3 | State management |
| GSAP | 3.13.0 | Animations (countdown, puzzle effects) |
| Tailwind CSS | 4.1.17 | Styling (custom Christmas theme) |
| TypeScript | 5.9 | Type safety |
| Vite | 7.1.11 | Build tool |

### Component Inventory
| Component | Role |
|-----------|------|
| `App.vue` | Root layout, custom cursor, decorative background |
| `views/LoginView.vue` | Login form + Christmas lights animation |
| `views/HomeView.vue` | 8-column puzzle grid + countdown timer |
| `views/puzzles/puzzle_N.vue` (×31) | Individual puzzle (image + answer input) |
| `components/CountdownTimer.vue` | GSAP-animated countdown to Dec 1, 2025 |
| `components/CustomCursor.vue` | Custom mouse cursor |
| `components/PuzzleCompleted.vue` | Completion overlay (retry / continue) |

### State Model
| Key | Store/Location | Value |
|-----|---------------|-------|
| `authenticated` | localStorage | `'true'` / absent |
| `username` | localStorage | `'ANOMALIA'` |
| `puzzle_N_solved` | localStorage | `'true'` / absent |
| `puzzle_N_response` | localStorage | answered text |
| counter | `stores/counter.ts` (Pinia) | demo store, unused in product |

### Build & Serve
1. `npm --prefix advent-calendar run build` → emits to `static/frontend/` (hashed assets + manifest)
2. Django `collectstatic` → copies to `staticfiles/`
3. nginx serves `/static/` from `staticfiles/`
4. `templates/index.html` uses `{% load static %}` to inject hashed bundle paths

---

## Persistence & Infrastructure

### Database
- SQLite at `backend/db.sqlite3` (staging-class workload)
- Weekly backup: `django-dbbackup` via Huey (Mon 03:00 UTC, keep 4 copies)

### Task Queue (Huey)
- Redis at `redis://localhost:6379/6`
- `immediate=True` in dev (no worker needed)
- In production: `azurita-huey.service` systemd unit

### Huey Tasks (`azurita_project/tasks.py`)
| Task | Schedule | Purpose |
|------|----------|---------|
| `scheduled_backup` | Mon 03:00 UTC | SQLite DB backup + retention |
| `silk_garbage_collection` | Daily 04:30 UTC | Silk data cleanup (if enabled) |
| `weekly_slow_queries_report` | Thu 07:00 UTC | Markdown report in `logs/silk-reports/` |
| `silk_reports_cleanup` | 1st of month 05:45 UTC | Delete reports > 6 months old |

### Production Services
| Service | Role |
|---------|------|
| `azurita.service` | Gunicorn (2 workers, unix socket) |
| `azurita-huey.service` | Huey worker |
| nginx | Reverse proxy + static file serving |

---

## Key Paths
| Path | Purpose |
|------|---------|
| `manage.py` | Django CLI (repo root) |
| `venv/` | Python virtualenv (repo root) |
| `requirements.txt` | Python dependencies (repo root) |
| `backend/azurita_project/` | Django project module |
| `advent-calendar/` | Vue 3 SPA source |
| `advent-calendar/src/views/puzzles/` | 31 puzzle components |
| `templates/index.html` | SPA shell Django template |
| `static/frontend/` | Vite build output (gitignored locally) |
| `staticfiles/` | collectstatic output (served by nginx) |
| `backend/db.sqlite3` | SQLite database (gitignored) |
| `backend/logs/` | App logs (backups, silk reports) |
