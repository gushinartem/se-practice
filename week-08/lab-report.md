# Week 08 — Lab report

**Name:** Guchshin Artem
**Group:** Monday16-19
**Date:** 2026-11-07

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Claude (claude.ai web) | 
| Exact model (with its version, or `not displayed`) | Claude Haiku 5.5 (effort: low), as displayed in the interface | 
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | Claude web | 
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer (Windows terminal) | 
| Vitest version (the `RUN  v…` line of a run) | v3.2.7 | 
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
D:\se-practice\week-08\app>npx vitest run

 RUN  v3.2.7 D:/se-practice/week-08/app

 ✓ src/booking.test.ts (22 tests) 4ms
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
   Start at  21:30:32
   Duration  364ms (transform 37ms, setup 0ms, collect 42ms, tests 4ms, environment 0ms, prepare 93ms)
```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text
D:\se-practice\week-08\app>npx vitest run

 RUN  v3.2.7 D:/se-practice/week-08/app

 ❯ src/booking.test.ts (22 tests | 5 failed) 10ms
   ✓ AC1: interval bounds and start after now > T02 AC1: starts now (540-570) is rejected 1ms
   ✓ AC1: interval bounds and start after now > T03 AC1: zero duration (720-720) is rejected 0ms
   ✓ AC1: interval bounds and start after now > T04 AC1: reversed interval (750-720) is rejected 0ms
   ✓ AC1: interval bounds and start after now > T05 AC1: past the end of the day (1380-1441) is rejected 0ms
   × AC1: interval bounds and start after now > X1 AC1: first minute after now, touching the booking (541-600) is accepted 6ms
     → expected false to be true // Object.is equality
   ✓ AC1: interval bounds and start after now > X2 AC1: ends exactly at the end of the day (1320-1440) is accepted 0ms
   ✓ AC2: maximum 120 minutes > T06 AC2: exactly 120 minutes (720-840) is accepted 0ms
   ✓ AC2: maximum 120 minutes > T07 AC2: 121 minutes (720-841) is rejected 0ms
   ✓ AC3: blocked room > T13 AC3: blocked room (660-720) is rejected 0ms
   ✓ AC3: blocked room > B04 AC3: blocked room with no bookings (630-690) is rejected 0ms
   × AC4: overlap, touching allowed > T01 AC4: touching after the booking (660-720) is accepted 0ms
     → expected false to be true // Object.is equality
   × AC4: overlap, touching allowed > T08 AC4: touching before the booking (570-600) is accepted 0ms
     → expected false to be true // Object.is equality
   ✓ AC4: overlap, touching allowed > T09 AC4: partial overlap (630-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T10 AC4: interval contains the booking (570-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T11 AC4: interval inside the booking (615-645) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T12 AC4: identical interval (600-660) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T14 AC4: no bookings (630-690) is accepted 0ms
   ✓ AC4: overlap, touching allowed > B01 AC4: overlaps only the second of two bookings (740-800) is rejected 0ms
   × AC4: overlap, touching allowed > B02 AC4: fits exactly between two bookings, touching both (660-700) is accepted 0ms
     → expected false to be true // Object.is equality
   ✓ AC4: overlap, touching allowed > B03 AC4: overlaps the booking by one minute (659-661) is rejected 0ms
   × AC5: the decision does not change the booking data > AC5: an Available request leaves the bookings unchanged 0ms
     → expected false to be true // Object.is equality
   ✓ AC5: the decision does not change the booking data > B05 AC5: an Unavailable request also leaves the bookings unchanged 0ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 5 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > AC1: interval bounds and start after now > X1 AC1: first minute after now, touching the booking (541-600) is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:43:27
     41|
     42|   test("X1 AC1: first minute after now, touching the booking (541-600) is accepted", () => {
     43|     expect(run(541, 600)).toBe(true);
       |                           ^
     44|   });
     45|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯

 FAIL  src/booking.test.ts > AC4: overlap, touching allowed > T01 AC4: touching after the booking (660-720) is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:73:27
     71| describe("AC4: overlap, touching allowed", () => {
     72|   test("T01 AC4: touching after the booking (660-720) is accepted", () => {
     73|     expect(run(660, 720)).toBe(true);
       |                           ^
     74|   });
     75|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯

 FAIL  src/booking.test.ts > AC4: overlap, touching allowed > T08 AC4: touching before the booking (570-600) is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:77:27
     75|
     76|   test("T08 AC4: touching before the booking (570-600) is accepted", () => {
     77|     expect(run(570, 600)).toBe(true);
       |                           ^
     78|   });
     79|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯

 FAIL  src/booking.test.ts > AC4: overlap, touching allowed > B02 AC4: fits exactly between two bookings, touching both (660-700) is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:113:41
    111|       { start: 700, end: 760 },
    112|     ];
    113|     expect(run(660, 700, { bookings })).toBe(true);
       |                                         ^
    114|   });
    115|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯

 FAIL  src/booking.test.ts > AC5: the decision does not change the booking data > AC5: an Available request leaves the bookings unchanged
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:137:20
    135|     });
    136|
    137|     expect(result).toBe(true);
       |                    ^
    138|     expect(bookings).toEqual(before);
    139|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯


 Test Files  1 failed (1)
      Tests  5 failed | 17 passed (22)
   Start at  21:40:16
   Duration  371ms (transform 34ms, setup 0ms, collect 42ms, tests 10ms, environment 0ms, prepare 108ms)

```

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
D:\se-practice\week-08\app>npx vitest run
 ❯ src/booking.test.ts (24 tests | 7 failed) 13ms
   ✓ AC1: interval bounds and start after now > T02 AC1: starts now (540-570) is rejected 1ms
   ✓ AC1: interval bounds and start after now > T03 AC1: zero duration (720-720) is rejected 0ms
   ✓ AC1: interval bounds and start after now > T04 AC1: reversed interval (750-720) is rejected 0ms
   ✓ AC1: interval bounds and start after now > T05 AC1: past the end of the day (1380-1441) is rejected 0ms
   × AC1: interval bounds and start after now > X1 AC1: first minute after now, touching the booking (541-600) is accepted 7ms
     → expected false to be true // Object.is equality
   ✓ AC1: interval bounds and start after now > X2 AC1: ends exactly at the end of the day (1320-1440) is accepted 0ms
   ✓ AC2: maximum 120 minutes > T06 AC2: exactly 120 minutes (720-840) is accepted 0ms
   ✓ AC2: maximum 120 minutes > T07 AC2: 121 minutes (720-841) is rejected 0ms
   ✓ AC3: blocked room > T13 AC3: blocked room (660-720) is rejected 0ms
   ✓ AC3: blocked room > B04 AC3: blocked room with no bookings (630-690) is rejected 0ms
   × AC4: overlap, touching allowed > T01 AC4: touching after the booking (660-720) is accepted 0ms
     → expected false to be true // Object.is equality
   × AC4: overlap, touching allowed > T08 AC4: touching before the booking (570-600) is accepted 0ms
     → expected false to be true // Object.is equality
   ✓ AC4: overlap, touching allowed > T09 AC4: partial overlap (630-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T10 AC4: interval contains the booking (570-690) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T11 AC4: interval inside the booking (615-645) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T12 AC4: identical interval (600-660) is rejected 0ms
   ✓ AC4: overlap, touching allowed > T14 AC4: no bookings (630-690) is accepted 0ms
   ✓ AC4: overlap, touching allowed > B01 AC4: overlaps only the second of two bookings (740-800) is rejected 0ms
   × AC4: overlap, touching allowed > B02 AC4: fits exactly between two bookings, touching both (660-700) is accepted 0ms
     → expected false to be true // Object.is equality
   ✓ AC4: overlap, touching allowed > B03 AC4: overlaps the booking by one minute (659-661) is rejected 0ms
   × AC5: the decision does not change the booking data > AC5: an Available request leaves the bookings unchanged 0ms
     → expected false to be true // Object.is equality
   ✓ AC5: the decision does not change the booking data > B05 AC5: an Unavailable request also leaves the bookings unchanged 0ms
   × BUG regression tests (Week 08) > BUG-A AC4: a request touching bookings on both sides (660-720) is Available 0ms
     → expected false to be true // Object.is equality
   × BUG regression tests (Week 08) > BUG-B AC5: an Available request that touches nothing (720-780) leaves bookings unchanged 2ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 7 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > AC1: interval bounds and start after now > X1 AC1: first minute after now, touching the booking (541-600) is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:43:27
     41|
     42|   test("X1 AC1: first minute after now, touching the booking (541-600) is accepted", () => {
     43|     expect(run(541, 600)).toBe(true);
       |                           ^
     44|   });
     45|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯

 FAIL  src/booking.test.ts > AC4: overlap, touching allowed > T01 AC4: touching after the booking (660-720) is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:73:27
     71| describe("AC4: overlap, touching allowed", () => {
     72|   test("T01 AC4: touching after the booking (660-720) is accepted", () => {
     73|     expect(run(660, 720)).toBe(true);
       |                           ^
     74|   });
     75|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯

 FAIL  src/booking.test.ts > AC4: overlap, touching allowed > T08 AC4: touching before the booking (570-600) is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:77:27
     75|
     76|   test("T08 AC4: touching before the booking (570-600) is accepted", () => {
     77|     expect(run(570, 600)).toBe(true);
       |                           ^
     78|   });
     79|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯

 FAIL  src/booking.test.ts > AC4: overlap, touching allowed > B02 AC4: fits exactly between two bookings, touching both (660-700) is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:113:41
    111|       { start: 700, end: 760 },
    112|     ];
    113|     expect(run(660, 700, { bookings })).toBe(true);
       |                                         ^
    114|   });
    115|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯

 FAIL  src/booking.test.ts > AC5: the decision does not change the booking data > AC5: an Available request leaves the bookings unchanged
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:137:20
    135|     });
    136|
    137|     expect(result).toBe(true);
       |                    ^
    138|     expect(bookings).toEqual(before);
    139|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯

 FAIL  src/booking.test.ts > BUG regression tests (Week 08) > BUG-A AC4: a request touching bookings on both sides (660-720) is Available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:167:20
    165|     ];
    166|     const result = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });
    167|     expect(result).toBe(true);
       |                    ^
    168|   });
    169|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯

 FAIL  src/booking.test.ts > BUG regression tests (Week 08) > BUG-B AC5: an Available request that touches nothing (720-780) leaves bookings unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:175:22
    173|     const result = canBook({ start: 720, end: 780, now: 540, blocked: false, bookings });
    174|     expect(result).toBe(true);
    175|     expect(bookings).toEqual(before);
       |                      ^
    176|   });
    177| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/7]⎯


 Test Files  1 failed (1)
      Tests  7 failed | 17 passed (24)
   Start at  21:43:31
   Duration  842ms (transform 33ms, setup 0ms, collect 38ms, tests 13ms, environment 0ms, prepare 102ms)

```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) | 
| ----- | ----- | ----- | ----- | ----- | ----- | 
| BUG-A | BUG-A (also failing for the same reason: T01, T08, X1, B02, Week 07 AC5) | `canBook({ start: 660, end: 720, now: 540, blocked: false, bookings: [{600,660},{720,780}] })`: touches a booking on both sides | `true` (Available, AC4: touching endpoints is allowed) | `false`, `expected false to be true` | `booking.ts` line 13, `if (start <= b.end && end >= b.start) return false;` inside the `for` loop. The comparisons are non-strict (`<=`, `>=`), so `start === b.end` or `end === b.start` counts as an overlap. Touching bookings are rejected. It should use strict `<` and `>`. | 
| BUG-B | BUG-B | `canBook({ start: 720, end: 780, now: 540, blocked: false, bookings: [{600,660}] })`: Available and touches nothing | `true`, and `bookings` still equal to `[{600,660}]` (AC5: the decision must not change booking data) | returns `true`, but `bookings` became `[{600,660},{720,780}]` | `booking.ts` line 16, `bookings.push({ start, end });`. After finding the slot free, the function appends it to the caller's array, so the availability check mutates its input. The line should be removed. |

**Why five Week 07 tests failed, and why a sixth and seventh were needed.** X1 (541-600), T01 (660-720), T08 (570-600), B02 (660-700) and the Week 07 AC5 test (660-720) all request an interval that touches a booking at an endpoint, so all five fail because of BUG-A. The Week 07 AC5 test is titled as a mutation check, but its request touches the booking 600-660 at minute 660. BUG-A rejects it before the `push` runs, so it fails for the wrong reason and would still fail after a wrong fix; it never exercised BUG-B. The new `BUG-B` test uses 720-780, which touches nothing, so BUG-A cannot hide it: it passes the `.toBe(true)` check and then fails on the `bookings` comparison. The suite went from 5 failures to 7 (24 tests, 17 passing).
---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no | 
| ----- | ----- | 
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes | 
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes | 
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes | 
| I read the whole file once: no passwords, API keys or private student data | yes |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
D:\se-practice\week-08\skills>tar -tf bug-detector.zip
bug-detector/
bug-detector/.gitkeep
bug-detector/SKILL.md
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->
I uploaded `skills/bug-detector.zip` in Claude on the web (claude.ai). After the upload, the skill `bug-detector` is available in a new chat: I can select it from the "+" menu next to the message box, so it was added and can be enabled per chat. I did not need to change any file to make the upload work. Screenshot of the result: `evidence/install.png`.
---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

Acceptance criteria (Smart Campus room availability):
AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test output (Vitest):
 FAIL  src/booking.test.ts > AC4: overlap, touching allowed > T01 AC4: touching after the booking (660-720) is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:73:27
     71| describe("AC4: overlap, touching allowed", () => {
     72|   test("T01 AC4: touching after the booking (660-720) is accepted", () => {
     73|     expect(run(660, 720)).toBe(true);
       |                           ^
     74|   });
     75|

Code of canBook as provided:
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
1. Root cause
The overlap check in `canBook` uses non-strict comparisons:

if (start <= b.end && end >= b.start) return false;


These comparisons treat a shared endpoint as an overlap. Assuming the fixture has an existing booking of 600–660 (the test name implies one ends at 660; I haven't seen `run()` or the fixture), the failing call evaluates as:
   * `660 <= 660` is true
   * `720 >= 600` is true
So the function returns `false` for a slot that only touches the existing booking at its end. AC4 requires that case to be allowed. The fix is to use half-open interval semantics, where `[start, end)` and `[b.start, b.end)` overlap only if each starts before the other ends:

if (start < b.end && end > b.start) return false;

The other checks (AC1 bounds and past times, AC2 max duration, AC3 blocked) look correct for this test and are not implicated.
Related defect (AC5)
The last lines of `canBook` call `bookings.push({ start, end })`. This mutates the caller's array on success, which violates AC5 ("return Available/Unavailable without changing booking data"). It isn't what causes this failure, but it can leak state between tests that share a fixture, and it should be fixed in the same change. It's a separate edit, so you can split it out if you want the patch strictly minimal. If the app needs to record the booking, that should happen in the caller after a successful check.
Minimal patch (proposed, not applied)

```diff
-  for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
-  }
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
+  for (const b of bookings) {
+    if (start < b.end && end > b.start) return false;
+  }
   return true;

```

If you keep the push for now, change only the comparison line to fix the failing test.
Regression tests (proposed)

```ts
describe("AC4: overlap, touching allowed", () => {
  const existing = [{ start: 600, end: 660 }];

  test("T01 AC4: touching after the booking (660-720) is accepted", () => {
    expect(canBook({ start: 660, end: 720, now: 0, blocked: false, bookings: [...existing] })).toBe(true);
  });

  test("T02 AC4: touching before the booking (540-600) is accepted", () => {
    expect(canBook({ start: 540, end: 600, now: 0, blocked: false, bookings: [...existing] })).toBe(true);
  });

  test("T03 AC4: real overlap at the start edge (650-700) is rejected", () => {
    expect(canBook({ start: 650, end: 700, now: 0, blocked: false, bookings: [...existing] })).toBe(false);
  });

  test("T04 AC4: booking fully inside an existing one is rejected", () => {
    expect(canBook({ start: 610, end: 640, now: 0, blocked: false, bookings: [...existing] })).toBe(false);
  });
});

describe("AC5: no mutation of booking data", () => {
  test("T05 AC5: a successful check does not change the bookings list", () => {
    const bookings = [{ start: 600, end: 660 }];
    const before = JSON.stringify(bookings);
    canBook({ start: 660, end: 720, now: 0, blocked: false, bookings });
    expect(JSON.stringify(bookings)).toBe(before);
  });
});

```

Notes on the tests:
   * Each test copies the fixture so the tests can't affect one another.
   * T01 is the reported failure. T02 and T03 cover the other side of the boundary, so the fix can't swing too far and start rejecting valid bookings.
   * T05 fails on the current code, since the push mutates the list. It only passes once the push is removed.
   * I used `now: 0` as a placeholder. Adjust it to whatever `run()` passes so the AC1 past-time check isn't hiding anything.
What I'd verify before merging
   1. Confirm the fixture in `run()` has an existing booking ending at 660. If it's different, the reasoning above still holds, but the example values need adjusting.
   2. Run the full `booking.test.ts` suite. If any test relied on the old inclusive behavior, that test was encoding the bug and should be corrected to match AC4.
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

Did the environment show that the skill was invoked? yes / no / not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | | |
| Reproducible test | | |
| Minimal proposed patch | | |
| Unsupported claims | | |
| Clarity of explanation | | |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

-

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
(paste here)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
(paste here)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
-

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
