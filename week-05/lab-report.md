# Week 05 — Lab report

**Name:** Artem Guchsin
**Group:** Monday 16-19
**Date:** 2026-10-11

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | Claude |
| **Exact** model name | Haiku 5.5 low|
| Language and version | Python 3.14.7 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
**Implementation plan**

Run the checks in the order the criteria list them, returning False at the first failure. Because the function must never modify `existing`, it should only read from it.

1. **Validate the time range (AC1):** Return False unless `0 <= start < end <= 1440` and `start > now`.
2. **Check duration (AC2):** Return False if `end - start > 120`.
3. **Check the blocked flag (AC3):** Return False if `blocked` is True.
4. **Check overlaps (AC4):** For each `(s, e)` in `existing`, return False if `start < e and s < end`. This condition treats intervals as half-open, so touching endpoints do not count as overlap.
5. **Return True** if no check failed.

Python 3.14 has no features this logic depends on. A chained comparison covers AC1, and a single loop with `any()` or an explicit loop covers AC4. Clarity matters more than cleverness here.

**Assumptions**

- `now` is in the same day and units as `start` and `end`, so `start > now` is a direct comparison.
- `start` and `end` are integers, as the contract says. The function does not need to handle floats or other types.
- `existing` contains only valid tuples for this room, so the function does not need to re-validate them or check whether they are sorted or overlapping with each other.
- Passing an empty `existing` list is valid and means no conflicts.
- The `blocked` value is a real Boolean, so `if blocked:` is an acceptable test.
- Only the supplied rules apply. The function does not consider opening hours, user identity, or other bookings for other rooms.

**Boundary cases that could expose a wrong implementation**

- `start == now`: must return False, because AC1 requires `start > now` strictly.
- `start == now + 1`: must return True if everything else is valid, which catches off-by-one errors in the other direction.
- `end == start`: must return False, because `start < end` is strict.
- `start == 0` and `end == 1440`: a full-day span is allowed by the range, but it is 1440 minutes and fails AC2.
- `end == 1440` with a short duration, such as `start=1380, end=1440`: valid, which checks that `end` can equal 1440.
- `start = 1440` or `end = 1441`: must return False, to catch missing upper-bound checks.
- Duration exactly 120, such as `start=600, end=720`: must return True. Duration 121 must return False.
- Booking that ends exactly where an existing one starts, and the reverse (new booking starts exactly where an existing one ends): both must return True. This is the main check for the touching-endpoints rule.
- Booking fully inside an existing one, an existing booking fully inside the new one, and identical intervals: all must return False.
- `blocked=True` with otherwise valid times: must return False, and the check should not depend on `existing`.
- Empty `existing`: must return True for a valid request.
- Multiple existing bookings with the new one falling in a gap between them, including a gap of exactly the requested length: must return True.
- Verify that `existing` is unchanged after every call, including calls that return False early.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | No invented or changed rules idenified | Checked implementation steps 1-5 against AC1-AC5. Each step corresponds to an acceptance crtierior or the requirement to return True when all checks pass. | I found no invented rules, do I kept the plan unchaged 
 |

**Boundary cases the assistant suggested that I kept as tests:**

-start == now: must return False, because AC1 requires start > now strictly.
-start == now + 1: must return True if everything else is valid, which catches off-by-one errors in the other direction.
-end == start: must return False, because start < end is strict.
-start == 0 and end == 1440: a full-day span is allowed by the range, but it is 1440 minutes and fails AC2.
-end == 1440 with a short duration, such as start=1380, end=1440: valid, which checks that end can equal 1440.
-start = 1440 or end = 1441: must return False, to catch missing upper-bound checks.
-Duration exactly 120, such as start=600, end=720: must return True. Duration 121 must return False.
-Booking that ends exactly where an existing one starts, and the reverse (new booking starts exactly where an existing one ends): both must return True. This is the main check for the touching-endpoints rule.
-Booking fully inside an existing one, an existing booking fully inside the new one, and identical intervals: all must return False.
-blocked=True with otherwise valid times: must return False, and the check should not depend on existing.
-Empty existing: must return True for a valid request.
-Multiple existing bookings with the new one falling in a gap between them, including a gap of exactly the requested length: must return True.
-Verify that existing is unchanged after every call, including calls that return False early.


---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | 3 | AC1 | yes |
| 2 | 7 | AC2 | yes |
| 3 | 11 | AC3 | yes |
| 4 | 16 | AC4 | yes |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

-

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching_end_is_allowed | (660, 720) | None | True | AC4 | True (PASS) | True (PASS) |
| 2 | test_overlap | (630, 690) | None | False | AC4 | False (PASS) | False (PASS) |
| 3 | test_blocked | (660, 720) | blocked=True | False | AC3 | False (PASS) |False (PASS) |
| 4 | test_exactly_120_minutes | (720, 840) | None | True | AC2 | True (PASS) | True (PASS)|
| 5 | test_more_than_120_minutes | (720, 841) | None | False | AC2 | False (PASS) | False (PASS)|
| 6 | test_starts_now | (540, 570) | None | False | AC1 | False (PASS) | False (PASS) |
| 7 | test_zero_length_booking | (600, 600) | None | False | AC1 | False (PASS) |False (PASS) |
| 8 | test_reverse_order | (720, 660) | None | False | AC1 | False (PASS) |False (PASS) |
| 9 | test_empty_existing | (660, 720) | existing=[] | True | AC4 | True (PASS) | True (PASS|
| 10 | test_existing_with_several_bookings | (660, 720) | existing=[(600, 630), (630, 660), (720, 750)] | True | AC4 | True (PASS) |True (PASS) |
| 11 | test_booking_inside_existing | (610, 620) | None | False | AC4 | False (PASS) | False (PASS) |
| 12 | test_booking_contains_existing | (590, 670) | None | False | AC4 | False (PASS) | False (PASS) |
---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | can_book(541,571,540,False,[(600,660)]) | True | True | - | no fix | nobody |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
I found no defects against the contract or AC1-AC5. The function returns the correct result for every criterion. These are the only points worth noting, and none changes behavior for valid inputs:

if blocked: Concerns the contract line “blocked is a Boolean.” The truthiness test would also treat values like 1 or "yes" as blocked. The contract guarantees a real Boolean, so this is acceptable, but if blocked is True: would make the contract’s assumption fail loudly instead of silently.
for booked_start, booked_end in existing: Concerns the contract line “existing contains valid (start, end) tuples” and the requirement to keep inputs unchanged. The loop only reads existing, so it satisfies that requirement. If a caller passed a one-shot iterator, the loop would consume it, but the contract describes a list of tuples, so this is outside the stated scope.
if not (0 <= start < end <= 1440 and start > now): Concerns AC1. The chained comparison covers the range and the strict start > now check. The contract says now is valid (0-1439), so the function doesn’t need to validate now.
if end - start > 120: Concerns AC2. The inclusive limit is correct: 120 passes and 121 fails. It runs after AC1, so end - start is always positive when it’s evaluated.
return True Concerns AC5 and the contract line “Return True or False.” The function returns only the two Boolean literals, and every failure path returns before reaching it.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept | everythin worked fine| - |
| 2 | | accept | everythin worked fine | - |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | nothing changed| because everyhing worked allright | - |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_blocked (test_booking.BookingTests.test_blocked) ... ok
test_booking_contains_existing (test_booking.BookingTests.test_booking_contains_existing) ... ok
test_booking_inside_existing (test_booking.BookingTests.test_booking_inside_existing) ... ok
test_empty_existing (test_booking.BookingTests.test_empty_existing) ... ok
test_exactly_120_minutes (test_booking.BookingTests.test_exactly_120_minutes) ... ok
test_existing_input_is_unchanged (test_booking.BookingTests.test_existing_input_is_unchanged) ... ok
test_existing_with_several_bookings (test_booking.BookingTests.test_existing_with_several_bookings) ... ok
test_more_than_120_minutes (test_booking.BookingTests.test_more_than_120_minutes) ... ok
test_overlap (test_booking.BookingTests.test_overlap) ... ok
test_overlap_with_second_booking (test_booking.BookingTests.test_overlap_with_second_booking) ... ok
test_reverse_order (test_booking.BookingTests.test_reverse_order) ... ok
test_start_after_the_end (test_booking.BookingTests.test_start_after_the_end) ... ok
test_starts_now (test_booking.BookingTests.test_starts_now) ... ok
test_starts_one_minute_after_now (test_booking.BookingTests.test_starts_one_minute_after_now) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_zero_length_booking (test_booking.BookingTests.test_zero_length_booking) ... ok

----------------------------------------------------------------------
Ran 16 tests in 0.003s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (21 lines)
PASS   S1   your suite has at least 11 tests            16 tests
PASS   S2   your suite is green on your own code        16 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_starts_now
PASS   M2   your tests catch a fault in AC1             caught by test_start_after_the_end
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_booking
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_120_minutes
PASS   M5   your tests catch a fault in AC3             caught by test_blocked
PASS   M6   your tests catch a fault in AC4             caught by test_existing_with_several_bookings, test_touching_end_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_overlap_with_second_booking
PASS   M8   your tests catch a fault in AC4             caught by test_booking_contains_existing
PASS   M9   your tests catch a fault in AC5             caught by test_existing_input_is_unchanged
PASS   M10  your tests catch a fault in AC5             caught by test_existing_input_is_unchanged
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 1 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              4 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  12 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 2 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      123 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- It just do nothing , just don't consider this cases because in contract all rules are were written

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

- The bound that can never be the only reason for rejection is end <= 1440 in AC1.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->

My overlap conditnios in my final code  - the booking shouldn't be inside or be part or consists or other bookings , as said in AC4 conditions .
There was very strange test that checked the overlaping but it also checked for 2 or more existence entities , like the test won't be passed if we even check the overlapping because in the code of checker there was code line like this : for som_var in n[:1] that says that the existence dictionary must have more than 1 bookings for passing this test , that's so stupid.Ai worked well , and i even suprirsed because all rules were considered and everyhting was fine from the v1 booking, nothing was falling , just a little trouble with one test