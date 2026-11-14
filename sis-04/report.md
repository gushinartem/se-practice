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
| Plan step 2: "Write characterization tests for AC1–AC5 against the current behavior" through the component, and "record the current outputs even where you think they are wrong". | Modified | I kept the idea of a safety net before refactoring, but not the method. README §9 requires expected values to come from AC1–AC5 and F1–F5, never from what the code returns, and tests must import the real `./booking`, not render the page. `check()` in `src/App.tsx` is not exported and, when `!(s < e)`, sets an error and still sets a result, so recording its output would have frozen that bug (risk 3, AC6). Instead my plan step 1 writes `src/booking.test.ts` from the rules (AC1–AC5, B1–B4), sees it fail because `src/booking.ts` does not exist, and only then extracts `canBook`. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

**Catalog.** `src/rooms.ts` holds 5 fictional rooms, each with an id, name, capacity, equipment list, `blocked` value and its own bookings: Room A-101 (12 seats, projector and whiteboard, booked 10:00–11:00), Room B-204 (30 seats, projector, whiteboard and video-conference, no bookings), Room C-310 (6 seats, whiteboard, booked 09:00–10:00 and 12:00–13:00), Lab D-015 (24 seats, computers and projector, booked 13:00–15:00) and Hall E-402 (60 seats, projector and video-conference, blocked). The four equipment names are `computers`, `projector`, `video-conference` and `whiteboard`.

**How the filter is chosen.** The page has an Attendees number field and one checkbox per equipment item. The checkbox list is built from the equipment found in `ROOMS`, so the page holds no equipment names of its own. `filterRooms` keeps a room only if its capacity is at least the attendees (F1) and it has every ticked item (F2). Only the matching rooms are shown, as a clickable list with seats and equipment. Blocked rooms stay in the list with a red "blocked" tag, and `checkRoom` never reports them as available (F3). If the selected room drops out of the list, the first matching room is selected.

**Empty state.** When no room matches, the list is replaced by the message "No rooms match these requirements. Try fewer attendees or fewer equipment items." and the Check availability button is disabled (F4).

**Old result when the room changes.** The check uses the selected room's own bookings and `blocked` value through `checkRoom`. Changing the selected room, the attendees, an equipment item or any time field clears the old result and any error message, so a result is never shown under a different room or different times (F5). The result line also names the room it belongs to.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Filter: 20 attendees and `projector` ticked. Three of the five rooms are listed: Room B-204 (30 seats, selected), Lab D-015 (24 seats) and Hall E-402 (60 seats, tagged "blocked"). Room A-101 (12 seats) and Room C-310 (6 seats, no projector) are not shown. Times are 09:00 / 11:00 / 12:00 and no result is shown yet. |
| `evidence/filter-empty.png` | Filter: 20 attendees with `computers` and `video-conference` ticked. No room has both, so no room is listed. The red empty-state message "No rooms match these requirements. Try fewer attendees or fewer equipment items." is shown and the Check availability button is greyed out (F4). |
| `evidence/switch-a.png` | No filter, so all five rooms are listed, with Room A-101 selected. Current time 09:00 AM, start 10:00 AM, end 11:00 AM. Result: "Room A-101: Unavailable" in red, because A-101 is already booked 10:00–11:00, which is shown under its bookings. |
| `evidence/switch-b.png` | The same times as `switch-a.png` (09:00 AM, 10:00 AM to 11:00 AM), but Room B-204 is selected. Result: "Room B-204: Available" in green, and its bookings list says "none". Same request, different room, different result (F5). |
| `evidence/narrow.png` | The page at phone width in portrait, in a single column with nothing clipped. No filter, all five rooms listed with Room A-101 selected, times 09:00 AM / 11:00 AM / 12:00 PM. Result: "Room A-101: Available" in green, with its 10:00–11:00 booking listed below (AC6). |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Data only: the `Room` type and `ROOMS`, 5 fictional rooms, each with id, name, capacity, equipment, its own `blocked` value and its own bookings. It holds no logic. |
| `src/booking.ts` | The booking rules: `isValidRange` (valid time range), `canBook` (AC1–AC5: valid range, not in the past, at most 120 minutes, not blocked, no overlap but touching allowed, no mutation) and `checkRoom` (finds the chosen room by id and calls `canBook` with that room's own `blocked` and `bookings`; an unknown id is not available; F3, F5). |
| `src/filter.ts` | `filterRooms`: keeps a room only if its capacity is at least the attendees (F1) and it has every selected equipment item (F2). It returns a new array and never changes the catalog. |
| `src/time.ts` | The time helpers `toMinutes` (an "HH:MM" string to minutes after midnight) and `fmt` (minutes back to "HH:MM"). |
| `src/App.tsx` | The page: holds the state (filter, selected room, times, result, error), calls `filterRooms` and `checkRoom`, and clears the old result when the room, filter or times change. It holds no room data and no booking rule. |
| `src/components/FilterPanel.tsx` | Draws the attendees field and the equipment checkboxes, and reports changes through props. |
| `src/components/RoomList.tsx` | Draws the matching rooms as a selectable list, with the "blocked" tag, or the empty-state message when no room matches (F4). |
| `src/components/TimeForm.tsx` | Draws the current-time, start, end and "Ends at 24:00" inputs. |
| `src/components/ResultPanel.tsx` | Draws the error message or the "Available" / "Unavailable" result with the room's name (AC6). |
| `src/components/BookingsList.tsx` | Draws the selected room's existing bookings. |
| `src/main.tsx` | Entry point: renders `App` into the page. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Blocked rooms stay in the filtered list with a red "blocked" tag, and `checkRoom` always answers "Unavailable" for them. | Hide blocked rooms from the list in `filterRooms`. | F1 and F2 are only about capacity and equipment, so `filterRooms` should not also decide blocking. Test T25 INT covers this: `filterRooms` returns the blocked room r4 and `checkRoom` then returns false for it. The person also sees why a room can't be booked, instead of the room silently disappearing, and F3 still holds because blocking is decided in one place, `canBook`. |
| `checkRoom(rooms, roomId, request)` takes the whole catalog and finds the room itself, then calls `canBook` with that room's own `blocked` and `bookings`. | Let the page pick the room and pass `room.bookings` to `canBook` directly, as the page did before the refactoring. | That is how the tests prove the result comes from the chosen room (F5). T13 asks the same times of rooms r1 and r2 and gets false and true, and T14 shows that another room's booking doesn't block r2. It also fixed risk 1: the old page-level `blocked` checkbox applied to whichever room was selected, while now each room carries its own `blocked` value (T12, F3). |
| The "valid time range" rule lives once, as `isValidRange` in `src/booking.ts`, and both `canBook` and the page use it. | Keep `!(s < e)` in `App.tsx` for the error message and the longer check inside `canBook`. | The same rule was written twice (risk 5). With one function, the message shown to the person and the decision can't disagree. T01 and T02 (AC1) still pass after the change, and the page keeps its own message text because wording belongs to the UI (AC6). |
| Fix the error/result conflict with a minimal change: `check()` returns right after setting an error, and one `clearFeedback()` runs whenever the room, filter or times change. | Replace the `error` and `result` states with one `status` value, which the assistant's plan suggested. | Risk 3 only needed an early `return` and clearing the old result (F5). A new status type would have changed more of `App.tsx` for the same behaviour, and the README asks for one small change at a time with all 26 tests run after each. |

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
| AC1 | `T01 AC1: start equal to end is rejected`<br>`T02 AC1: start after end is rejected`<br>`T03 AC1: a request in the past is rejected` | start 720, end 720 → `false`; start 780, end 720 → `false`; start 540, end 570 with now 600 → `false` |
| AC2 | `T04 B1 AC2: exactly 120 minutes (720-840) is available`<br>`T05 B2 AC2: 121 minutes (720-841) is rejected` | 720–840 → `true`; 720–841 → `false` |
| AC3 | `T06 AC3: a blocked room is rejected even when the time is free` | blocked room, free time 720–780 → `false` |
| AC4 | `T07 B4 AC4: overlapping an existing booking (630-690 vs 600-660) is rejected`<br>`T08 B3 AC4: touching the end of a booking (660-720 after 600-660) is available` | 630–690 against booking 600–660 → `false`; 660–720 → `true` |
| AC5 | `T10 AC5: checking does not change the booking data`<br>`T11 AC5: the same request asked twice gives the same answer` | two checks on a bookings list → list unchanged; same request twice → same answer `true` both times |
| F1 | `T17 F1: only rooms with capacity of at least 10 are kept` | 10 attendees, no equipment → rooms r2, r3, r4 (capacities 12, 20, 40) |
| F2 | `T20 F2: a room must contain all selected items (projector and whiteboard)`<br>`T21 F2: having only one of two selected items is not enough` | projector + whiteboard → r2, r3; whiteboard + video-conference → r3 only |
| F3 | `T12 F3: a blocked room is not available even when its time is free` | `checkRoom` on blocked r3, free time 720–780 → `false` |
| F4 | `T24 F4: when no room matches the result is an empty list` | 100 attendees → `[]` |
| F5 | `T13 F5: the same times give different results for different rooms`<br>`T14 F5: a room is not blocked by the bookings of another room`<br>`T15 F5: an unknown room id is not available` | 600–660 on r1 (booked 600–660) → `false` and on r2 (no bookings) → `true`; 630–690 on r2 → `true`; unknown id → `false` |
| B1 | `T04 B1 AC2: exactly 120 minutes (720-840) is available` | 720–840 → `true` |
| B2 | `T05 B2 AC2: 121 minutes (720-841) is rejected` | 720–841 → `false` |
| B3 | `T08 B3 AC4: touching the end of a booking (660-720 after 600-660) is available`<br>`T09 B3 AC4: touching the start of a booking (540-600 before 600-660) is available` | 660–720 → `true`; 540–600 → `true` |
| B4 | `T07 B4 AC4: overlapping an existing booking (630-690 vs 600-660) is rejected` | 630–690 against 600–660 → `false` |
| B5 | `T18 B5 F1: capacity exactly equal to the attendees (12) is included` | 12 attendees → r2 (12 seats) is in the result |
| B6 | `T19 B6 F1: capacity one below the attendees (8 seats for 9) is excluded` | 9 attendees → r1 (8 seats) is not in the result; result is r2, r3, r4 |
| INT | `T25 INT: filterRooms then checkRoom on each returned room` | 10 attendees + projector → r2, r3, r4; `checkRoom` for 600–660 → `[false, true, false]` (r2 booked, r3 free, r4 blocked) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
cd sis-04\app
npm install
npx vitest run
npm run build
npm run dev
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
E:\Github\se-practice\sis-04\app>npx vitest run

 RUN  v3.2.7 E:/Github/se-practice/sis-04/app

 ✓ src/checkRoom.test.ts (5 tests) 4ms
 ✓ src/filter.test.ts (10 tests) 7ms
 ✓ src/booking.test.ts (11 tests) 6ms

 Test Files  3 passed (3)
      Tests  26 passed (26)
   Start at  21:48:09
   Duration  444ms (transform 103ms, setup 0ms, collect 155ms, tests 16ms, environment 1ms, prepare 404ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 0/0 | 26/26 | The `Tests` line of the baseline run in 1.1 (`No test files found`, so 0/0) and of the final `npx vitest run` in 6.3 (`Tests  26 passed (26)`, in 3 files: 11 + 5 + 10). |
| Duplicated logic locations removed | 0 | 2 | Counted in 5.3: the "start before end" rule written twice in `check()` (now `isValidRange`) and the `1440` limit typed twice (now `END_OF_DAY`). |
| Code structure: modules and their responsibilities | 3 files in `app/src`: `App.tsx` (data, rules, helpers and UI together), `main.tsx`, `index.css` | 15 files in `app/src`: `rooms.ts`, `booking.ts`, `filter.ts`, `time.ts`, `App.tsx`, 5 components, `main.tsx`, `index.css`, 3 test files | `git ls-files sis-04/app/src` at the baseline commit `fb5bfd8` and at the head of the branch, read against 5.1 and `diagrams/after.puml`. |
| Remaining limitation | The page had no test of any kind, so nothing could catch a change to AC1–AC5. | F4 (empty state), F5 on the page and `clearFeedback()` in `App.tsx` are shown only by the screenshots in `evidence/`. The 26 tests call `canBook`, `checkRoom` and `filterRooms`, but no test renders the page. The error messages and the disabled button are not tested either. | From what happened in this work: the F4 and F5 tests in 6.1 call the functions, while the page behaviour was checked by hand on `npm run dev`. |

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
