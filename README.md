# Azurita

Interactive advent calendar with daily puzzles — built with Django and Vue 3.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Django 5.2 + DRF |
| Database | SQLite |
| Frontend | Vue 3 + TypeScript + Vite |
| Styles | Tailwind CSS |
| Animations | GSAP |
| Task Queue | Huey |

## Project Structure

```
azurita/
├── backend/
│   ├── azurita_project/     # Django project (settings, urls, wsgi)
│   ├── .env                 # Environment variables (not committed)
│   ├── .env.example         # Template for env vars
│   ├── pytest.ini           # Test configuration
│   └── conftest.py          # Shared test fixtures
├── frontend/                # Vue 3 + TypeScript SPA
├── docs/                    # Architecture standards & guides
├── manage.py                # Django management (at repo root)
├── venv/                    # Python virtual environment
└── README.md
```

## Quick Start

### Backend

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp backend/.env.example backend/.env
# Edit backend/.env with your values

python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Access URLs (Development)

| Resource | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| Admin | http://localhost:8000/admin/ |

## Environment Configuration

All secrets are loaded from `backend/.env` via `python-decouple`. See `backend/.env.example`.

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

### Settings Structure

| File | Purpose |
|------|---------|
| `backend/azurita_project/settings.py` | Base/shared settings |
| `backend/azurita_project/settings_dev.py` | Development: DEBUG=True, SQLite, console email |
| `backend/azurita_project/settings_prod.py` | Production: DEBUG=False, SQLite, security headers |

The active environment is controlled by `DJANGO_ENV` (`development` or `production`).

---

## Task Queue

This project uses [Huey](https://huey.readthedocs.io/) with Redis for background tasks.

- **Development**: Tasks run synchronously (no Redis required).
- **Production**: Tasks run asynchronously via the Huey worker process.

### Scheduled Tasks

| Task | Schedule | Description |
|------|----------|-------------|
| `scheduled_backup` | Mondays 3:00 AM | Database and media backup with compression |
| `silk_garbage_collection` | Daily 4:30 AM | Clean Silk profiling data older than 7 days |
| `weekly_slow_queries_report` | Thursdays 7:00 AM | Slow query and N+1 detection report |

All tasks are defined in `backend/azurita_project/tasks.py`.

---

## Backups

Automated backups run weekly via the `scheduled_backup` Huey task. Backups are stored in the path configured by the `BACKUP_STORAGE_PATH` environment variable (default: `/var/backups/azurita/`) with 90-day retention.

Manual backup commands:

```bash
source venv/bin/activate
python manage.py dbbackup --compress
python manage.py mediabackup --compress
```

---

## Performance Monitoring

Query profiling with [django-silk](https://github.com/jazzband/django-silk) is available behind the `ENABLE_SILK` environment variable flag.

Set `ENABLE_SILK=true` in your `.env` file to enable. Access at `/silk/` (staff users only).

Garbage collection runs daily at 4:30 AM. Weekly slow-query reports are generated Thursdays at 7:00 AM.

---

## Documentation & Standards

Project standards and architecture guides are located in the `docs/` folder:

- `docs/DJANGO_VUE_ARCHITECTURE_STANDARD.md` — Architecture and project structure reference
- `docs/GLOBAL_RULES_GUIDELINES.md` — Development rules and engineering guidelines
- `docs/TESTING_QUALITY_STANDARDS.md` — Test quality criteria, patterns, and anti-patterns
- `docs/TEST_QUALITY_GATE_REFERENCE.md` — Quality gate tool reference and configuration
- `docs/BACKEND_AND_FRONTEND_COVERAGE_REPORT_STANDARD.md` — Coverage report standards
- `docs/E2E_FLOW_COVERAGE_REPORT_STANDARD.md` — E2E flow coverage tagging and report details
- `docs/deployment-guide.md` — Production deployment guide

---

## Production

- **Domain**: `azurita.projectapp.co`
- **Services**: `azurita.service` (Gunicorn via socket), `azurita-huey.service`
- **Database**: SQLite (lightweight project)
- **Settings**: `DJANGO_ENV=production` activates `azurita_project/settings_prod.py`
- **Deploy**: See `docs/deployment-guide.md` or run `/deploy-and-check` workflow
