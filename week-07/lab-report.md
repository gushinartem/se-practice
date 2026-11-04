# Week 07 — Lab report

**Name:** Guchshin Artem
**Group:** Monday16-19
**Date:** 2026-11-03

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | week-06 |
| Bolt project link (or `not shared`, and why) | https://bolt.new/p/72349374  |
| Assistant that generated the tests (tool) | Claude |
| Exact model (with its version, or `not displayed`) | Haiku 5.5 low |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) |  |
| Test command | npx vitest run |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | src/utils/availability.ts, function checkAvailability. It is called from src/App.tsx. |
| Its inputs | 	interval ({ start, end } in minutes), room (a Room object with id, name, blocked, or null), bookings (the bookings of all rooms, each with a roomId), and currentTime in minutes. |
| What it returned | An object { verdict: "available" or "unavailable", reasons: string[] }, not a boolean. The reasons are messages such as “Start time must be after the current campus time.” |
| How the page used it | App.tsx calls it inside useMemo, but only once both start and end are typed. The result goes to VerdictPanel, which shows a green “Available” or a red “Unavailable” with the list of reasons. |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->
I created src/booking.ts and moved the booking decision into one function, canBook({ start, end, now, blocked, bookings }), which returns true or false. I copied the conditions from checkAvailability in src/utils/availability.ts without changing them: NaN check, day bounds (0 ≤ start, end ≤ 1440), start < end, start after now, duration at most 120 minutes, blocked room, and the overlap check where touching endpoints are allowed. The behaviour did not change because I only copied the same comparisons and the page still gives the same Available / Unavailable result for the same inputs; I checked this in the browser. The page file src/App.tsx now imports canBook from ./booking and calls it for the verdict. It filters the bookings by the selected room and passes the room's blocked flag and the campus time as now. The HH:MM parsing and the reason messages stay in availability.ts and the page.
---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The booking is 600–660 and its end 660 is excluded, so my interval starting at 660 only touches it and shares no minute. Start 660 is after now (540) and the length is 60 minutes, so nothing rejects it. |
| T02 | 540–570 (starts now) | false | AC1 | Start 540 equals now (540). AC1 needs the start strictly after the current time, so a start equal to now is rejected. |
| T03 | 720–720 (zero duration) | false | AC1 | Start and end are both 720, so the duration is 0 minutes. AC1 needs start < end, which is not true here. |
| T04 | 750–720 (reversed) | false | AC1 | The start 750 is later than the end 720, so the interval runs backwards. AC1 needs start < end. |
| T05 | 1380–1441 (past day end) | false | AC1 | End 1441 is one minute past the end of the day (1440). AC1 needs end ≤ 1440. The length is only 61 minutes and nothing overlaps, so only the day limit rejects it. |
| T06 | 720–840 (120 minutes) | true | AC2 | 840 − 720 = 120 minutes exactly. AC2 rejects only bookings longer than 120, so exactly 120 is allowed. It is also after now and after the existing booking. |
| T07 | 720–841 (121 minutes) | false | AC2 | 841 − 720 = 121 minutes, one minute over the AC2 limit of 120, so it is rejected. Everything else is valid. |
| T08 | 570–600 (touching before) | true | AC4 | My interval ends at 600, exactly where the booking 600–660 starts, so they only touch and share no minute. Start 570 is after now (540) and the length is 30 minutes. |
| T09 | 630–690 (partial overlap) | false | AC4 | My interval shares the minutes 630–660 with the booking 600–660. That is a real overlap, so AC4 rejects it. |
| T10 | 570–690 (contains booking) | false | AC4 | My interval starts before the booking and ends after it, so it contains the whole 600–660. Its length is 120, so AC2 is fine and only the overlap rule rejects it. |
| T11 | 615–645 (inside booking) | false | AC4 | 615–645 lies completely inside 600–660. Any shared minutes count as an overlap, so AC4 rejects it. |
| T12 | 600–660 (identical interval) | false | AC4 | The interval is exactly the same as the existing booking, so every minute overlaps. AC4 rejects it. |
| T13 | 660–720, blocked = true | false | AC3 | The times are the same as in T01, which is valid, so the only change is that the room is blocked. AC3 rejects any request for a blocked room. |
| T14 | 630–690, bookings = [] | true | AC4 | The same times as T09, which was rejected only because of the booking. With no bookings nothing can overlap, and the rest is valid (after now, 60 minutes, inside the day), so it is allowed. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | I call canBook with an Available request (660–720) and compare the bookings array with a copy taken before the call. A decision must not change the booking data, so both must be equal. |
| X1 | 541–600 (one minute after now, touching the booking) | true | AC1 | Start 541 is the first minute after now (540), which T02 only tests from the rejecting side. End 600 only touches the booking, and the length is 59 minutes, so it is allowed. |
| X2 | 1320–1440 (ends exactly at the end of the day) | true | AC1 | End 1440 is the last allowed minute because AC1 says end ≤ 1440, which T05 only tests from the rejecting side (1441). The length is exactly 120 minutes (AC2 allows it) and nothing overlaps, so it is allowed. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Default fixture: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }], fresh for every test.

| ID | Candidate / changed input | Expected | AC |
| --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 |
| T02 | 540–570 (starts now) | false | AC1 |
| T03 | 720–720 (zero duration) | false | AC1 |
| T04 | 750–720 (reversed) | false | AC1 |
| T05 | 1380–1441 (past day end) | false | AC1 |
| T06 | 720–840 (120 minutes) | true | AC2 |
| T07 | 720–841 (121 minutes) | false | AC2 |
| T08 | 570–600 (touching before) | true | AC4 |
| T09 | 630–690 (partial overlap) | false | AC4 |
| T10 | 570–690 (contains booking) | false | AC4 |
| T11 | 615–645 (inside booking) | false | AC4 |
| T12 | 600–660 (identical interval) | false | AC4 |
| T13 | 660–720, blocked = true | false | AC3 |
| T14 | 630–690, bookings = [] | true | AC4 |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 |
| X1 | 541–600 (one minute after now, touching the booking) | true | AC1 |
| X2 | 1320–1440 (ends exactly at the end of the day) | true | AC1 |

The function under test is in src/booking.ts:

export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return false;
  }

  if (start < 0 || end > 1440) {
    return false;
  }
  if (start >= end) {
    return false;
  }
  if (start <= now) {
    return false;
  }

  if (end - start > 120) {
    return false;
  }

  if (blocked) {
    return false;
  }

  if (bookings.some((b) => start < b.end && b.start < end)) {
    return false;
  }

  return true;
}
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
## Run command

npx vitest run tests/booking.test.ts

If Vitest is not installed yet: `npm i -D vitest`. The import path `../src/booking` assumes the test sits in `tests/` beside `src/`. Adjust it if your layout differs.

## AC mapping

| AC | Covered by | Notes |
| --- | --- | --- |
| AC1 (bounds, start after now) | T02, T03, T04, T05, X1, X2 | Covered by the function's boolean result. |
| AC2 (max 120 minutes) | T06, T07 | Covered. |
| AC3 (blocked room) | T13 | Covered. |
| AC4 (overlap, touching allowed) | T01, T08, T09, T10, T11, T12, T14 | Covered. |
| AC5 (Available/Unavailable, data unchanged) | AC5 block, plus T01 and T09 data checks | Data-unchanged part is covered. The visible "Available / Unavailable" label is UI and is **not** covered by this unit file. |
| AC6 (desktop and mobile layout, validation feedback) | None | Not testable with `canBook`. Needs component or end-to-end tests (for example Testing Library, or Playwright at desktop and ~375px widths). |

I checked every expected value in the table against the code. All 16 rows match the current implementation, so I expect them to pass without changes to `src/booking.ts`.

## Unclear requirements to flag

1. **Page import.** You asked for the function the page uses, but I only have `src/booking.ts`. Please confirm the page imports `canBook` from that file and does not wrap it, or the tests may not exercise the real page logic.
2. **AC5 "Available / Unavailable" display.** The function returns a boolean and does not render anything. Where the label is produced, and what text is expected, needs to be specified before it can be tested.
3. **AC6 has no testable criteria.** "Usable at narrow width" and "understandable validation feedback" need measurable criteria (breakpoint, minimum tap target size, the exact error messages, and when they appear) before they can become tests.
4. **Start equal to now.** AC1 says "after the supplied current time." The code rejects `start == now` (T02 depends on this). Please confirm that is intended and not "at or after."
5. **Non-integer and out-of-range inputs.** The code does not reject fractional minutes (for example 600.5). It also does not reject `now` outside 0–1440, or malformed existing bookings such as `start > end`. None of these are in the table or the ACs. Should they be specified?
6. **Overlap scope.** The code checks only the `bookings` array passed in. I assumed that array holds bookings for the selected room only. Please confirm.
7. **Time source.** `canBook` takes `now` as a parameter and does not read the clock, so no fake timers are needed. The tests use a fixed `now = 540`. If the page computes `now` from the real clock, that wiring is untested here.
8. **Fixture freshness.** `makeInput` builds new objects on each call. The AC5 test uses `structuredClone` to check that the data is unchanged. If you want stricter checks, we could deep-freeze the fixture so any mutation throws.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | The `it.each` block with all 16 cases (T01–T14, X1, X2) | Table-driven, so there is no test with its own ID in the title; a failure is hard to attribute to one case. Not an exact kind from the deck's table, my own weakness: cases are not individually named. | revise | The final suite needs one test per ID with the ID in the title (AC1–AC4 cases) |
| 2 | The expected values of the 16 cases | The assistant says it checked them against the code (risk: expected = current output). I compared each one with my plan: T06 true (120 minutes, AC2), T02 false (start = now, AC1), T08 and T01 true (touching, AC4). They all match. | accept | AC1, AC2, AC4: the values come from the ACs and my §3 plan, not from the code |
| 3 | The AC5 test "returns true for an available request..." | The title has no `AC5` ID. The data check itself is good (`structuredClone` copy compared after the call). | revise | AC5: rename the test so the ID is in the title |
| 4 | The AC mapping claiming "T01 and T09 data checks" for AC5 | Not true: those tests only assert the decision, they do not compare the bookings. Only the AC5 tests check the data. | reject | AC5: the claim does not match the file |
| 5 | The import `../src/booking` and the run command `tests/booking.test.ts` | The import only works by the file's location; the command points to a folder I don't have. The real function is imported (no mock), which is correct. | revise | Real function used by the page (no mock); final suite imports `./booking` beside the module |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
(paste here)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
(paste here)
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
(paste here)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected / Survived | | |
| M2 | Treat touching endpoints as an overlap | Detected / Survived | | |
| M3 | Remove the blocked-room rejection | Detected / Survived | | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
(paste here)
```

All three changes reverted, and the full suite run again (section 6.3): yes / no

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | | Pass / Fail / Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | | Pass / Fail / Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | | Pass / Fail / Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | | Pass / Fail / Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | | Pass / Fail / Not testable |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
