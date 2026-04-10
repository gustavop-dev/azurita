# Error Documentation — Azurita

## Known Issues

_No known issues recorded yet. When a bug warrants long-lived documentation, add it here:_

```
#### [KNOWN-NNN] short title
- **Context**: when/where the issue manifests
- **Workaround**: what to do until it's fixed
```

---

## Resolved Issues

_No resolved issues recorded yet. When fixing a non-trivial bug, document the root cause and resolution here:_

```
#### [ERR-NNN] short title
- **Symptom**: what the user/developer saw
- **Root cause**: why it happened
- **Resolution**: what was changed and in which commit
```

---

## Architecture Gotchas (Not Bugs, But Worth Noting)

### Puzzle Answers Are Client-Side
- All 31 puzzle answers are hardcoded as string literals in `puzzle_N.vue` → `checkAnswer()`.
- Anyone can open DevTools → Sources and read the answer.
- This is known and accepted for the current private/single-user scope.

### Puzzle 1 Unlocks on Dec 2, Not Dec 1
- The router guard uses `today > unlockDate` (strict greater-than), not `>=`.
- Intent: prevent Dec 1 spoilers. Effect: puzzle 1 is inaccessible on Dec 1 itself.
- See `advent-calendar/src/router/index.ts` navigation guard.

### No Backend Validation for Auth
- Auth is entirely localStorage-based with hardcoded credentials in `LoginView.vue`.
- There is no Django session or JWT — the backend has no knowledge of authenticated users.
- Clearing localStorage logs the user out without any server-side invalidation.

### Two Parallel Settings Files
- `backend/settings.py` (auto-generated, used by gunicorn's `backend.wsgi:application`) and `backend/azurita_project/settings.py` (full settings used by `manage.py` and Huey) coexist.
- They have different `BASE_DIR` values (`project root` vs `backend/`) and different installed apps.
- Management commands (`migrate`, `collectstatic`) use the full settings via `manage.py`.
- Gunicorn uses the simpler `backend.settings`. This means Huey, dbbackup, etc. are only active via Huey's own service using the full settings.
