# Technical Reference — Azurita

## Development Setup

### Prerequisites
- Python 3.12 + virtualenv
- Node.js ^20.19.0 or >=22.12.0
- Redis running locally on port 6379

### First-Time Setup
```bash
# Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp backend/.env.example backend/.env   # fill in values
python manage.py migrate

# Frontend
npm --prefix advent-calendar install
```

### Environment Variables (`backend/.env`)
| Variable | Default | Notes |
|----------|---------|-------|
| `DJANGO_ENV` | `development` | Set to `production` for prod settings |
| `DJANGO_SECRET_KEY` | (dev fallback) | Required in production |
| `DJANGO_DEBUG` | `True` | Override in prod |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated, required in prod |
| `REDIS_URL` | `redis://localhost:6379/6` | Huey queue |
| `ENABLE_SILK` | `false` | Set to `true` for request profiling |
| `BACKUP_STORAGE_PATH` | `/var/backups/azurita` | SQLite backup destination |

---

## Commands Reference

### Backend
```bash
# Activate venv (from repo root)
source venv/bin/activate

# Dev server
python manage.py runserver

# Migrations
python manage.py makemigrations <app>
python manage.py migrate

# Django check
python manage.py check

# Lint
ruff check backend/

# Tests — ALWAYS specify files, never bare pytest
pytest backend/path/to/test_file.py -v
pytest backend/path/to/test_file.py --no-cov  # fast
```

### Frontend
```bash
# Dev server (Vite, default :5173)
npm --prefix advent-calendar run dev

# Production build → static/frontend/
npm --prefix advent-calendar run build

# Type check
npm --prefix advent-calendar run type-check

# Lint (with auto-fix)
npm --prefix advent-calendar run lint

# Format
npm --prefix advent-calendar run format

# Unit tests (none yet, but configured)
npm --prefix advent-calendar run test:unit
```

### Production Deploy
```bash
# On the production server at /home/ryzepeck/webapps/azurita:
source venv/bin/activate
pip install -r requirements.txt
DJANGO_ENV=production python manage.py migrate
npm --prefix advent-calendar ci && npm --prefix advent-calendar run build
DJANGO_ENV=production python manage.py collectstatic --noinput
sudo systemctl restart azurita && sudo systemctl restart azurita-huey
bash /home/ryzepeck/webapps/ops/vps/scripts/deployment/post-deploy-check.sh azurita
```

See `.agents/skills/deploy-and-check/SKILL.md` for the canonical sequence.

---

## Settings Architecture

Three-file split in `backend/azurita_project/`:
- `settings.py` — base, uses python-decouple, auto-imports dev/prod based on `DJANGO_ENV`
- `settings_dev.py` — `DEBUG=True`, permissive hosts
- `settings_prod.py` — `DEBUG=False` hardcoded, security headers, requires env vars

**Never** set `DJANGO_SETTINGS_MODULE=azurita_project.settings_prod`. Always use:
```
DJANGO_SETTINGS_MODULE=azurita_project.settings
DJANGO_ENV=production  # for production behavior
```

---

## Testing

### Backend (pytest)
- Config: `backend/pytest.ini` (sets `DJANGO_SETTINGS_MODULE=azurita_project.settings`)
- Coverage: `--cov=azurita_project --cov-branch` by default; add `--no-cov` to skip
- Custom reporter in `backend/conftest.py` (Unicode progress bars per file)
- Constraints: max 20 tests/batch, 3 test commands/cycle, never full suite

### Frontend (Vitest)
- Config: `advent-calendar/vitest.config.ts` (jsdom environment)
- **No tests written yet**
- When added: `npm --prefix advent-calendar run test:unit -- path/to/file.spec.ts`

### E2E
- Not yet established.

---

## Frontend Architecture Details

### Routing (`advent-calendar/src/router/index.ts`)
- History mode with `createWebHistory()`
- `/login` — no auth required
- `/` — requires auth (`meta.requiresAuth: true`)
- `/puzzle/N` (N = 1–31) — lazy-loaded, `meta.requiresAuth: true`, `meta.unlockDate: Date`
- Navigation guard enforces auth redirect and puzzle unlock logic

### Puzzle Unlock Algorithm
```
puzzle N is accessible if:
  today > unlockDate(N)           // strict greater-than, not day-of
  AND (N == 1 OR localStorage['puzzle_{N-1}_solved'] == 'true')
```

### State Management
- Pinia store (`stores/counter.ts`) is a stub demo store; not used for puzzle logic
- All auth and puzzle state: localStorage keys (`authenticated`, `puzzle_N_solved`, `puzzle_N_response`)

### Custom Cursor
- `components/CustomCursor.vue` hides the native cursor globally (`cursor: none !important`)
- `App.vue` uses `.custom-cursor-container` class applied to the root div

### Tailwind Color Tokens
```
christmas-red:   #E63946
christmas-green: #2A9D8F
christmas-cream: #F1FAEE
christmas-gold:  #F4A261
christmas-dark:  #264653
soft-red:        #FF6B6B
soft-green:      #51CF66
soft-blue:       #74C0FC
```

---

## Infrastructure Details

### Gunicorn (`azurita.service`)
```
WorkingDirectory: /home/ryzepeck/webapps/azurita
WSGI: backend.wsgi:application
Workers: 2
Max requests: 800 (jitter: 80)
Socket: /home/ryzepeck/webapps/azurita/azurita.sock
```

### Nginx
- Config: `/etc/nginx/sites-available/azurita`
- `/static/` → `alias /home/ryzepeck/webapps/azurita/staticfiles/`
- All other traffic → gunicorn via unix socket

### Vite Build Output
- `build.outDir`: `../static/frontend` (relative to `advent-calendar/`)
- `build.manifest: true` — Django template uses manifest to inject hashed asset paths
- `base: '/static/frontend/'`
