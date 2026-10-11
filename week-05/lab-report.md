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
| 1 | test_touching_end_is_allowed | (660, 720) | None | True | AC4 | True (PASS) | |
| 2 | test_overlap | (630, 690) | None | False | AC4 | False (PASS) | |
| 3 | test_blocked | (660, 720) | blocked=True | False | AC3 | False (PASS) | |
| 4 | test_exactly_120_minutes | (720, 840) | None | True | AC2 | True (PASS) | |
| 5 | test_more_than_120_minutes | (720, 841) | None | False | AC2 | False (PASS) | |
| 6 | test_starts_now | (540, 570) | None | False | AC1 | False (PASS) | |
| 7 | test_zero_length_booking | (600, 600) | None | False | AC1 | False (PASS) | |
| 8 | test_reverse_order | (720, 660) | None | False | AC1 | False (PASS) | |
| 9 | test_empty_existing | (660, 720) | existing=[] | True | AC4 | True (PASS) | |
| 10 | test_existing_with_several_bookings | (660, 720) | existing=[(600, 630), (630, 660), (720, 750)] | True | AC4 | True (PASS) | |
| 11 | test_booking_inside_existing | (610, 620) | None | False | AC4 | False (PASS) | |
| 12 | test_booking_contains_existing | (590, 670) | None | False | AC4 | False (PASS) | |
---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
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

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

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
