# Tasks Plan — Azurita

## Status Key
- [ ] Planned
- [~] In Progress
- [x] Done

---

## Product Features

### Phase 1 — Advent Calendar 2025 (Current)
- [x] Login page with Christmas theme
- [x] Home puzzle grid (31 cards, unlock logic, completion state)
- [x] Countdown timer (GSAP animated)
- [x] 31 puzzle views (image + answer input + completion overlay)
- [x] Sequential puzzle unlock (date + previous-solved requirement)
- [x] Custom cursor
- [x] Progress reset button

### Phase 2 — Hardening (Not Scoped)
- [ ] Move puzzle answers to backend (server-side validation via Django API)
- [ ] Persistent puzzle state per user (replace localStorage with DB)
- [ ] Individual user accounts (or at least session-based auth)
- [ ] Frontend unit tests (Vitest — structure is ready, no tests yet)
- [ ] E2E tests (Playwright)

---

## Infrastructure & Ops

- [x] Django settings split (dev / prod via DJANGO_ENV)
- [x] SQLite weekly backup (Huey + django-dbbackup)
- [x] Conditional Silk profiling (ENABLE_SILK env var)
- [x] Slow query weekly reports (Huey task)
- [x] Gunicorn + nginx production setup
- [x] Deploy-and-check skill (.agents + .claude)
- [ ] CI/CD: automate `npm run build` + `collectstatic` + service restart on push to main
- [ ] Backend test coverage (currently at 0% — no test files)

---

## Documentation & Tooling

- [x] CLAUDE.md / AGENTS.md accuracy audit (April 2025)
- [x] Memory Bank bootstrap (this file)
- [ ] API documentation (when first endpoint is added)
