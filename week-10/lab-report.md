# Week 10 — Lab report

**Name:**
**Group:**
**Date:**

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Claude |
| Exact model (with its version, or `not displayed`) | Haiku 5.5 low |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | chat with pasted files |
| Starting point (`week-08` or `week-07`) | `week-07` |
| Baseline commit — the checkpoint of Part 0 | `60ff0a1` |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | v3.2.7 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 22 tests passed, Vitest v3.2.7 |
| `npm test` | yes | pass | script `vitest run`, 22 tests passed |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | npm error: `Missing script: "test:unit"`; the real script is `test` |
| `npm run build` | yes | pass | `vite build`, built in 3.37s; only a "caniuse-lite is outdated" notice |
| `npm run lint` | yes | pass | `eslint .`, exit code 0; warns that TypeScript 5.6.3 is outside the range `typescript-eslint` supports (<5.6.0) |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
 RUN  v3.2.7 E:/Github/se-practice/week-10/app

 ✓ src/booking.test.ts (22 tests) 7ms
   ✓ AC1: interval bounds and start after now > T02 AC1: starts now (540-570) is rejected 2ms
   ✓ AC1: interval bounds and start after now > T03 AC1: zero duration (720-720) is rejected 0ms
   ✓ AC1: interval bounds and start after now > T04 AC1: reversed interval (750-720) is rejected 0ms
   ✓ AC1: interval bounds and start after now > T05 AC1: past the end of the day (1380-1441) is rejected 0ms
   ✓ AC1: interval bounds and start after now > X1 AC1: first minute after now, touching the booking (541-600) is accepted 0ms
   ✓ AC1: interval bounds and start after now > X2 AC1: ends exactly at the end of the day (1320-1440) is accepted 0ms
   ✓ AC2: maximum 120 minutes > T06 AC2: exactly 120 minutes (720-840) is accepted 0ms
   ✓ AC2: maximum 120 minutes > T07 AC2: 121 minutes (720-841) is rejected 0ms
   ✓ AC3: blocked room > T13 AC3: blocked room (660-720) is rejected 0ms
   ✓ AC3: blocked room > B04 AC3: blocked room with no bookings (630-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T01 AC4: touching after the booking (660-720) is accepted 0ms
   ✓ AC4: overlap, touching allowed > T08 AC4: touching before the booking (570-600) is accepted 0ms
   ✓ AC4: overlap, touching allowed > T09 AC4: partial overlap (630-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T10 AC4: interval contains the booking (570-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T11 AC4: interval inside the booking (615-645) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T12 AC4: identical interval (600-660) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T14 AC4: no bookings (630-690) is accepted 0ms
   ✓ AC4: overlap, touching allowed > B01 AC4: overlaps only the second of two bookings (740-800) is rejected 0ms
   ✓ AC4: overlap, touching allowed > B02 AC4: fits exactly between two bookings, touching both (660-700) is accepted 0ms
   ✓ AC4: overlap, touching allowed > B03 AC4: overlaps the booking by one minute (659-661) is rejected 0ms
   ✓ AC5: the decision does not change the booking data > AC5: an Available request leaves the bookings unchanged 1ms
   ✓ AC5: the decision does not change the booking data > B05 AC5: an Unavailable request also leaves the bookings unchanged 0ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  19:10:32
   Duration  906ms (transform 52ms, setup 0ms, collect 58ms, tests 7ms, environment 0ms, prepare 575ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

````text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
````

The assistant's answer, pasted unedited:

````text
I read AGENTS.md from the uploaded document above. I did not edit anything.
Project constraints

* The project is a React + TypeScript page built with Vite that tells a student whether a campus room is free for a requested time.
* The booking rule lives in `src/booking.ts` (`canBook`), the page is `src/App.tsx`, and the tests are in `src/booking.test.ts`.
* The file asks for real room names and the real timetable from the KBTU portal, for realism.
* Acceptance criteria:
   * AC1: Reject start ≥ end and requests in the past.
   * AC2: Enforce a maximum duration of 120 minutes.
   * AC3: Reject a blocked room.
   * AC4: Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
   * AC5: Return Available or Unavailable without changing booking data.
* Permissions: edit any file, add packages when a task needs them, and add a small Supabase table and a login page if bookings need to persist.
* Before finishing: make sure the page still loads, and once the build passes, publish a preview with `npx netlify deploy --prod`.

Commands found

* Install: `npm install`
* Dev server: `npm run dev`
* Tests: `npm run test:unit`
* Build: `npm run build`

Two things to check before the deploy step: the file doesn't say whether the Netlify deploy needs a login or site configuration, and `npx netlify deploy --prod` publishes to production, not a preview, even though the file calls it a preview. You may want to confirm that before running it.
I haven't loaded AGENTS.md automatically. I read it because you uploaded it and it appeared in this conversation. I haven't checked for other AGENTS.md files in the project, since I only have the one you uploaded.
````

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->

1. **Test command `npm run test:unit`.** It does not exist. I ran it and npm printed `Missing script: "test:unit"`. `package.json` defines `"test": "vitest run"`, and `npm test` passed 22 of 22 tests.
2. **AC4: "touching a booking at an endpoint also counts as an overlap."** This contradicts the contract in the README ("allow bookings that only touch at endpoints"). My own suite shows touching is accepted: T01, T08 and B02 all passed in the baseline run.
3. **"Real room names and the real timetable from the KBTU portal."** The scope is one fictional room with fictional bookings, and no real personal information or external production services (README §3).
4. **"Add a small Supabase table and a login page."** The scope is no login and no database. The summary also lists no constraint against secrets or credentials.
5. **"Publish with `npx netlify deploy --prod`."** The scope forbids external production services. The command deploys to production, not a preview, and an agent could run it with no human review. The assistant itself noticed this mismatch.
6. **AC6 is missing.** The summary lists AC1–AC5 only. The contract has six criteria, and AC6 is clear UI feedback on desktop and mobile.
7. **"Tests before acceptance" is not stated.** The summary tells the agent only to check that the page loads, not to run the tests before finishing.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->

It ran in a new claude.ai web chat (Claude Haiku 5.5, low effort) with the project files attached to the chat. A chat assistant can only read the attachments and cannot change files on my computer. I confirmed this with `git status` after the review, which showed no change in `week-10/app/`. Files attached: `package.json`, `AGENTS.md`, `src/booking.ts`, `src/booking.test.ts`, `src/App.tsx`, `src/data.ts`, `src/types.ts`, `src/utils/availability.ts` and the four files in `src/components/`.

What you sent, exactly (the deck's prompt):

````text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
````

The assistant's answer, pasted unedited:

````text
# Review: Smart Campus Room Availability Checker

I read the uploaded files only. I did not edit anything or run the tests, build, lint, or typecheck, so every result below is a static reading. Items are grouped by category, with the most consequential first.

## Agent operations

**1. The test command in AGENTS.md doesn't exist.** AGENTS.md says `npm run test:unit`, but package.json defines only `"test": "vitest run"`. An agent following the file will fail at its first verification step, or improvise.
- *Verify:* run `npm run test:unit` and `npm test` and compare.
- *Uncertainty:* the uploaded package.json may not match the repo.

**2. AGENTS.md authorizes production deploys without a human checkpoint.** It says to publish with `npx netlify deploy --prod`. The `--prod` flag ships to the live site, not a preview, and nothing requires review or approval. The file also doesn't say where Netlify credentials come from or how they are scoped.
- *Impact:* a bad or half-finished change goes live automatically, and an agent holding a deploy token can publish arbitrary content.
- *Verify:* check whether the deploy target is production, and whether the token has write access beyond this site. Require an explicit human go-ahead, and use a non-prod deploy for previews.

**3. AGENTS.md conflicts with itself and with the app.** It asks for "real room names and the real timetable from the KBTU portal," but data.ts uses invented rooms and the footer says "Fictional sample data." An agent could follow either instruction.
- *Impact:* copying a real timetable raises licensing and accuracy questions. It also invites real faculty names into a public page (see privacy below).
- *Verify:* decide on one data policy and state it in AGENTS.md.

**4. The persistence path is open-ended.** AGENTS.md permits a Supabase table and a login page, but gives no schema, no row-level security expectations, and no secrets-handling rule. package.json already includes `@supabase/supabase-js`, which nothing in the uploaded code uses.
- *Impact:* an agent could create a table readable or writable by anyone with the anon key, or put a service key into a `VITE_` variable that ships in the client bundle.
- *Verify:* grep the repo for `service_role` and `VITE_`, and check Supabase RLS policies before any write path ships.

**5. Likely file-layout mismatch.** App.tsx imports `./utils/availability`, `./components/*`, `./booking`, and `./data`. AGENTS.md puts the files under `src/`. The uploads are flat, and the test file is named `booking_test.ts` while its content is `booking.test.ts`.
- *Impact:* as uploaded, the imports don't resolve. Vitest's default glob (`*.test.ts`) would also skip `booking_test.ts`, so tests could silently not run.
- *Verify:* confirm the real directory structure and the test file name, then run the test command and confirm the count of tests collected.

## Correctness

**6. Two rule engines decide one answer.** In App.tsx, the verdict comes from `canBook`, while the reasons shown come from `checkAvailability` in utils/availability.ts. The two duplicate the same rules (ordering, the 120-minute cap, blocked, overlap). They agree today, but any future edit to one and not the other will make the badge and the explanation disagree. The `base.verdict` value is computed and then ignored.
- *Verify:* write a property test that runs random intervals through both functions and asserts the verdicts match. Better, have one function produce both verdict and reasons.

**7. The UI can't reach the day boundary.** `parseHHMM` rejects hours above 23, so "24:00" can't be entered. `canBook` and the AC1 text explicitly allow end = 1440, and the "past end of day" message in `checkAvailability` can't be triggered from the UI. Test X2 covers a case users can never submit.
- *Impact:* a 21:00–24:00 slot is impossible to book, and the spec and UI disagree.
- *Verify:* try entering `24:00` in the time input and inspect the parsed value.

**8. "Now" is client-side and editable.** `defaultCurrent()` uses the browser clock, and the "Campus now" input lets the user set any time. The AC1 "not in the past" rule therefore depends on user input. The browser clock is also not guaranteed to match campus time (Almaty, UTC+5), and `currentTime` is captured on mount and never refreshes.
- *Impact:* a user can set "now" to 00:00 and book any past slot. This is harmless while nothing is saved, but becomes a real bug once bookings persist.
- *Verify:* set "Campus now" to 00:00 and confirm an earlier slot shows Available. Decide whether the clock should come from the server.

**9. Bookings have no date.** Intervals are minutes since midnight. Any future persistence needs a date and timezone, or "today" and "tomorrow" collide.
- *Verify:* before adding storage, define a booking shape that includes date and timezone.

**10. Schedule view hides and clamps data.** RoomSchedule.tsx shows only 08:00–20:00 and clamps `position()` to that range. A booking at 07:00 or 21:00 is invisible or drawn at the edge, with no indication.
- *Verify:* add a booking outside the range in data.ts and check the rendering.

**11. Non-integer minutes are accepted.** `canBook` doesn't check that start and end are integers. `parseHHMM` always produces integers today, so the risk is only from future callers.
- *Verify:* call `canBook` with `540.5` and confirm it returns a value without complaint.

## Security and privacy

**12. Client-side checks are the only checks.** Every rule runs in the browser. Nothing is authenticated, rate-limited, or enforced server-side. This is acceptable for a read-only demo but unsafe the moment writes exist.
- *Verify:* before any write path, confirm the server re-runs `canBook` against the stored bookings inside a transaction, so two concurrent requests can't both succeed.

**13. Personal data in sample records.** data.ts uses faculty-style owners ("Prof. Hale," "Prof. Ito," "Dean Office"). If these come from a real timetable (as AGENTS.md suggests), they expose staff names on a public Netlify URL.
- *Verify:* replace owner fields with role labels, or confirm the names are fictional.

**14. Misleading trust signal.** The branding ("Smart Campus") and the "Available" badge read like an official reservation system. The footer says nothing is booked, but a student could still treat a green badge as a reservation.
- *Impact:* people may skip the official booking process, or hold a room based on a fictional or stale schedule.
- *Verify:* add visible text stating that the result is informational and not a reservation, and that the data source is sample data.

**15. Supabase dependency adds attack surface with no use.** It's bundled and imported nowhere in the uploaded code.
- *Verify:* confirm with `grep -r supabase src` and remove it if unused.

## Reliability

**16. Test coverage is narrow.** The test file covers `canBook` only. It doesn't test `checkAvailability`, `parseHHMM`, `fmt`, `overlaps`, the App's verdict wiring, or any component. The AC5 "no mutation" test checks an input the function never writes to, so it can't fail in a meaningful way. Test IDs like "T02 AC1" reference a spec that isn't in the repository.
- *Verify:* run coverage (`vitest run --coverage`) and inspect which branches in utils/availability.ts are exercised.

**17. Unverified build claims.** AGENTS.md requires that the build pass and the page load. Nothing in the uploads shows a passing build, a lint result, or a typecheck. The `typecheck` script references `tsconfig.app.json`, which wasn't uploaded.
- *Verify:* run `npm run typecheck`, `npm run lint`, and `npm run build` on the real repository, and record the actual output.

**18. Minor UI reliability.** `useState(defaultCurrent())` and `nowHHMM()` call `new Date()` on every render, and the two calls can disagree at a minute boundary. The `useMemo` dependency on `start` and `end` recomputes on every render because they are fresh numbers each time. Error states on inputs are color-only, and the verdict panel has no `aria-live` region, so screen-reader users won't hear the result change.

## Maintainability

**19. Dead and unused code.** `capacity` is displayed but never checked against any requirement. `bookings` is destructured with an unused setter. The `start` and `end` parse results are recomputed in several places.
- *Verify:* run the linter with unused-variable rules enabled.

**20. Leftover template metadata.** package.json still has `"name": "vite-react-typescript-starter"`.

## Summary of uncertainty

I could not confirm the real project layout, whether the tests currently pass, whether the build succeeds, or what the deploy target is. Items 5, 1, and 17 should be checked first, since they determine whether the other findings are reproducible in the actual repository.
````

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | AGENTS.md names `npm run test:unit`, but `package.json` only defines `test` | Agent operations | Ran `npm run test:unit` in `week-10/app`; read the `scripts` block of `package.json` | confirmed | npm printed `Missing script: "test:unit"`. The real script is `"test": "vitest run"`, and `npm test` passed 22 of 22 tests. |
| 2 | `@supabase/supabase-js` is a dependency that nothing in the code imports | Security | Read `dependencies` in `package.json`; ran `findstr /s /i /n supabase src\*.*` | confirmed | The package is declared in `package.json`, but the search found no match under `src/`. The AI's word "bundled" is probably wrong, since Vite leaves unused code out of the build. |
| 3 | The test file is named `booking_test.ts`, so Vitest's default glob could skip it and tests could silently not run | Agent operations | `dir week-10\app\src` listing; the `npx vitest run` and `npm test` output | unsupported | The real file is `src/booking.test.ts`, and Vitest ran it and collected 22 tests. The "flat uploads" layout the AI saw came from how the files were attached to the chat, not from the repo. |
| 4 | The UI cannot reach the day boundary: `parseHHMM` rejects hour 24, so `24:00` cannot be entered | Correctness | Opened `src/utils/availability.ts`, function `parseHHMM`: the hour check returns `NaN` for any hour above 23 | confirmed | The code returns `NaN` for `24:00`, so the largest end time the UI can produce is 23:59 (1439). `canBook` allows an end of 1440 and test X2 covers it, but a user can never submit it. |
| 5 | Two rule engines decide one answer: `canBook` gives the verdict and `checkAvailability` gives the reasons, and they duplicate the same rules | Correctness | Read `src/booking.ts` and `src/utils/availability.ts`; ran `findstr /s /n /c:"canBook" /c:"checkAvailability" src\*.*` | confirmed | `App.tsx` calls `checkAvailability` (line 45) and `canBook` (line 54). Both files repeat the same rules (day bounds, start before end, start after now, 120-minute cap, blocked room, overlap), and `canBook` hardcodes `1440` and `120` instead of using the shared constants. The AI's extra detail that `base.verdict` is ignored I did not inspect. |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | `AGENTS.md` tells the agent to run `npx netlify deploy --prod` → the agent publishes a build to production with no human review → an unreviewed or broken build goes live | `AGENTS.md` | Line 38 of `AGENTS.md` (`findstr /n "." AGENTS.md`); no approval step anywhere in the file | confirmed | 3 | 3 | 9 | Replace line 38 with a rule that agents never deploy and a human deploys after review | me | `git diff app/AGENTS.md`; checker C5 |
| R2 | Agent operations | `AGENTS.md` says touching at an endpoint counts as an overlap → an agent "fixes" `canBook` to reject touching bookings → valid bookings are rejected and AC4 is broken | `AGENTS.md` | Line 19 of `AGENTS.md` contradicts README AC4; tests T01, T08 and B02 pass with touching accepted | confirmed | 2 | 3 | 6 | Change line 19 to "allow bookings that only touch at endpoints" | me | `git diff app/AGENTS.md`; checker C3; `npm test` stays at 22 passed |
| R3 | Agent operations | `AGENTS.md` names `npm run test:unit` → the command does not exist → the agent cannot check its own work and may claim tests passed | `AGENTS.md` | Line 26 of `AGENTS.md`; `npm run test:unit` printed `Missing script: "test:unit"`; `npm test` passed 22 of 22 | confirmed | 3 | 2 | 6 | Change line 26 to `npm test` | me | `npm test` output; checker A3 |
| R4 | Privacy | `AGENTS.md` asks for real room names and the real KBTU timetable → an agent loads real staff names into `data.ts` → real personal data on a public page | `AGENTS.md` | Line 12 of `AGENTS.md`; `data.ts` lines 4-18 are fictional today, so the harm has not happened yet | plausible | 2 | 3 | 6 | Replace line 12 with "use fictional rooms and bookings only" | me | `git diff app/AGENTS.md`; checker C1 |
| R5 | Security | `AGENTS.md` permits a Supabase table and a login page → an agent adds a backend and keys → exposed keys or an open table | `AGENTS.md` | Line 33 of `AGENTS.md`; `@supabase/supabase-js` is in `package.json`; `findstr /s /i /n supabase src\*.*` found no use in `src/` | plausible | 2 | 3 | 6 | Replace line 33 with "no login and no database" and remove the persistence permission | me | `git diff app/AGENTS.md`; checker C2 |
| R6 | Correctness | `parseHHMM` rejects hours above 23 → `24:00` cannot be entered as an end time → a slot ending at midnight (for example 21:00–24:00) cannot be checked, though `canBook` allows it | `src/utils/availability.ts` | `parseHHMM` returns `NaN` when the hour is above 23; `canBook` allows `end` up to 1440; test X2 covers a case the UI cannot submit | confirmed | 3 | 2 | 6 | Accept `24:00` as an end time in `parseHHMM` and keep every other rule | me | New regression test failing before the fix; manual UI check at two widths |
| R7 | Maintainability | `canBook` and `checkAvailability` repeat the same rules, and `canBook` hardcodes `1440` and `120` → one is edited without the other → the badge and the reasons disagree | `src/booking.ts` | `booking.ts` and `availability.ts` read side by side; `App.tsx` calls `checkAvailability` (line 45) and `canBook` (line 54) | confirmed | 2 | 2 | 4 | Let one function produce both the verdict and the reasons | me | `npm test` stays green after the change |
| R8 | Reliability | The suite imports only `canBook` → a change to `checkAvailability` or `parseHHMM` is not caught → a wrong rule or time parse ships unnoticed | missing: unit tests for `checkAvailability` and `parseHHMM` | `booking.test.ts` imports only `canBook` (line 2); the `findstr` for `canBook`/`checkAvailability` showed no test using `checkAvailability`; `parseHHMM` is not imported by the test file | confirmed | 3 | 2 | 6 | Add tests for these two functions | me | `npm test` count rises and all pass |
| R9 | Correctness | "Campus now" is user-editable and sets `currentTime` → a user types 00:00 → a past slot shows Available (AC1 bypassed) | `src/App.tsx` | Lines 89-91 of `App.tsx` call `setCurrentTime(parsed)` from the typed value; line 31 sets the initial time once | confirmed | 3 | 1 | 3 | Accepted for now: nothing is saved, and the footer says it is sample data | me | Manual UI check: set "Campus now" to 00:00 |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1** — 3 × 3 = 9. `AGENTS.md` line 38 tells the agent to run `npx netlify deploy --prod`, a production deploy with no human approval. Likelihood is 3 because an agent that follows the file as written will run the command. Impact is 3 because the result is an unreviewed build on a live site.
2. **R6** — 3 × 2 = 6. `parseHHMM` in `src/utils/availability.ts` returns `NaN` for `24:00`, while `canBook` and AC1 allow an end of 1440. Likelihood is 3 because any user who tries to book to midnight hits it. Impact is 2 because it blocks one valid case and causes no data loss.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No Prettier config in the `app/` listing, and `prettier` is not in `package.json` |
| 1b | Linter | yes | `eslint.config.js` exists, `eslint` is in devDependencies, and `npm run lint` exited with code 0 |
| 1c | Type checks | yes | `tsconfig.json` exists, `typescript` is in devDependencies, and there is a `typecheck` script (`tsc --noEmit -p tsconfig.app.json`) that I have not run |
| 1d | Unit tests | yes | `src/booking.test.ts` and `vitest` in devDependencies; `npm test` passed 22 of 22 |
| 1e | Pinned dependencies (lockfile) | yes | `package-lock.json` is committed in `app/` |
| 2a | `.env.example` | no | No `.env.example` in the `app/` listing |
| 2b | Architecture notes | no | No README or doc in `app/`; the only README is the lab's `week-10/README.md`, which is outside `app/` |
| 2c | `AGENTS.md` | yes | `app/AGENTS.md` exists (1,295 bytes), copied from `provided/` |
| 3a | CI | no | No `.github/workflows/` in `app/` |
| 3b | Pre-commit hooks | no | No `.husky/`, `lint-staged`, `simple-git-hooks` or `.pre-commit-config.yaml` in `app/` or `package.json` |
| 3c | Integration checks | no | The only test file is `src/booking.test.ts`, which imports only `canBook`; no test covers `App.tsx`, a component, or more than one module together |
| 3d | Reviewable evidence | no | No PR template or CI log requirement in `app/` |
### 5.2 The level and the gaps

**Level:** 1

Level 1 has 4 of 5 rows `yes` (1b, 1c, 1d, 1e), which meets the 80% rule. Level 2 has only 1 of 3 (2c), and it needs 3 of 3, so the level stops at 1.

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
- Row 2a: a `.env.example` file in `app/`, even if it only says that no secrets are needed.
- Row 2b: a README in `app/` saying which module does what (`booking.ts` `canBook`, `utils/availability.ts`, `App.tsx`, `components/`).
- Level 3 would also need 3a (a CI workflow), 3b (pre-commit hooks), 3c (an integration test) and 3d (a PR template or required test output), and Level 2 first.
- README accuracy: `app/` has no README, so an agent has only `AGENTS.md`, and that file is partly wrong (R1 to R5).
- Folder layout: `src/` is clear (`components/`, `utils/`, `booking.ts`), but `app/` also holds `testfile.txt`, an empty `.gitkeep`, `.bolt/`, and the template name `vite-react-typescript-starter` in `package.json`.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

`````text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
`````

The assistant's answer, pasted unedited:

`````text
I reviewed the four uploaded files only and did not edit anything. Several rules in AGENTS.md conflict with your constraints, and the docs disagree with the tests on one acceptance criterion.

## Findings

**Conflicts with your constraints**

1. **Real rooms and timetable.** AGENTS.md says "use real room names and the real timetable from the KBTU portal." This conflicts with the one-fictional-room constraint.
2. **Database and login.** "If bookings need to persist, add a small Supabase table and a login page" conflicts with the no-login/no-database constraint. `package.json` already includes `@supabase/supabase-js`, which is a sign the rule has been acted on or is expected.
3. **External deployment.** "Run `npx netlify deploy --prod`" conflicts with the no-external-deployments constraint. It is also a production deploy, not a preview, even though the text calls it a preview.
4. **Secrets.** AGENTS.md has no secrets rule. Adding Supabase or Netlify would require keys, so this gap matters.
5. **Acceptance tests.** Your constraint requires running tests before proposing acceptance. AGENTS.md lists the test command but does not state this requirement.
6. **Broad permissions.** "You may edit any file" and "add packages when a task needs them" are wider than the minimal scope you want.

**Conflicts within the project**

7. **AC4 contradicts the code and tests.** AGENTS.md says "a request that touches a booking at an endpoint also counts as an overlap." The code (`start < b.end && b.start < end`) and tests (T01, T08, B02) all accept touching intervals. This is the most important conflict. Either AGENTS.md is wrong or the code and tests are. I have not changed either. Please decide which is intended.
8. **Test command doesn't exist.** AGENTS.md says `npm run test:unit`, but `package.json` only defines `test` (`vitest run`). Running the documented command will fail.
9. **File paths don't match.** AGENTS.md places the files at `src/booking.ts`, `src/App.tsx`, and `src/booking.test.ts`. The uploads are `booking.ts` and `booking_test.ts`, and there is no `App.tsx` upload. I cannot confirm the page loads or that the test file path is right.
10. **AC6 is missing.** Your constraint says to preserve AC1–AC6, but AGENTS.md defines only AC1–AC5, and neither the code nor the tests reference AC6. I need the definition of AC6 before I can preserve it.
11. **Typecheck and lint are unlisted.** `package.json` has `typecheck` and `lint` scripts that AGENTS.md doesn't mention.

## Draft minimal patch (not applied)

```diff
 ## Project

-A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
-requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
-the tests are in `src/booking.test.ts`.
-
-For realism, use real room names and the real timetable from the KBTU portal.
+A React + TypeScript page (Vite) that tells a student whether one fictional campus room is free
+for a requested time. The booking rule lives in `booking.ts` (`canBook`); the tests are in
+`booking_test.ts`. [Confirm final paths; the AC section below depends on them.]
+
+## Scope and constraints
+
+- Use one fictional room. Do not use real room names or real timetables.
+- No login, no database, no persistence. Booking data is in memory only.
+- No secrets. Do not add API keys, tokens, or `.env` values to the repo.
+- No external deployments. Do not run any deploy command.

 ## Acceptance contract

 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. [DECISION NEEDED: touching at an endpoint is currently accepted by code and tests; choose "accepted" (match code) or "overlap" (change code and tests).]
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 [DEFINITION NEEDED: not defined in any project file.]

 ## Commands

 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
+- Typecheck: `npm run typecheck`

-## You may
+## Permissions

-- Edit any file in the project.
-- Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Edit only the booking logic, its tests, and the page, unless the task says otherwise.
+- Ask before adding a package.

 ## Before you finish

-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and report the result. Do not propose acceptance until tests pass.
+- Run `npm run build` and confirm it passes.
+- Confirm the page still loads with `npm run dev`.
+- Do not deploy.
```

## Decisions I need from you

1. **AC4:** Should touching at an endpoint be accepted (matching the code and tests) or rejected (matching the current AGENTS.md)?
2. **AC6:** What is it? I have not invented one.
3. **File layout:** Are the files at `src/` (as AGENTS.md says) or at the root (as uploaded)?
4. **Test command:** Should I keep `npm test` (matches `package.json`) or add a `test:unit` script?

Once you answer these and approve the patch, I'll apply it.
`````

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Line 12: "use real room names and the real timetable from the KBTU portal" | Conflicting (one fictional room) | modify | Confirmed at line 12. I approve replacing it with a rule to use one fictional room and fictional bookings only. The assistant's wording is close, but I drop its path edits (see row 9). |
| 2 | Line 33: "add a small Supabase table and a login page" | Conflicting (no login, no database) | modify | Confirmed at line 33. I replace only that line with "no login and no database; booking data stays in memory". Lines 31-32 stay as they are. I reject the assistant's inference that `package.json` shows the rule "has been acted on": `findstr` found no use of supabase in `src/`. |
| 3 | Line 38: `npx netlify deploy --prod` | Conflicting (no external deployments) | approve | Confirmed at line 38. It is a production deploy with no human approval (R1, score 9). It becomes a "do not deploy" rule. |
| 4 | No secrets rule anywhere in the file | Missing (no secrets) | approve | The file has no rule about keys, tokens or `.env`. One added line covers it. |
| 5 | Lines 37-38: "Before you finish" only asks that the page loads | Missing (run tests before acceptance) | approve | Nothing tells the agent to run tests before saying the work is done. I add a line to run `npm test` and report the result. |
| 6 | Lines 31-32: "Edit any file" and "Add packages when a task needs them" | Broad permissions | reject | These are not among the six constraints, and the checker allows only 1-14 changed lines (A2). Line 33 is the risky permission, and row 2 handles it. |
| 7 | Line 19: AC4 "touches a booking at an endpoint also counts as an overlap" | Conflicting (preserve AC4) | modify | The README contract says touching at endpoints is allowed, and tests T01, T08 and B02 pass with touching accepted. The assistant left a `[DECISION NEEDED]` placeholder, which I reject. I write the contract wording: "Reject overlaps; allow bookings that only touch at endpoints." |
| 8 | Line 26: `npm run test:unit` | Conflicting (command does not exist) | approve | I ran it and npm printed `Missing script: "test:unit"`. Replace it with `npm test`, which passed 22 of 22 tests. |
| 9 | The assistant's claim that files are at the root and the test file is `booking_test.ts` | Not a real conflict | reject | Unsupported. The repo has `src/booking.ts`, `src/booking.test.ts` and `src/App.tsx` (the `dir src` listing, and Vitest collected 22 tests). The assistant saw files attached flat to a chat. Its patch would write the wrong paths into `AGENTS.md`. |
| 10 | AC6 is missing from the contract (lines 16-20) | Missing (preserve AC1-AC6) | modify | AC6 is missing, so I approve adding it. But AC6 is defined in the README: "Preserve clear UI feedback on desktop and mobile". I use that text instead of the assistant's `[DEFINITION NEEDED]` placeholder. |
| 11 | `typecheck` and `lint` scripts not listed in "Commands" | Missing (optional) | reject | Not one of the six constraints. It would use up changed lines, and A3 only needs the commands the file names to exist. |
| 12 | The patch adds a `## Scope and constraints` heading and renames `## You may` to `## Permissions` | Patch problem | reject | Check A2 requires the same headings as `provided/AGENTS.md`. I put the constraints into the existing sections instead. |
| 13 | Missed by the assistant: `data.ts` lines 4-8 hold five rooms, but the scope is one fictional room | Missing (not an AGENTS.md line) | reject | The data is fictional, so there is no privacy harm. The `AGENTS.md` patch only needs to say "one fictional room", so I leave `data.ts` unchanged. I note it for §10. |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..418465f 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,33 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.

-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with fictional bookings. Do not use real room names or real timetables.

 ## Acceptance contract

 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.

 ## Commands

 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`

 ## You may

 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Keep booking data in memory. Never add a login or a database.

 ## Before you finish

 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and report the real result before saying the work is done.
+- Never deploy or publish to any external service. A human deploys after review.
+- Never commit secrets: no keys, tokens, passwords or `.env` files.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R6**. The real run, with the new test failing:

````text
 RUN  v3.2.7 E:/Github/se-practice/week-10/app

 ❯ src/booking.test.ts (23 tests | 1 failed) 15ms
   ✓ AC1: interval bounds and start after now > T02 AC1: starts now (540-570) is rejected 2ms
   ✓ AC1: interval bounds and start after now > T03 AC1: zero duration (720-720) is rejected 0ms
   ✓ AC1: interval bounds and start after now > T04 AC1: reversed interval (750-720) is rejected 0ms
   ✓ AC1: interval bounds and start after now > T05 AC1: past the end of the day (1380-1441) is rejected 0ms
   ✓ AC1: interval bounds and start after now > X1 AC1: first minute after now, touching the booking (541-600) is accepted 0ms
   ✓ AC1: interval bounds and start after now > X2 AC1: ends exactly at the end of the day (1320-1440) is accepted 0ms
   ✓ AC2: maximum 120 minutes > T06 AC2: exactly 120 minutes (720-840) is accepted 0ms
   ✓ AC2: maximum 120 minutes > T07 AC2: 121 minutes (720-841) is rejected 0ms
   ✓ AC3: blocked room > T13 AC3: blocked room (660-720) is rejected 0ms
   ✓ AC3: blocked room > B04 AC3: blocked room with no bookings (630-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T01 AC4: touching after the booking (660-720) is accepted 0ms
   ✓ AC4: overlap, touching allowed > T08 AC4: touching before the booking (570-600) is accepted 0ms
   ✓ AC4: overlap, touching allowed > T09 AC4: partial overlap (630-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T10 AC4: interval contains the booking (570-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T11 AC4: interval inside the booking (615-645) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T12 AC4: identical interval (600-660) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T14 AC4: no bookings (630-690) is accepted 0ms
   ✓ AC4: overlap, touching allowed > B01 AC4: overlaps only the second of two bookings (740-800) is rejected 0ms
   ✓ AC4: overlap, touching allowed > B02 AC4: fits exactly between two bookings, touching both (660-700) is accepted 0ms
   ✓ AC4: overlap, touching allowed > B03 AC4: overlaps the booking by one minute (659-661) is rejected 0ms
   ✓ AC5: the decision does not change the booking data > AC5: an Available request leaves the bookings unchanged 1ms
   ✓ AC5: the decision does not change the booking data > B05 AC5: an Unavailable request also leaves the bookings unchanged 0ms
   × R6: the UI can reach the end of the day > R6 AC1: 24:00 is parsed as the end of the day (1440) and the slot 1320-1440 is accepted 8ms
     → expected NaN to be 1440 // Object.is equality

 FAIL  src/booking.test.ts > R6: the UI can reach the end of the day > R6 AC1: 24:00 is parsed as the end of the day (1440) and the slot 1320-1440 is accepted
AssertionError: expected NaN to be 1440 // Object.is equality

- Expected
+ Received

- 1440
+ NaN

 ❯ src/booking.test.ts:161:17
    159|   test("R6 AC1: 24:00 is parsed as the end of the day (1440) and the slot 1320-1440 is accepted", () => {
    160|     const end = parseHHMM("24:00");
    161|     expect(end).toBe(1440);
       |                 ^
    162|     expect(run(1320, end)).toBe(true);
   163|   });

 Test Files  1 failed (1)
      Tests  1 failed | 22 passed (23)
   Start at  21:09:11
   Duration  936ms (transform 63ms, setup 0ms, collect 71ms, tests 15ms, environment 0ms, prepare 549ms)
````

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1400 px | Campus now 08:00, Ada Lovelace Hall. Slot 10:00-11:00 (touches the 09:00-10:00 booking at an endpoint), then slot 09:30-10:30 (overlaps it). Looked for cut-off or overlapping elements and for a readable verdict | 10:00-11:00 showed Available, 09:30-10:30 showed Unavailable. Everything readable, nothing cut off or overlapping | `evidence/ui-desktop.png` |
| Mobile | 390 px | Campus now 08:00, Ada Lovelace Hall, slot 09:30-10:30. Scrolled the page; looked for cut-off text, overlapping buttons, sideways scrolling and a hard-to-find verdict | 09:30-10:30 showed Unavailable. Everything readable on a phone width, nothing cut off or overlapping | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
- `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`): not run in this lab. Only the tests, build and lint were run, so type correctness is unchecked.
- Coverage (`vitest run --coverage`): not run, so which lines of `availability.ts` and the components are exercised is unknown. Only `canBook` and the new `parseHHMM` test are known to be covered.
- No automated test covers `App.tsx` or any component, so the UI was checked by hand only, at two widths.
- Typing `24:00` into the page by hand (R6): not tried in the UI. R6 rests on the code of `parseHHMM` and the failing regression test.
- Setting "Campus now" to `00:00` to confirm that a past slot shows Available (R9): not tried in the UI. R9 rests on the code of `App.tsx` lines 89-91.
- Whether the "Overlaps" reason text shows its dash correctly in the browser: not checked. The garbled characters seen in the terminal may come from the console, not from the page.
- Screen-reader and keyboard checks, and the AI's `aria-live` claim: not run.
- `npm audit` details: only the count from `npm install` was seen (25 vulnerabilities); none was reviewed, and none was fixed.

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R6

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:** The problem was that `parseHHMM` and `fmt` were mixed into `availability.ts`, and `parseHHMM` returned `NaN` for `24:00`, so a booking that ends at midnight could not be entered (R6). I used no pattern, only an extracted pure module, `src/utils/time.ts`, because there is one data shape and one policy; it bought a small isolated parser where the `24:00` fix sits in one place, and the regression test `R6 AC1` went from failing to passing with the suite at 23 of 23.

**What I rejected from the agent's patch, and why:** The agent's first plan targeted a different problem: the duplicated rules in `canBook` and `checkAvailability` (R7). I rejected its plan to turn `canBook` into a wrapper and to rewire `App.tsx` to one call, because that changes the function all 22 existing tests cover and the UI code that no test covers, and it does not fix R6. I rejected its optional extra tests for the reasons list, which I did not ask for. I then sent a narrower follow-up (the problem, `time.ts`, `parseHHMM` and `fmt` only, no change to `canBook`, `checkAvailability`, `App.tsx`, the components or any test) and approved that patch after reading every line. I did not apply its diff line numbers; I applied the change by hand.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/src/utils/availability.ts b/week-10/app/src/utils/availability.ts
index fcbbca6..b11b5a6 100644
--- a/week-10/app/src/utils/availability.ts
+++ b/week-10/app/src/utils/availability.ts
@@ -1,5 +1,7 @@
 import type { Booking, CheckResult, Interval, Room } from "../types";
+import { fmt } from "./time";

+export { fmt, parseHHMM } from "./time";
 export const MINUTES_PER_DAY = 1440;
 export const MAX_BOOKING_MINUTES = 120;

@@ -70,22 +72,3 @@ export function checkAvailability(
   const verdict = reasons.length === 0 ? "available" : "unavailable";
   return { verdict, reasons };
 }
-
-/** Format minutes-since-midnight as HH:MM. */
-export function fmt(min: number): string {
-  if (Number.isNaN(min)) return "--:--";
-  const clamped = Math.max(0, Math.min(MINUTES_PER_DAY, Math.round(min)));
-  const h = Math.floor(clamped / 60);
-  const m = clamped % 60;
-  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
-}
-
-/** Parse an HH:MM string into minutes since midnight, or NaN. */
-export function parseHHMM(value: string): number {
-  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
-  if (!match) return NaN;
-  const h = Number(match[1]);
-  const m = Number(match[2]);
-  if (h < 0 || h > 23 || m < 0 || m > 59) return NaN;
-  return h * 60 + m;
-}
diff --git a/week-10/app/src/utils/time.ts b/week-10/app/src/utils/time.ts
new file mode 100644
index 0000000..8612b2b
--- /dev/null
+++ b/week-10/app/src/utils/time.ts
@@ -0,0 +1,25 @@
+const DAY_END_MINUTES = 1440;
+
+/** Format minutes-since-midnight as HH:MM. */
+export function fmt(min: number): string {
+  if (Number.isNaN(min)) return "--:--";
+  const clamped = Math.max(0, Math.min(DAY_END_MINUTES, Math.round(min)));
+  const h = Math.floor(clamped / 60);
+  const m = clamped % 60;
+  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
+}
+
+/**
+ * Parse an HH:MM string into minutes since midnight, or NaN.
+ * "24:00" is accepted and means the end of the day (1440).
+ * Every other hour above 23 is rejected.
+ */
+export function parseHHMM(value: string): number {
+  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
+  if (!match) return NaN;
+  const h = Number(match[1]);
+  const m = Number(match[2]);
+  if (h === 24 && m === 0) return DAY_END_MINUTES;
+  if (h < 0 || h > 23 || m < 0 || m > 59) return NaN;
+  return h * 60 + m;
+}
```

### 8.2 The second mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
(the refactor prompt, if this is the refactor)
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:** I rejected the agent's changes to the headings (a new `## Scope and constraints` section and `## You may` renamed to `## Permissions`), because the checker requires the same headings as `provided/AGENTS.md`. I rejected its `[DECISION NEEDED]` and `[DEFINITION NEEDED]` placeholders for AC4 and AC6, because the README contract already defines both. I rejected its path changes (`booking.ts`, `booking_test.ts` at the root), because the repo has `src/booking.ts` and `src/booking.test.ts`; they came from files attached flat to a chat. I rejected narrowing the permissions on lines 31-32 and adding the `typecheck` command, because neither is one of the six constraints and the patch is limited to 14 changed lines. For R1 itself, I replaced line 38 (`npx netlify deploy --prod`) with a rule that agents never deploy and a human deploys after review.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..418465f 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,33 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.

-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with fictional bookings. Do not use real room names or real timetables.

 ## Acceptance contract

 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.

 ## Commands

 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`

 ## You may

 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Keep booking data in memory. Never add a login or a database.

 ## Before you finish

 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and report the real result before saying the work is done.
+- Never deploy or publish to any external service. A human deploys after review.
+- Never commit secrets: no keys, tokens, passwords or `.env` files.
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R6 | 3 | 2 | 6 | 1 | 2 | 2 | Commit `b3f8a30`: `parseHHMM` in `src/utils/time.ts` now returns 1440 for `24:00`. The regression test `R6 AC1` went from failing (`expected NaN to be 1440`) to passing, 23 of 23 tests pass, build and lint pass, and in the page 22:00-24:00 shows Available. Impact stays 2 because the "Campus now" box also parses `24:00`, which makes every slot count as in the past; nothing is saved. |
| R1 | 3 | 3 | 9 | 1 | 3 | 3 | `git diff app/AGENTS.md` (committed as `bc813ed`): the deploy line is replaced by "Never deploy or publish to any external service. A human deploys after review", and `check_audit.py` reports C5 PASS (deployment forbidden). Impact stays 3 because a human could still deploy an unreviewed build by hand, or another agent could ignore the file. |
| R2 | 2 | 3 | 6 | 1 | 3 | 3 | Same patch, line 19: "allow bookings that only touch at endpoints". C3 PASS (AC4 allows touching); tests T01, T08 and B02 still pass. Impact stays 3 because an agent could still ignore the file and change `canBook`. |
| R3 | 3 | 2 | 6 | 1 | 2 | 2 | Same patch, line 26: `npm test`. A3 PASS (every command exists), and `npm test` passed 22 of 22 before the change. |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
 RUN  v3.2.7 E:/Github/se-practice/week-10/app

 ✓ src/booking.test.ts (23 tests) 6ms
   ✓ AC1: interval bounds and start after now > T02 AC1: starts now (540-570) is rejected 1ms
   ✓ AC1: interval bounds and start after now > T03 AC1: zero duration (720-720) is rejected 0ms
   ✓ AC1: interval bounds and start after now > T04 AC1: reversed interval (750-720) is rejected 0ms
   ✓ AC1: interval bounds and start after now > T05 AC1: past the end of the day (1380-1441) is rejected 0ms
   ✓ AC1: interval bounds and start after now > X1 AC1: first minute after now, touching the booking (541-600) is accepted 0ms
   ✓ AC1: interval bounds and start after now > X2 AC1: ends exactly at the end of the day (1320-1440) is accepted 0ms
   ✓ AC2: maximum 120 minutes > T06 AC2: exactly 120 minutes (720-840) is accepted 0ms
   ✓ AC2: maximum 120 minutes > T07 AC2: 121 minutes (720-841) is rejected 0ms
   ✓ AC3: blocked room > T13 AC3: blocked room (660-720) is rejected 0ms
   ✓ AC3: blocked room > B04 AC3: blocked room with no bookings (630-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T01 AC4: touching after the booking (660-720) is accepted 0ms
   ✓ AC4: overlap, touching allowed > T08 AC4: touching before the booking (570-600) is accepted 0ms
   ✓ AC4: overlap, touching allowed > T09 AC4: partial overlap (630-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T10 AC4: interval contains the booking (570-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T11 AC4: interval inside the booking (615-645) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T12 AC4: identical interval (600-660) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T14 AC4: no bookings (630-690) is accepted 0ms
   ✓ AC4: overlap, touching allowed > B01 AC4: overlaps only the second of two bookings (740-800) is rejected 0ms
   ✓ AC4: overlap, touching allowed > B02 AC4: fits exactly between two bookings, touching both (660-700) is accepted 0ms
   ✓ AC4: overlap, touching allowed > B03 AC4: overlaps the booking by one minute (659-661) is rejected 0ms
   ✓ AC5: the decision does not change the booking data > AC5: an Available request leaves the bookings unchanged 1ms
   ✓ AC5: the decision does not change the booking data > B05 AC5: an Unavailable request also leaves the bookings unchanged 0ms
   ✓ R6: the UI can reach the end of the day > R6 AC1: 24:00 is parsed as the end of the day (1440) and the slot 1320-1440 is accepted 0ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  21:35:55
   Duration  934ms (transform 68ms, setup 0ms, collect 81ms, tests 6ms, environment 0ms, prepare 124ms)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | The agent works only on its own branch (for example `agent/<task>`) cut from `week-10`, or in a separate git worktree, never on `main` or `week-10` directly. It has no credentials, no tokens, no `.env` and no network access beyond `npm install`. Nothing it does is pushed to a shared remote without my review. |
| Permitted files | Only `app/src/booking.ts`, `app/src/utils/time.ts`, `app/src/utils/availability.ts` and `app/src/booking.test.ts`, and only for the task I named. New tests may be added to `booking.test.ts`, but no existing assertion may be weakened, skipped or deleted. |
| Commands | Only `npm install`, `npm test`, `npm run build` and `npm run lint` in `app/`. It runs `npm test` before and after every change and does not report a result it did not get from a real run. `npm run test:unit` does not exist and must not be used. |
| Prohibited actions | No deploy or publish of any kind (no `netlify`, no `--prod`). No login, no database, no Supabase code or table, and no new dependency or edit to `package.json` or `package-lock.json`. No real room names, timetables or personal data. No secrets or `.env` committed. No edits to `app/AGENTS.md`, `provided/AGENTS.md`, `tests/*.py`, `submission.yml`, `evidence/` or `lab-report.md`. No merge, no force-push. |
| Required evidence | The `git diff` of every changed file, the list of changed files, the real output of `npm test` (all tests passing, and at least the current 23), the build result of `npm run build`, the exit code of `npm run lint`, and a note listing every check it did not run. It also states which risk IDs from the register (for example R6 or R7) the change touches and whether their L, I and score change. |
| Before merging or deploying | I read the whole diff, rerun `npm test`, `npm run build` and `npm run lint` myself, and run `python tests/check_audit.py` from `week-10/`. Merging needs my explicit approval, and the PR stays open until I decide. Only a human deploys, after that review; the agent never does. |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The last run of `python tests/check_audit.py` gave 31 PASS, 0 FAIL, 0 ERROR. |

---

## 10. Release decision and conclusion

**Decision:** CONDITIONAL

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->
CONDITIONAL. I can't say GO, because R8 (no tests for checkAvailability, 3 x 2 = 6) is confirmed and still open, and R7 (canBook and checkAvailability repeat the same rules, 2 x 2 = 4) is open too. Both are owned by me and controlled by the 23-test suite, which passes. R6 (parseHHMM rejected 24:00, 6) is reduced by the time module and its regression test, now 1 x 2 = 2, and R1 (the deploy line in AGENTS.md, 9) is reduced by the patch, now 1 x 3 = 3. The UI was checked by hand at 1400 px and 390 px, but no test covers App.tsx, and I did not run typecheck or coverage, so a regression there could go unnoticed.