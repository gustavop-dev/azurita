# Azurita — Codex AGENTS Configuration

## Project Identity

### Codex Runtime Surfaces
- **Primary instructions**: `AGENTS.md` (root scope) + `backend/AGENTS.md`
- **Skills (canonical)**: `.agents/skills/<skill>/SKILL.md` + `agents/openai.yaml`
- **Project config**: `.codex/config.toml`

- **Name**: Azurita
- **Domain**: `azurita.projectapp.co` / `www.azurita.projectapp.co`
- **Stack**: Django 5.2.8 (no DRF yet) / Vue 3 + Vite SPA (`advent-calendar/`) / SQLite / Redis / Huey
- **Server path**: `/home/ryzepeck/webapps/azurita`
- **Services**: `azurita.service` (Gunicorn), `azurita-huey.service`
- **Settings module**: `DJANGO_SETTINGS_MODULE=azurita_project.settings` (production via `DJANGO_ENV=production`)
- **Nginx**: `/etc/nginx/sites-available/azurita`
- **Static**: `/home/ryzepeck/webapps/azurita/staticfiles/`

---

## General Rules

These should be respected ALWAYS:
1. Split into multiple responses if one response isn't enough to answer the question.
2. IMPROVEMENTS and FURTHER PROGRESSIONS:
- S1: Suggest ways to improve code stability or scalability.
- S2: Offer strategies to enhance performance or security.
- S3: Recommend methods for improving readability or maintainability.
- Recommend areas for further investigation

---

## Security Rules — OWASP / Secrets / Input Validation

### Secrets and Environment Variables

NEVER hardcode secrets. Always use environment variables.

```python
# ✅ Django — use env vars
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
DATABASE_URL = os.environ['DATABASE_URL']
STRIPE_API_KEY = os.environ['STRIPE_SECRET_KEY']

# ❌ NEVER do this
SECRET_KEY = 'django-insecure-abc123xyz'
DATABASE_URL = 'mysql://root:password123@localhost/mydb'
```

```typescript
// ✅ Next.js / Nuxt — use env vars
const apiUrl = process.env.NEXT_PUBLIC_API_URL
const secretKey = process.env.API_SECRET_KEY  // server-only, no NEXT_PUBLIC_ prefix

// Nuxt
const config = useRuntimeConfig()
const apiKey = config.apiSecret  // server only
const publicUrl = config.public.apiBase  // client safe

// ❌ NEVER do this
const API_KEY = 'sk-live-abc123xyz'
fetch('https://api.stripe.com/v1/charges', {
  headers: { Authorization: 'Bearer sk-live-abc123xyz' }
})
```

### .env rules

- `.env` files MUST be in `.gitignore`. Always verify before committing
- Use `.env.example` with placeholder values for documentation
- Separate env files per environment: `.env.local`, `.env.staging`, `.env.production`
- Server secrets (API keys, DB passwords) NEVER go in client-side env vars
- In Next.js: only `NEXT_PUBLIC_*` vars are exposed to the browser
- In Nuxt: only `runtimeConfig.public.*` is exposed to the browser

### Input Validation

NEVER trust user input. Validate on both server AND client.

#### Django/DRF

```python
# ✅ Serializer validates input
class OrderSerializer(serializers.Serializer):
    email = serializers.EmailField()
    quantity = serializers.IntegerField(min_value=1, max_value=100)
    product_id = serializers.IntegerField()

    def validate_product_id(self, value):
        if not Product.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError('Product not found')
        return value

# ❌ Using raw request data
def create_order(request):
    product_id = request.data['product_id']  # no validation
    Order.objects.create(product_id=product_id)  # SQL injection risk
```

#### React/Vue

```typescript
// ✅ Validate before sending
import { z } from 'zod'

const orderSchema = z.object({
  email: z.string().email(),
  quantity: z.number().int().min(1).max(100),
  productId: z.number().int().positive(),
})

const handleSubmit = (data: unknown) => {
  const result = orderSchema.safeParse(data)
  if (!result.success) {
    setErrors(result.error.flatten().fieldErrors)
    return
  }
  await submitOrder(result.data)
}
```

### SQL Injection Prevention

```python
# ✅ Django ORM — always safe
users = User.objects.filter(email=user_input)

# ✅ If raw SQL is needed, use parameterized queries
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute("SELECT * FROM users WHERE email = %s", [user_input])

# ❌ NEVER interpolate user input into SQL
cursor.execute(f"SELECT * FROM users WHERE email = '{user_input}'")
```

### XSS Prevention

```typescript
// ✅ React auto-escapes by default — JSX is safe
return <p>{userInput}</p>

// ✅ Vue auto-escapes with {{ }}
// <p>{{ userInput }}</p>

// ❌ NEVER use dangerouslySetInnerHTML with user input
return <div dangerouslySetInnerHTML={{ __html: userInput }} />

// ❌ NEVER use v-html with user input
// <div v-html="userInput" />

// If you MUST render HTML, sanitize first
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(userInput)
```

### CSRF Protection

```python
# ✅ Django — CSRF middleware is on by default, keep it
MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',  # NEVER remove
    ...
]

# ✅ DRF — use SessionAuthentication or JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

# ❌ NEVER disable CSRF globally
@csrf_exempt  # only for webhooks from external services with signature verification
```

### Authentication and Authorization

```python
# ✅ Always check permissions
from rest_framework.permissions import IsAuthenticated

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own orders
        return Order.objects.filter(user=self.request.user)
```

### Sensitive Data Exposure

```python
# ✅ Exclude sensitive fields from serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']
        # password, tokens, internal IDs are excluded

# ❌ Exposing everything
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # leaks password hash, tokens, etc.
```

### HTTP Security Headers (Django)

```python
# settings.py — enable all security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_SSL_REDIRECT = True  # in production
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
```

### Dependency Security

- Run `pip audit` (Python) and `npm audit` (Node) regularly
- Never use `*` for dependency versions — pin exact versions
- Review new dependencies before adding them
- Keep dependencies updated, especially security patches

### File Upload Security

```python
# ✅ Validate file type and size
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.pdf'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def validate_upload(file):
    ext = Path(file.name).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValidationError(f'File type {ext} not allowed')
    if file.size > MAX_FILE_SIZE:
        raise ValidationError('File too large')
```

### Security Checklist — Before Every Deployment

- [ ] No secrets in code or git history
- [ ] `.env` is in `.gitignore`
- [ ] All user input is validated (server + client)
- [ ] No raw SQL with user input
- [ ] No `dangerouslySetInnerHTML` / `v-html` with user data
- [ ] CSRF protection enabled
- [ ] Authentication required on all sensitive endpoints
- [ ] Serializers exclude sensitive fields
- [ ] Security headers configured
- [ ] `pip audit` / `npm audit` clean
- [ ] File uploads validated
- [ ] DEBUG = False in production
- [ ] ALLOWED_HOSTS configured properly

---

## Memory Bank System

Azurita maintains a Memory Bank at:

- `docs/methodology/product_requirement_docs.md` — product scope, user flows, constraints
- `docs/methodology/architecture.md` — system diagram, component inventory, infrastructure
- `docs/methodology/technical.md` — dev setup, commands, settings details, Tailwind tokens
- `docs/methodology/lessons-learned.md` — project-specific patterns and gotchas
- `docs/methodology/error-documentation.md` — known issues and resolved bugs
- `tasks/tasks_plan.md` — feature backlog and phase tracking
- `tasks/active_context.md` — current work focus and session notes

---

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
    Backend --> BDb[db.sqlite3]

    AdventCal --> AdventSrc[src/ — Vue components, stores, router]
    AdventCal --> AdventPkg[package.json + vite.config]

    AgentSkills --> SkillSet[plan, implement, debug, deploy-and-check, git-commit, etc.]
```

**Notes:**
- The frontend lives in `advent-calendar/` (not `frontend/`). It is built with Vite into `static/frontend/` and served by Django via the `templates/index.html` SPA shell.
- `backend/azurita_project/` is the Django project module (settings, urls, root views, Huey tasks). There is no significant business-logic Django app yet; `puzzles/` is a stub with empty models.
- `manage.py` lives at the repo root (not inside `backend/`).

---

## Testing Rules

### Execution Constraints

- **Never run the full test suite** — always specify files
- **Maximum per execution**: 20 tests per batch, 3 commands per cycle
- **Backend**: activate venv from repo root (`source venv/bin/activate`), then `pytest backend/path/to/test_file.py -v`. `pytest.ini` sets `DJANGO_SETTINGS_MODULE=azurita_project.settings` and adds `--cov=azurita_project --cov-branch` by default — pass `--no-cov` for fast iteration.
- **Frontend (Vue 3 SPA in `advent-calendar/`)**: there is currently **no test suite** in the frontend. If/when added, run `npm --prefix advent-calendar test -- path/to/file.spec.js`.
- **E2E**: not yet established. Skip until added.

### Quality Standards

Full reference: `docs/TESTING_QUALITY_STANDARDS.md`

- Each test verifies **ONE specific behavior**
- **No conjunctions** in test names — split into separate tests
- Assert **observable outcomes** (status codes, DB state, rendered UI)
- **No conditionals** in test body — use parameterization
- Follow **AAA pattern**: Arrange → Act → Assert
- Mock only at **system boundaries** (external APIs, clock, email)

---

## Lessons Learned — Azurita

### Architecture Patterns

#### Minimal Backend, SPA-Heavy Frontend
- The Django backend is intentionally minimal: a single `index` view that serves the Vue SPA, a `/api/health/` health check, and an admin site. There is **no business-logic Django app** — the `puzzles/` app is a stub with empty `models.py` and `views.py`.
- All product behavior (puzzles, advent calendar interactions, animations) lives in the Vue 3 + TypeScript + Vite SPA in `advent-calendar/`.
- Data persistence (if any beyond admin) is handled client-side or via small ad-hoc endpoints to be added in the future.

#### SPA Shell Pattern
- `templates/index.html` is the only Django template. It uses `{% load static %}` and injects the Vite-built JS/CSS bundles from `static/frontend/assets/index.*.js|css`.
- The catch-all URL pattern routes any non-`/admin/`, non-`/api/`, non-`/silk/` request to the `index` view, letting the Vue Router handle client-side routing.
- Build flow: `npm --prefix advent-calendar run build` → emits to `static/frontend/` → `manage.py collectstatic` collects into `staticfiles/` → nginx + Django serve.

#### SQLite + Automated Backups
- Production uses SQLite (`backend/db.sqlite3`) — appropriate for the staging-class workload.
- `django-dbbackup` runs every Monday 03:00 UTC via Huey, retaining the last 4 backups in `BACKUP_STORAGE_PATH` (default `/var/backups/azurita`).
- The `backups` logger writes to `backend/logs/backups.log` (rotating, 5MB × 3).

#### Huey Periodic Tasks
- All scheduled work lives in `backend/azurita_project/tasks.py` and uses `huey.contrib.djhuey.periodic_task` + `huey.crontab`.
- Active jobs:
  - `scheduled_backup` — Mon 03:00 UTC (DB snapshot + retention).
  - `silk_garbage_collection` — daily 04:30 UTC (gated by `ENABLE_SILK`).
  - `weekly_slow_queries_report` — Thu 07:00 UTC (writes Markdown reports under `backend/logs/silk-reports/`).
  - `silk_reports_cleanup` — 1st of month 05:45 UTC (purges reports older than 6 months).
- In dev (`DJANGO_ENV != production`), `HUEY['immediate'] = True` so tasks run synchronously and no Huey worker is required.

#### Conditional Silk Profiling
- `django-silk` is wired but only activates when `ENABLE_SILK=True` in env. When active, it adds itself to `INSTALLED_APPS`/`MIDDLEWARE` and exposes `/silk/` (staff-only).
- This lets staging keep Silk dormant by default and flip it on for ad-hoc performance investigations without code changes.

### Code Style & Conventions

#### Backend Views: FBV Only
- The repo currently has a single view (`azurita_project.views.index`), and it is a **function-based view** rendering `index.html`.
- No DRF `@api_view` usage yet — when adding API endpoints, prefer FBV with `@api_view` for consistency with the rest of the user's project ecosystem.

#### Settings Split by Environment
- `azurita_project/settings.py` — base (DEBUG defaults from env, dev-friendly).
- `azurita_project/settings_dev.py` — `DEBUG=True`, `ALLOWED_HOSTS=['*']`.
- `azurita_project/settings_prod.py` — `DEBUG=False` hardcoded, requires `DJANGO_SECRET_KEY` + `DJANGO_ALLOWED_HOSTS` env, full security headers (HSTS 1y, SECURE_SSL_REDIRECT, etc.).
- `manage.py` and the Huey systemd unit both use `DJANGO_SETTINGS_MODULE=azurita_project.settings`; production mode is activated by `DJANGO_ENV=production` (read by python-decouple from the server `.env`). `settings_prod.py` is not a standalone settings module — it is auto-imported by `settings.py`.

#### Frontend: Vue 3 + TypeScript + Vite (in `advent-calendar/`)
- The frontend source lives in `advent-calendar/`, **not** in `frontend/`. Treat `advent-calendar/` as the canonical frontend path for this project.
- Stack: Vue 3 + TypeScript + Vite + Tailwind + GSAP (per `README.md`).
- Build output is committed-via-CI into `static/frontend/` and is in `.gitignore` locally (regenerated by build).

### Development Workflow

#### Backend venv
```bash
source venv/bin/activate    # venv lives at the repo root, not in backend/
python manage.py runserver  # manage.py is at the root too
```

#### Frontend dev
```bash
cd advent-calendar
npm install
npm run dev      # Vite dev server, default :5173
npm run build    # emits to ../static/frontend/
```

#### Tests
- Backend: `pytest backend/path/to/test_file.py -v` (config in root `pytest.ini` + `conftest.py`, with custom coverage reporter).
- Frontend: not established yet.

### Production Deployment

#### Build Flow
1. Frontend: `cd advent-calendar && npm install && npm run build` → generates `static/frontend/`.
2. Backend: `python manage.py collectstatic --noinput` → copies into `staticfiles/`.
3. Restart: `sudo systemctl restart azurita && sudo systemctl restart azurita-huey`.
4. Verify: `bash /home/ryzepeck/webapps/ops/vps/scripts/deployment/post-deploy-check.sh azurita`.

See `.agents/skills/deploy-and-check/SKILL.md` for the canonical sequence.

### Quality Tooling

- `scripts/test_quality_gate.py` — semantic test-quality analyzer (assertions, mocks, selectors) that runs alongside Ruff lint.
- `scripts/run-tests-all-suites.py` — multi-suite orchestrator (currently mostly backend-focused, since the frontend has no tests yet).
- `scripts/quality/` — internal analyzers used by the gate (`backend_analyzer.py`, `frontend_unit_analyzer.py`, `external_lint.py`, `patterns.py`).
- `.pre-commit-config.yaml` — pre-commit hooks at the repo root.

---

## Error Documentation — Azurita

### Known Issues

_No known issues recorded yet. When a bug is discovered that warrants long-lived documentation, add it here with the format:_

```
#### [KNOWN-NNN] short title
- **Context**: ...
- **Workaround**: ...
```

### Resolved Issues

_No resolved issues recorded yet. When fixing a non-trivial bug, document the root cause and resolution here:_

```
#### [ERR-NNN] short title
- ...
- **Resolution**: ...
```
