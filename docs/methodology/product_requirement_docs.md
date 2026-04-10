# Product Requirement Docs — Azurita

## Product Overview

Azurita is an interactive advent calendar for the 2025 season. Users log in with a single shared credential and solve 31 daily puzzles unlocked one per day from December 1 to December 31, 2025.

---

## User Flows

### 1. Authentication
- Single shared credential: username `ANOMALIA`, password `MCTPJSI` (hardcoded in LoginView).
- On success: `localStorage.authenticated = 'true'` and `localStorage.username = 'ANOMALIA'` are set.
- On failure: "Credenciales incorrectas" error message; password field clears.
- Authenticated state persists via localStorage (survives page reload).
- Unauthenticated users are redirected to `/login`; authenticated users are redirected away from `/login`.

### 2. Home — Puzzle Grid
- Displays a 8-column grid of 31 puzzle cards (Dec 1–31).
- Each card shows the day number, unlock date, and one of three states:
  - **Bloqueado** (🔒): date not yet reached, or previous puzzle not solved.
  - **Puzzle**: unlocked and not yet solved.
  - **Completado** (✅): solved (localStorage flag + date reached).
- Locked puzzles render grayscale + opacity-40.
- Completed puzzles get a green ring.
- **Reset progress** button clears all `puzzle_N_solved` and `puzzle_N_response` localStorage keys.

### 3. Puzzle Unlock Logic (router guard)
- Puzzle 1: requires `today > Dec 1, 2025` (strict — not day-of).
- Puzzles 2–31: require both date reached AND `localStorage.puzzle_{N-1}_solved === 'true'`.
- Attempting to navigate to a locked puzzle redirects to home.

### 4. Solving a Puzzle
- Each puzzle (`/puzzle/N`) shows a puzzle image from `assets/resources/puzzle_N/`.
- User types an answer; `checkAnswer()` compares `answer.toLowerCase().trim()` against a hardcoded string.
- On correct answer: `localStorage.puzzle_N_solved = 'true'` and `localStorage.puzzle_N_response` are set; PuzzleCompleted overlay appears.
- On wrong answer: error message displayed; user can retry.
- PuzzleCompleted overlay has two actions: 🔄 Reintentar (retry), Continuar → (go home).

### 5. Countdown Timer (HomeView)
- Shown before Dec 1, 2025. Animated with GSAP + Draggable plugin.
- Counts down to `2025-12-01T00:00:00`.

---

## Scope Constraints
- Single shared user; no individual accounts.
- All puzzle state is client-side (localStorage). No backend persistence for puzzle progress.
- All puzzle answers are hardcoded in the Vue components; no server-side validation.
- SMTP not configured; no email features.
- Season: Advent 2025 (Dec 1–31). After Dec 31 all puzzles are unlocked by date.

---

## Future Considerations (not scoped)
- Backend API for puzzle answer validation (remove hardcoded answers from client).
- Per-user persistent state (replace localStorage with server-side storage).
- Individual user accounts.
- Additional puzzle types beyond image + text input.
