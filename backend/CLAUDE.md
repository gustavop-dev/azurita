# Backend Rules — Azurita

## Stack And Scope
- Django 5.2 backend, Python 3.12. No DRF or REST endpoints yet — the only view is the SPA shell (`index`).
- The backend is **minimal**: a single SPA-shell view, a `/api/health/` endpoint, an admin site, and Huey periodic tasks. There is **no business-logic Django app yet**; `puzzles/` is an empty stub.
- Settings module: `azurita_project.settings` (always). Production mode is activated by `DJANGO_ENV=production` (read by python-decouple from `.env`). Never use `settings_prod` as the module name — it is auto-imported by `settings.py`.
- Database: **SQLite** at `backend/db.sqlite3`. Backed up weekly by `django-dbbackup` via Huey.

## Project Conventions
- The single existing view (`azurita_project.views.index`) is a plain Django function view that renders `templates/index.html`. When adding API endpoints, prefer **function-based views with `@api_view`** for consistency with the user's other projects.
- Keep view functions focused on request/response wiring.
- Put business rules in services, serializers, helpers, or model methods.
- Prefer Django ORM queries. Use raw SQL only when strictly necessary and parameterized.
- There is no bilingual content yet, no `_en`/`_es` field convention to preserve.
- Settings are split across `azurita_project/{settings,settings_dev,settings_prod}.py`. Do not collapse them.
- Huey tasks live in `azurita_project/tasks.py`. Periodic jobs use `huey.crontab` + `@periodic_task`.
- `django-silk` is conditional on `ENABLE_SILK=True` env var. Do not unconditionally install Silk middleware.

## Auth And Security
- Uses Django session + CSRF for the admin site only.
- There is no JWT, no `accounts` app, no platform/panel split.
- `settings_prod.py` enforces HSTS (1y), `SECURE_SSL_REDIRECT`, secure cookies, NOSNIFF, X-Frame DENY, and requires `DJANGO_SECRET_KEY` + `DJANGO_ALLOWED_HOSTS` from env (raises if missing).
- Validate input in serializers or dedicated validators when adding APIs.
- Never hardcode secrets or bypass CSRF/security middleware for convenience.

## Commands
- Activate venv from **repo root**: `source venv/bin/activate` (the venv is `venv/`, not `.venv/`).
- Run backend tests: `pytest backend/path/to/test_file.py -v` (use `--no-cov` for speed).
- Run a focused backend check: `python manage.py check` (manage.py is at the repo root).
- Run dev server: `python manage.py runserver`.
- Make migrations: `python manage.py makemigrations <app>` then `python manage.py migrate`.

## Testing Rules
- Run only the changed test file or a tight regression slice.
- Never run the full backend suite.
- Keep test names focused on one observable behavior.
- Prefer deterministic tests: freeze time, seed data explicitly, and avoid hidden global state.
- The repo's `conftest.py` includes a custom coverage reporter with per-file tabular output and a Top-3 focus list.
