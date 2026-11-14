# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | Claude |
| Assistant model | Haiku 5.5 low |
| Starting point | starter |
| Baseline commit | fb5bfd8 |
| Language (ts or js) | ts |
| Vitest version | 3.2.7 |
| Where I ran the tests | local machine |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
E:\Github\se-practice\sis-04\app>npx vitest run

 RUN  v3.2.7 E:/Github/se-practice/sis-04/app

No test files found, exiting with code 1

include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/dist/**, **/cypress/**, **/.{idea,git,cache,output,temp}/**, **/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/app/  (starting point: starter, baseline commit fb5bfd8)
├── index.html          — Vite entry page, mounts the app
├── package.json        — scripts (dev, build, preview, test = "vitest run"); React 18, Vite 5, Vitest 3, TypeScript 5
├── tsconfig.json       — TypeScript settings
├── vite.config.ts      — Vite config
└── src/
    ├── main.tsx        — renders <App /> into #root, imports index.css
    ├── index.css       — all styling; one @media (max-width: 480px) rule makes the layout a single column
    └── App.tsx         — the WHOLE application in one file:
                          · type Room and the ROOMS array (2 rooms: a101, b204, with id, name, blocked, bookings; no capacity or equipment)
                          · toMinutes() and fmt() time helpers
                          · App component: holds state (roomId, now, blocked, start, end, endOfDay, result, error)
                          · check(): reads the form, validates input, and decides Available / Unavailable
                            inline (AC1 start<end and not in the past, AC2 max 120 min, AC3 blocked, AC4 overlap) — not a separate function
                          · renders the form, the result and the list of the room's bookings
No test files exist. No src/booking, src/rooms or src/filter modules exist yet.
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am extending a small React + TypeScript + Vite app (Smart Campus Room Availability Checker) for a university assignment. I want a maintainability analysis and a plan of small steps. Please give NO code yet and do NOT propose a full rewrite.

REPOSITORY MAP (sis-04/app, baseline commit fb5bfd8, no tests yet):
- index.html: Vite entry page, mounts the app
- package.json: scripts dev, build, preview, test = "vitest run"; React 18, Vite 5, Vitest 3, TypeScript 5
- tsconfig.json, vite.config.ts: config
- src/main.tsx: renders <App /> into #root, imports index.css
- src/index.css: all styling; one @media (max-width: 480px) rule makes a single column
- src/App.tsx: the WHOLE application in one file:
  - type Room and the ROOMS array (2 rooms: a101, b204, with id, name, blocked, bookings; no capacity or equipment)
  - toMinutes() and fmt() time helpers
  - App component: state roomId, now, blocked, start, end, endOfDay, result, error
  - check(): reads the form, validates input and decides Available / Unavailable inline (not a separate function)
  - renders the form, the result and the room's bookings list
- No test files. No src/booking, src/rooms or src/filter modules exist yet.

CURRENT ACCEPTANCE CRITERIA (must be preserved):
AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

NEW FEATURE RULES:
Extend from one room to a fictional catalog of at least 4 rooms. Each room has id, name, capacity, equipment list, blocked status and its own bookings. Only rooms that satisfy the user's selected requirements are displayed. The availability check must use the chosen room's bookings, not another room's.
F1 Capacity filter: room capacity must be >= the requested attendees.
F2 Equipment filter: the room must contain ALL selected required items.
F3 A blocked room cannot be reported as available.
F4 Show a clear empty state when no rooms match.
F5 Changing the selected room must refresh the availability result appropriately.

TARGET STRUCTURE (fixed by the assignment):
- src/rooms.ts: Room type + ROOMS (data only)
- src/filter.ts: filterRooms(rooms, { attendees, equipment })
- src/booking.ts: canBook({ start, end, now, blocked, bookings }) and checkRoom(rooms, roomId, { start, end, now })
- App.tsx and components: UI only, no rules and no room data

CONSTRAINTS: no login, payments, live APIs or database; no network calls or browser storage; fictional data only; the work is done one small change at a time with all tests run after each change.

PLEASE GIVE ME:
1. At least three maintainability risks in the files above, each with the file or function it lives in, the evidence I can check in the code, and a priority (High / Medium / Low).
2. A numbered plan of small safe steps, smallest first, that adds the catalog and the filter and moves the code into the target modules without changing what AC1-AC5 decide.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | `blocked` is one page-level checkbox, not a property of each room, so F3 cannot be true per room | `src/App.tsx`, `App()` state `blocked` and `check()` | `const [blocked, setBlocked] = useState(false)` is toggled by the "Room blocked" checkbox, and `check()` tests `else if (blocked)`. The `blocked` field in `ROOMS` (`blocked: false` on both rooms) is never read, so the checkbox applies to whichever room is selected | High |
| 2 | All booking rules (AC1–AC4) are inline in one UI function, so they cannot be imported or unit-tested | `src/App.tsx`, `check()` | One function reads the form with `toMinutes`, sets error messages, runs the AC1–AC4 decision (`s > n`, `e - s > 120`, overlap loop) and calls `setResult`. The file exports only `App`, so a test cannot reach the rules without rendering the page | High |
| 3 | The page can show an error and a result at the same time, and an old result stays when the room changes | `src/App.tsx`, `check()` and the room `<select>` | When `!(s < e)`, `check()` calls `setError(...)` and does not return, so it still reaches `setResult(ok)` and the page shows both the red error and "Unavailable". The select's `onChange` only calls `setRoomId`, so the previous result stays under the new room (F5) | Medium |
| 4 | There are no automated tests, so a refactor could change AC1–AC5 with no signal | `app/` (no `*.test.ts` files) | Baseline run in §1.1 prints `No test files found` (0/0), although `package.json` already has `"test": "vitest run"` | Medium |
| 5 | The same rule is written twice, and data, rules and helpers all sit in the UI file | `src/App.tsx`, `check()`, `ROOMS`, `toMinutes()`, `fmt()` | `start < end` appears as `!(s < e)` for the error message and again as `0 <= s && s < e && e <= 1440` in the decision. `Room`, `ROOMS`, `toMinutes` and `fmt` are defined in `App.tsx` next to the component | Low |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. **Tests first for the rules (risk 4, risk 2).** Write `src/booking.test.ts` with AC1–AC5 and B1–B4 cases, expected values taken from the requirements, and watch it fail because `src/booking.ts` does not exist. Then create `src/booking.ts` with `canBook({ start, end, now, blocked, bookings })`, copying the decision from `check()` unchanged. Run all tests.
2. **Make `check()` call `canBook` (risk 2).** Replace the inline AC1–AC4 decision in `App.tsx` with a call to `canBook`, keep every message and behaviour, run all tests and `npm run build`, and commit.
3. **Move the data out of the page (risk 5).** Create `src/rooms.ts` with the `Room` type and `ROOMS` extended to at least four fictional rooms, each with capacity, equipment, its own bookings and its own `blocked` value (one room blocked). `App.tsx` imports it.
4. **Make `blocked` a per-room property (risk 1).** Remove the page-level "Room blocked" checkbox and the `blocked` state, and read the chosen room's own `blocked`. Add `checkRoom(rooms, roomId, request)` to `src/booking.ts` that calls `canBook` with that room's data, with tests F3, F5 and INT written first.
5. **Add the filter (F1, F2, F4).** Write the tests first (F1, F2, F4, B5, B6), then create `src/filter.ts` with `filterRooms(rooms, { attendees, equipment })`. Wire attendee and equipment inputs into the page, show only matching rooms, and show an empty-state message when none match.
6. **Fix the feedback (risk 3).** Make `check()` return after `setError` so an error and a result are never shown together, and clear the old result when the selected room or the filter changes (F5). Run all tests.
7. **Split the UI and remove the duplicate rule (risk 5).** Move the form, result and bookings list into separate components with no rules or room data, and drop the second `start < end` check that `canBook` now covers.
8. **Evidence.** Check the narrow layout, take the five screenshots, write `diagrams/before.puml` and `diagrams/after.puml`, run the full test suite, and fill in the remaining report sections.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| (write here) | Rejected / Modified | (write here) |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
