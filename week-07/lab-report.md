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
| Vitest version (the `RUN  v…` line of a run) | 3.2.7 |
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
| 1 | The `it.each` block with all 16 cases (T01–T14, X1, X2) | Table-driven: no test has its own ID in the title, so a failure is hard to attribute to one case. This is my own weakness type, not one from the deck's table. | revise | The final suite needs one test per ID with the ID in the title (AC1–AC4 cases) |
| 2 | The expected values of the 16 cases | The assistant said it checked them against the code (risk: expected = current output). I compared each with my §3 plan: T02 false (start = now, AC1), T06 true (exactly 120 minutes, AC2), T01 and T08 true (touching endpoints, AC4). All match. | accept | AC1, AC2, AC4: the values come from the ACs, not from the code |
| 3 | The AC5 test "returns true for an available request..." | The title has no `AC5` ID. The data check itself (`structuredClone` copy compared after the call) is good. | revise | AC5: rename so the ID is in the title |
| 4 | `expect(input.bookings[0]).toBe(bookings[0])` in the AC5 test | Tautological: `input.bookings` is the same array as `bookings`, so it always passes and detects nothing (same weakness as "no exception occurred": a wrong function would still pass). | reject | AC5: only the comparison with the copy taken before the call proves the data is unchanged |
| 5 | The AC mapping that claims "T01 and T09 data checks" for AC5 | Not true: T01 and T09 only assert the decision, they never compare the bookings. | reject | AC5: the claim does not match the file |
| 6 | Import `../src/booking` and run command `tests/booking.test.ts` | The import works only because of the file's location, and the command points to a folder my project does not have. The real function is imported with no mock, which is correct. | revise | Real function used by the page; the final suite imports `./booking` beside the module |
| 7 | Improvement review: `deepFreeze`, factory overrides and `Parameters<typeof canBook>` typing | Extra complexity. The `structuredClone` comparison already proves AC5, and a plain helper function gives fresh data per test. | reject | AC5; simpler tests are easier to review |
| 8 | Improvement review: extra cases NaN (B07) and negative `now` (B01, B02) | No AC mentions NaN. A negative current time is not a valid campus time, so the test would assert behaviour nobody specified. | reject | No AC decides them; they would copy the code's behaviour (expected = current output) |
| 9 | Improvement review: extra boundaries (two bookings, gap between them, one-minute overlap, blocked with no bookings) | The first suite had only one booking, so a bug that checks only the first booking, or an off-by-one overlap, would pass. | accept | AC4 (overlap, touching allowed) and AC3 (blocked rule works on its own) |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
E:\Github\se-practice\week-07\app>npx vitest run

 RUN  v3.2.7 E:/Github/se-practice/week-07/app

 ✓ src/booking.test.ts (18 tests) 7ms
   ✓ canBook: case table (AC1-AC4) > T01 (660-720) returns {} [true] 2ms
   ✓ canBook: case table (AC1-AC4) > T02 (540-570) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T03 (720-720) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T04 (750-720) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T05 (1380-1441) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T06 (720-840) returns {} [true] 0ms
   ✓ canBook: case table (AC1-AC4) > T07 (720-841) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T08 (570-600) returns {} [true] 0ms
   ✓ canBook: case table (AC1-AC4) > T09 (630-690) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T10 (570-690) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T11 (615-645) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T12 (600-660) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T13 (660-720) returns { blocked: true } [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T14 (630-690) returns { bookings: [] } [true] 0ms
   ✓ canBook: case table (AC1-AC4) > X1 (541-600) returns {} [true] 0ms
   ✓ canBook: case table (AC1-AC4) > X2 (1320-1440) returns {} [true] 0ms
   ✓ canBook: AC5 - decision does not change booking data > returns true for an available request and leaves bookings byte-for-byte equal 2ms
   ✓ canBook: AC5 - decision does not change booking data > leaves bookings unchanged for an unavailable request too 0ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  14:56:44
   Duration  2.64s (transform 282ms, setup 0ms, collect 73ms, tests 7ms, environment 0ms, prepare 2.30s)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | none |  none | none | none |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

E:\Github\se-practice\week-07\app>npx vitest run

 RUN  v3.2.7 E:/Github/se-practice/week-07/app

 ✓ src/booking.test.ts (18 tests) 7ms
   ✓ canBook: case table (AC1-AC4) > T01 (660-720) returns {} [true] 2ms
   ✓ canBook: case table (AC1-AC4) > T02 (540-570) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T03 (720-720) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T04 (750-720) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T05 (1380-1441) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T06 (720-840) returns {} [true] 0ms
   ✓ canBook: case table (AC1-AC4) > T07 (720-841) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T08 (570-600) returns {} [true] 0ms
   ✓ canBook: case table (AC1-AC4) > T09 (630-690) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T10 (570-690) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T11 (615-645) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T12 (600-660) returns {} [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T13 (660-720) returns { blocked: true } [false] 0ms
   ✓ canBook: case table (AC1-AC4) > T14 (630-690) returns { bookings: [] } [true] 0ms
   ✓ canBook: case table (AC1-AC4) > X1 (541-600) returns {} [true] 0ms
   ✓ canBook: case table (AC1-AC4) > X2 (1320-1440) returns {} [true] 0ms
   ✓ canBook: AC5 - decision does not change booking data > returns true for an available request and leaves bookings byte-for-byte equal 2ms
   ✓ canBook: AC5 - decision does not change booking data > leaves bookings unchanged for an unavailable request too 0ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  14:56:44
   Duration  2.64s (transform 282ms, setup 0ms, collect 73ms, tests 7ms, environment 0ms, prepare 2.30s)

The test suite:


import { describe, it, expect } from "vitest";
import { canBook } from "../src/booking";

type Booking = { start: number; end: number };

// Fresh fixture for every call. No shared mutable state between tests.
function makeInput(
  overrides: Partial<{
    start: number;
    end: number;
    now: number;
    blocked: boolean;
    bookings: Booking[];
  }> = {}
) {
  return {
    start: 0,
    end: 0,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...overrides,
  };
}

describe("canBook: case table (AC1-AC4)", () => {
  // [id, start, end, overrides, expected, ac]
  const cases: Array<[string, number, number, Record<string, unknown>, boolean, string]> = [
    ["T01", 660, 720, {}, true, "AC4"],
    ["T02", 540, 570, {}, false, "AC1"],
    ["T03", 720, 720, {}, false, "AC1"],
    ["T04", 750, 720, {}, false, "AC1"],
    ["T05", 1380, 1441, {}, false, "AC1"],
    ["T06", 720, 840, {}, true, "AC2"],
    ["T07", 720, 841, {}, false, "AC2"],
    ["T08", 570, 600, {}, true, "AC4"],
    ["T09", 630, 690, {}, false, "AC4"],
    ["T10", 570, 690, {}, false, "AC4"],
    ["T11", 615, 645, {}, false, "AC4"],
    ["T12", 600, 660, {}, false, "AC4"],
    ["T13", 660, 720, { blocked: true }, false, "AC3"],
    ["T14", 630, 690, { bookings: [] }, true, "AC4"],
    ["X1", 541, 600, {}, true, "AC1"],
    ["X2", 1320, 1440, {}, true, "AC1"],
  ];

  it.each(cases)("%s (%i-%i) returns %s [%s]", (_id, start, end, overrides, expected) => {
    const input = makeInput({ start, end, ...overrides });
    const result = canBook(input);
    expect(result).toBe(expected);
  });
});

describe("canBook: AC5 - decision does not change booking data", () => {
  it("returns true for an available request and leaves bookings byte-for-byte equal", () => {
    const bookings: Booking[] = [
      { start: 600, end: 660 },
      { start: 780, end: 840 },
    ];
    const before = structuredClone(bookings);
    const input = makeInput({ start: 660, end: 720, bookings });

    const result = canBook(input);

    expect(result).toBe(true);
    expect(input.bookings).toEqual(before);
    expect(input.bookings).toHaveLength(before.length);
    expect(input.bookings[0]).toBe(bookings[0]); // same object, not replaced
  });

  it("leaves bookings unchanged for an unavailable request too", () => {
    const bookings: Booking[] = [{ start: 600, end: 660 }];
    const before = structuredClone(bookings);
    const input = makeInput({ start: 630, end: 690, bookings });

    expect(canBook(input)).toBe(false);
    expect(input.bookings).toEqual(before);
  });
}); 


Our case table:
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



## Review findings

The run output shows all 18 tests passing, so no failures point to implementation bugs. I checked every expected value against AC1–AC4 and the case table, and all 16 rows are correct. The problems are in test quality and coverage.

**Test repairs**

1. **Wrong import path and file location.** The output shows the file is `src/booking.test.ts`, but it imports `"../src/booking"`. That resolves to the same module only by accident. Changing the file or folder would break it. Use `"./booking"`. My earlier advice to use `tests/` did not match your layout.
2. **Unreadable test names.** `%s` prints the override object, so names read `returns {}` and `returns { blocked: true }`. The AC reference is also dropped from the name. Use object rows with `$id`, `$ac`, `$start`, `$end` interpolation so each name shows what is being checked.
3. **Shared fixtures in the case table.** The `bookings: []` and `{ blocked: true }` overrides are created once at module load. That conflicts with "fresh fixtures for every test." Overrides are now factory functions that build new objects per run.
4. **Tautological AC5 assertion.** `expect(input.bookings[0]).toBe(bookings[0])` always passes, because `input.bookings` is the same array as `bookings`. It tests nothing about the function. I also overstated the earlier claim: `toEqual` is structural, not "byte-for-byte."
5. **Weak AC5 check.** A structural compare after the call can miss in-place mutations that cancel out, and it does not stop them. Deep-freezing the bookings means any mutation throws in strict ES module code, so the test fails on the mutation itself.
6. **Loose typing.** `Record<string, unknown>` overrides are not checked against the function's input type. Use `Partial<Input>` derived from `Parameters<typeof canBook>[0]`, so a type error surfaces under `tsc`.
7. **Unused `ac` column.** The sixth tuple element was never used. It now appears in the test name and mapping.

**Coverage gaps (new boundary tests, none of which fail on the current code)**

- **AC1 lower bound (start = 0).** Only the upper bound (end = 1440) was tested. Without a test for start = 0, a bug such as `start > 0` would not be caught. `now` is set to -1 so this case is not rejected by the "after now" rule.
- **AC1 negative start.** `start = -1` checks that the `start < 0` branch is reached and not masked by the `now` check.
- **AC4 multiple bookings.** Only one booking existed. A bug that checked only `bookings[0]` would go unnoticed. Added a candidate that overlaps only the second booking.
- **AC4 gap between bookings.** A candidate that fits exactly between two bookings, touching both, checks that touching is allowed on both sides.
- **AC4 one-minute overlap.** 659–661 overlaps by one minute at the end. This catches off-by-one errors that T09–T12 might miss.
- **AC3 independence.** Blocked with no bookings checks that the blocked rule works on its own and is not depending on the overlap check.
- **NaN input.** The code has a NaN guard that no test covered. This is marked as defensive, since it is not in the ACs.

**Not changed**

- **Incorrect expectations:** none found. Every expected value matches AC1–AC4.
- **Duplicates:** T08/X1 and T11/T12 test different sides or edges, so they are not true duplicates and were kept.
- **AC5 UI labels and AC6:** still not testable through `canBook`. They need component or end-to-end tests. The file below does not claim to cover them.

## Implementation fixes

None. No test fails, and the new boundary cases (start = 0, negative start, NaN, multiple bookings, gap, one-minute overlap, blocked without bookings) all match the current `canBook` logic when traced by hand. Do not change `src/booking.ts` for these tests.

## Test file: `src/booking.test.ts`

import { describe, it, expect } from "vitest";
import { canBook } from "./booking";

type Input = Parameters<typeof canBook>[0];

// Fresh input for every call. Overrides are merged, never shared.
function makeInput(overrides: Partial<Input> = {}): Input {
  return {
    start: 0,
    end: 0,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...overrides,
  };
}

// Deep-freeze so any in-place mutation throws (ES modules run in strict mode).
function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object") {
    for (const v of Object.values(value as object)) deepFreeze(v);
    Object.freeze(value);
  }
  return value;
}

type Row = {
  id: string;
  ac: string;
  start: number;
  end: number;
  // Factory, so every run gets fresh objects.
  overrides?: () => Partial<Input>;
  expected: boolean;
};

const rows: Row[] = [
  // Case table
  { id: "T01", ac: "AC4", start: 660, end: 720, expected: true },
  { id: "T02", ac: "AC1", start: 540, end: 570, expected: false },
  { id: "T03", ac: "AC1", start: 720, end: 720, expected: false },
  { id: "T04", ac: "AC1", start: 750, end: 720, expected: false },
  { id: "T05", ac: "AC1", start: 1380, end: 1441, expected: false },
  { id: "T06", ac: "AC2", start: 720, end: 840, expected: true },
  { id: "T07", ac: "AC2", start: 720, end: 841, expected: false },
  { id: "T08", ac: "AC4", start: 570, end: 600, expected: true },
  { id: "T09", ac: "AC4", start: 630, end: 690, expected: false },
  { id: "T10", ac: "AC4", start: 570, end: 690, expected: false },
  { id: "T11", ac: "AC4", start: 615, end: 645, expected: false },
  { id: "T12", ac: "AC4", start: 600, end: 660, expected: false },
  { id: "T13", ac: "AC3", start: 660, end: 720, overrides: () => ({ blocked: true }), expected: false },
  { id: "T14", ac: "AC4", start: 630, end: 690, overrides: () => ({ bookings: [] }), expected: true },
  { id: "X1", ac: "AC1", start: 541, end: 600, expected: true },
  { id: "X2", ac: "AC1", start: 1320, end: 1440, expected: true },

  // Added boundary cases
  { id: "B01", ac: "AC1", start: 0, end: 60, overrides: () => ({ now: -1 }), expected: true },
  { id: "B02", ac: "AC1", start: -1, end: 60, overrides: () => ({ now: -2 }), expected: false },
  {
    id: "B03", ac: "AC4", start: 740, end: 800,
    overrides: () => ({ bookings: [{ start: 600, end: 660 }, { start: 700, end: 760 }] }),
    expected: false,
  },
  {
    id: "B04", ac: "AC4", start: 660, end: 700,
    overrides: () => ({ bookings: [{ start: 600, end: 660 }, { start: 700, end: 760 }] }),
    expected: true,
  },
  { id: "B05", ac: "AC4", start: 659, end: 661, expected: false },
  { id: "B06", ac: "AC3", start: 630, end: 690, overrides: () => ({ blocked: true, bookings: [] }), expected: false },
  { id: "B07", ac: "AC1", start: NaN, end: 600, expected: false },
];

describe("canBook: case table and boundaries (AC1-AC4)", () => {
  it.each(rows)(
    "$id ($ac) $start-$end expected $expected",
    ({ start, end, overrides, expected }) => {
      const input = makeInput({ start, end, ...(overrides?.() ?? {}) });
      expect(canBook(input)).toBe(expected);
    }
  );
});

describe("canBook: AC5 - decision does not change booking data", () => {
  it("returns a boolean true for an available request and leaves frozen bookings unchanged", () => {
    const bookings = deepFreeze([
      { start: 600, end: 660 },
      { start: 780, end: 840 },
    ]);
    const snapshot = JSON.parse(JSON.stringify(bookings));

    const result = canBook(makeInput({ start: 660, end: 720, bookings }));

    expect(typeof result).toBe("boolean");
    expect(result).toBe(true);
    expect(bookings).toEqual(snapshot);
  });

  it("returns a boolean false for an unavailable request and leaves frozen bookings unchanged", () => {
    const bookings = deepFreeze([{ start: 600, end: 660 }]);
    const snapshot = JSON.parse(JSON.stringify(bookings));

    const result = canBook(makeInput({ start: 630, end: 690, bookings }));

    expect(typeof result).toBe("boolean");
    expect(result).toBe(false);
    expect(bookings).toEqual(snapshot);
  });
});

## Run command

npx vitest run src/booking.test.ts

Or `npx vitest run` for the whole project.

## AC mapping

| AC | Covered by | Notes |
| --- | --- | --- |
| AC1 (bounds, start after now) | T02, T03, T04, T05, X1, X2, B01, B02, B07 | Lower bound (start = 0), negative start, and NaN are now covered. |
| AC2 (max 120 minutes) | T06, T07 | Covered. |
| AC3 (blocked room) | T13, B06 | B06 confirms the blocked rule works without any overlap. |
| AC4 (overlap, touching allowed) | T01, T08–T12, T14, B03, B04, B05 | Covers multiple bookings, gaps between bookings, and a one-minute overlap. |
| AC5 (decision, data unchanged) | AC5 block (two tests) | Frozen data makes mutation throw. The visible Available/Unavailable label is UI and is **not** covered. |
| AC6 (desktop/mobile, validation feedback) | None | Needs component tests (for example Testing Library) or end-to-end tests (for example Playwright at ~1280px and ~375px). |

## Open questions

1. **Negative `now` in B01 and B02.** These use `now = -1` and `-2` to isolate the lower bound. Confirm that a negative current time is valid input in your domain. If not, the lower-bound test should use another method of isolating the boundary.
2. **NaN behavior (B07).** The code returns false for NaN, but no AC mentions it. Confirm whether this should be a requirement or just defensive behavior.
3. **AC5 visual label and AC6.** Still unspecified (see the earlier list). These cannot be tested until they are defined.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
E:\Github\se-practice\week-07\app>npx vitest run

 RUN  v3.2.7 E:/Github/se-practice/week-07/app

 ✓ src/booking.test.ts (22 tests) 6ms
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

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  15:28:59
   Duration  899ms (transform 53ms, setup 0ms, collect 58ms, tests 6ms, environment 0ms, prepare 570ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06, X2 | Not applicable, it was detected. Both failing tests use exactly 120 minutes (720-840 and 1320-1440), so AC2's "exactly 120 is allowed" boundary is protected. |
| M2 | Treat touching endpoints as an overlap | Detected | X1, T01, T08, B02, AC5 | Not applicable, it was detected. Five tests failed because all of them use touching endpoints; AC5 fails too because its Available request 660-720 touches the booking 600-660. |
| M3 | Remove the blocked-room rejection | Detected | T13, B04 | Not applicable, it was detected. B04 shows the blocked rule is tested on its own, with no bookings to cause the rejection. |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
M1 (>= 120 instead of > 120)
 FAIL  src/booking.test.ts > AC1: interval bounds and start after now > X2 AC1: ends exactly at the end of the day (1320-1440) is accepted
 FAIL  src/booking.test.ts > AC2: maximum 120 minutes > T06 AC2: exactly 120 minutes (720-840) is accepted
 Test Files  1 failed (1)
      Tests  2 failed | 20 passed (22)

M2 (touching endpoints treated as overlap)
 FAIL  src/booking.test.ts > AC1: interval bounds and start after now > X1 AC1: first minute after now, touching the booking (541-600) is accepted
 FAIL  src/booking.test.ts > AC4: overlap, touching allowed > T01 AC4: touching after the booking (660-720) is accepted
 FAIL  src/booking.test.ts > AC4: overlap, touching allowed > T08 AC4: touching before the booking (570-600) is accepted
 FAIL  src/booking.test.ts > AC4: overlap, touching allowed > B02 AC4: fits exactly between two bookings, touching both (660-700) is accepted
 FAIL  src/booking.test.ts > AC5: the decision does not change the booking data > AC5: an Available request leaves the bookings unchanged
 Test Files  1 failed (1)
      Tests  5 failed | 17 passed (22)

M3 (blocked-room rejection removed)
 FAIL  src/booking.test.ts > AC3: blocked room > T13 AC3: blocked room (660-720) is rejected
 FAIL  src/booking.test.ts > AC3: blocked room > B04 AC3: blocked room with no bookings (630-690) is rejected
 Test Files  1 failed (1)
      Tests  2 failed | 20 passed (22)
```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | With "Campus now" 09:00 and a room that has the 10:00–11:00 booking, I entered 11:00–12:00. A green card showed "Available" with the message that the room is free from 11:00 to 12:00. The schedule showed the grey 10:00–11:00 booking. | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | The page has no control to block a room. Blocked rooms show a "Blocked" badge and their card is disabled, so I could not select one and check it. Because of this I could not make an Available result switch to Unavailable through a blocked room. The blocked rule is covered by the unit tests T13 and B04. | Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | The page has no submit button; it checks while I type. When I cleared the start or end time, the result disappeared and a grey hint appeared: "Pick a room and enter a start and end time to see availability." With a room not selected, a red card said "Select a room to check." Invalid requests also showed a red card with the reasons. | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At about 375 px in portrait, the room cards, the two time fields and the green/red verdict card stayed readable and usable, with no sideways scrolling. | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | I repeated the check several times, including an Available and an Unavailable one. The "N booked" count on the room card and the grey booking blocks in the schedule stayed the same each time. | Pass |

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
| Executed / passed / failed | 18 / 18 / 0 | 22 / 22 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC5 with exact decisions; gaps: only one existing booking (a bug checking only the first booking would pass), AC5 had a tautological assertion, AC6 not covered | AC1–AC5 with one named test per ID and extra boundaries (two bookings, gap between them, one-minute overlap, blocked with no bookings); gap: AC6 and the visible Available/Unavailable label are only checked by hand (§8) |
| Selected mutants detected | Not run against the first suite; by reading it, T06 would catch M1, T01 and T08 would catch M2, and T13 would catch M3 | 3 of 3 (M1: T06, X2; M2: X1, T01, T08, B02, AC5; M3: T13, B04) |
| Accepted / revised / rejected tests | 2 accepted / 3 revised / 4 rejected (the 9 decisions in §5) | Not applicable: the improved suite is the result of those decisions |
| Remaining limitations | Table-driven `it.each` with no ID in the names; false AC mapping; wrong import path | Only three mutants tried; NaN and fractional minutes not tested because no AC decides them; invalid existing bookings unspecified (§9.3); UI checked by hand only |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

---
- With `bookings = [{ start: 700, end: 650 }]` and a request of 660–720, my `canBook` returns `true` (Available). The overlap test is `start < b.end && b.start < end`, which becomes `660 < 650`, and that is false, so the reversed booking never counts as an overlap. No AC says what should happen: AC4 talks about overlapping an existing booking, but a booking with start after end is not a valid interval, so the ACs give no answer. I declare `true` as my assumption and I did not change the code, because the behaviour is unspecified rather than wrong.
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
(a) The first suite had correct expectations, so its real weakness was missing coverage. It tested only one existing booking, so a canBook that checked only bookings[0] would still pass. Its AC5 test also held a tautological assertion comparing an array with itself. I found both by reading the file before running it, and I added B01 (overlaps only the second of two bookings) and B02 (fits between two bookings). (b) The final green run of 22 tests proves that these inputs give the decisions my AC-based plan predicts. The mutants show it is sensitive: M1 failed T06 and X2, M2 failed five tests, M3 failed T13 and B04. It does not prove the page is correct. U2 was not testable, since the page cannot block a room, and no unit test sees layout. It also says nothing about invalid existing bookings, where my canBook returns true. (c) A limitation that remains: I tried only three mutants, so other defects, such as mishandling fractional minutes, may still survive.