# Active Context — Azurita

_Last updated: 2026-04-10_

## Current State

The project is in a post-launch maintenance/improvement phase. The core Advent Calendar 2025 experience is complete:
- 31 puzzle views deployed (`puzzle_1.vue` … `puzzle_31.vue`)
- Authentication, unlock logic, progress tracking, and reset all working
- Django backend serving the SPA shell with Huey ops tasks running

## Recent Work

### 2026-04-10 — AI Tooling Audit
- Audited and corrected all AI ecosystem docs against real codebase
- Fixed critical deploy command errors: wrong venv path (`backend/` → repo root), wrong settings module (`settings_prod` → `settings` + `DJANGO_ENV=production`), wrong frontend path (`frontend/` → `advent-calendar/`)
- Rewrote `.windsurf/rules/methodology/` files that were carried over from projectapp
- Bootstrapped Memory Bank (`docs/methodology/`, `tasks/`)

## Active Focus

No active feature work. Next natural steps:
1. Add backend test coverage (currently 0% — no test files in `backend/`)
2. Consider moving puzzle answer validation to a Django API endpoint

## Blocked / Waiting

Nothing blocked.

## Notes for Next Session

- The puzzle answers in each `puzzle_N.vue` are hardcoded string literals — visible in the JS bundle. This is acceptable for the private/single-user scope but document it if the project becomes public.
- The Vite countdown target (`'2025-12-01T00:00:00'` in `CountdownTimer.vue`) is now in the past. The timer shows 00:00:00. If reused for 2026, update this date.
- `stores/counter.ts` is a demo Pinia store from the scaffolded app — unused in the product. Delete or repurpose it when adding the first real store.
