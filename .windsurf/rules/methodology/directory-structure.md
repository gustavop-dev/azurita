---
description: directory structure to follow
trigger: always_on
---

# Directory Structure
```mermaid
flowchart TD
    Root[Project Root]
    Root --> Backend[backend/]
    Root --> AdventCal[advent-calendar/]
    Root --> Templates[templates/]
    Root --> Static[static/frontend/]
    Root --> Puzzles[puzzles/]
    Root --> Docs[docs/]
    Root --> Scripts[scripts/]
    Root --> Windsurf[.windsurf/rules/]
    Root --> GitHub[.github/workflows/]

    Backend --> BProject[azurita_project/ — settings, urls, views, tasks]
    Backend --> BConftest[conftest.py + pytest.ini]
    Backend --> BLogs[logs/]

    AdventCal --> AdventSrc[src/ — Vue components, stores, router, views]
    AdventCal --> AdventPkg[package.json + vite.config.ts]
```

**Key invariants:**
- Frontend lives in `advent-calendar/` (NOT `frontend/`). Built with Vite to `static/frontend/`.
- Django project module is `azurita_project/` (NOT `projectapp/`).
- `manage.py` and `venv/` are at the repo root, not inside `backend/`.
- `puzzles/` is a stub Django app — no business logic yet.
- `static/frontend/` and `backend/db.sqlite3` are gitignored generated artifacts.
