# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Claude |
| Coding assistant model | Sonnet 5.5 medium |
| Bolt.new model | not displayed (the interface only shows “standard”) |
| Bolt project link | https://bolt.new/p/72349374 |
| Language | Python |
| Path | A |
| Python v1 from | fresh |
| Web v1 from | fresh |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words

**Scope:** One responsive page and one Python function that check whether a requested time interval is available for a single selected room, using fictional booking data. They only report Available or Unavailable and never create, confirm or change bookings. There is no login, database, backend, external API or payment.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Times are whole minutes after midnight. The start must be at least 0, the end must be after the start and no later than 1440, and the start must be strictly later than the current time (starting exactly now is not allowed). |
| AC2 | A booking may last at most 120 minutes. Exactly 120 minutes is fine; 121 is too long. |
| AC3 | If the selected room is blocked, every request is refused, whatever the times are. |
| AC4 | A request is refused if it overlaps any existing booking. If one interval ends exactly when the other starts, they only touch and that is allowed. |
| AC5 | The page shows a clear Available or Unavailable result, never something ambiguous. Checking must not change the existing bookings. |
| AC6 | When the input is invalid the user sees an understandable message, and the page stays usable on a narrow phone screen. |
### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Endpoint overlap: using `<=` instead of `<` in the overlap test makes touching intervals look like overlaps, so a valid request is rejected. | AC4 | Run T1 (660-720 against 600-660, must be Available) and T10, and compare with T2 (a real overlap, must be Unavailable). |
| 2 | Starts-now: accepting `start == now` by using `>=` instead of `>`. | AC1 | Run T6 (540-570 with now = 540, must be Unavailable) and also a start one minute after now. |
| 3 | Duration boundary: using `< 120` or `<= 121`, so exactly 120 is rejected or 121 is accepted. | AC2 | Run T4 (720-840, must be Available) and T5 (720-841, must be Unavailable). |
| 4 | Day bounds: allowing an end after 1440, or rejecting an end of exactly 1440. | AC1 | Run T8 (1380-1440, must be Available) and T9 (1380-1441, must be Unavailable). |
| 5 | Mutation: sorting, merging or removing items in `existing` while checking, so a second check gives a different answer. | AC5 | Run T11 (same check twice, both must be Available) and compare `existing` before and after the call. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Requested start time, in minutes after midnight (included in the interval). | `int`, `0 <= start < end` |
| `end` | Requested end time, in minutes after midnight (excluded from the interval). | `int`, `start < end <= 1440` |
| `now` | The current time, in minutes after midnight. | `int`, 0 to 1439 (assumed valid) |
| `blocked` | Whether the selected room is blocked. | `bool`, `True` or `False` |
| `existing` | The room's existing bookings, as `(start, end)` pairs. It must never be modified. | collection of `(int, int)` tuples |
| returns | `True` only when AC1 to AC4 all hold; `False` otherwise. | `bool` |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. `now` is always valid (0 to 1439), so the function does not need to validate it.
2. An invalid request (reversed times, outside the day, too long) returns `False` instead of raising an error, because the contract says return `False` otherwise.
3. Every interval includes its start and excludes its end, so two intervals overlap only if `start < existing_end` and `existing_start < end`.
4. Duration is `end - start`, and the existing bookings are well-formed pairs with their start before their end.
**Checked manually:**
 
- T1 (660-720 against 600-660): 660 < 660 is false, so there is no overlap and the answer is Available.
- T2 (630-690 against 600-660): 630 < 660 and 600 < 690, so they overlap and the answer is Unavailable.
- T4 and T5: the durations are 120 and 121, so the first is allowed and the second is not.
- T6 (540-570 with now = 540): the start is not strictly after now, so the answer is Unavailable.
- T10 (720-780 against 600-660 and 700-760): it overlaps the second booking because 720 < 760 and 700 < 780, so the answer is Unavailable.


## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if blocked:` | AC3 | Yes | Returns `False` for every request when the room is blocked, and it is the first check, so no other input can change that. |
| `if not (0 <= start < end <= 1440):` | AC1 | Yes | Enforces the day bounds and `start < end`. Reversed times (T7) and an end of 1441 (T9) are rejected, and an end of exactly 1440 (T8) is allowed. |
| `if start <= now:` | AC1 | Yes | Rejects a start that is not strictly after now, so starting exactly now (T6) is refused, while 541 with now = 540 is accepted. |
| `if end - start > 120:` | AC2 | Yes | Rejects only durations above 120 minutes, so exactly 120 (T4) passes and 121 (T5) fails. |
| `if start < e and s < end:` | AC4 | Yes | A half-open overlap test run for every existing booking. Touching intervals (T1) do not satisfy it, real overlaps (T2, T10) do, and `existing` is only read, never changed. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a one-page responsive web app called "Smart Campus Room Availability Checker" for ONE selected room (Room A-101) using FICTIONAL booking data. The page only checks availability. It must not create, confirm or edit bookings.
 
Inputs:
- "Current time" (time input, default 09:00)
- "Room blocked" (checkbox, default off)
- "Start time" and "End time" (time inputs)
- "Booking data" (dropdown): "Data set 1: 10:00-11:00" and "Data set 2: 10:00-11:00 and 11:40-12:40". Default is Data set 1. The list of existing bookings for the chosen set is shown on the page.
- A "Check availability" button.
 
Rules (acceptance criteria):
- AC1: Times are minutes after midnight: 0 <= start < end <= 1440, and start must be strictly after the current time.
- AC2: Duration must not exceed 120 minutes. Exactly 120 minutes is allowed.
- AC3: If the room is blocked, every request is Unavailable.
- AC4: Reject any overlap with an existing booking. Intervals that only touch at an endpoint (one ends exactly when the other starts) do NOT overlap.
- AC5: Show a clear, unambiguous result: "Available" or "Unavailable". Never change the existing bookings; checking twice must give the same result.
- AC6: Show an understandable validation message when input is invalid (for example, end not after start, start not after current time, longer than 120 minutes, room blocked, overlaps a booking). The layout must be usable on a narrow phone screen (about 375 px wide).
 
Do NOT add: login or authentication, a backend, a database, external API calls, payments, a Book/Confirm button, a cleaning buffer, a different duration limit, or any unrelated feature. Keep all data in the front end.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| Main component | `src/App.tsx` | The file Bolt reported writing: the whole page in one React component, with the form, the availability check, the result banner and the existing-bookings list. |
| HTML entry page | `index.html` | The Vite entry point that loads the React app into the page. |
| Project manifest | `package.json` | Lists the dependencies and the build scripts of the generated project. |
| Tailwind configuration | `tailwind.config.js` | Configures the Tailwind CSS utility classes used to style and lay out the page. |

**What v1 does:**

- Shows the title, a note that no booking is created, and a card for Room A-101 with a green “Not blocked” badge.
- Offers a Current time input (09:00), a Booking data dropdown (“Data set 1: 10:00–11:00”), Start time (09:30) and End time (10:30) inputs, and a Room blocked checkbox, with the requested duration (60 min) shown live.
- Has a single “Check availability” button; according to Bolt's reply it then shows an Available or Unavailable banner with a validation message for invalid input. I have not yet observed these results; they are tested in section 5.
- Lists the existing bookings for Room A-101 below the form (“Intro to Algorithms, 10:00–11:00 (60 min)”) with a note that they are fictional and read-only.
- Contains no login, backend, database or Book button in the first preview (`evidence/web-v1.png`).

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | | Available | |
| T2 | Overlap | 630–690 | Unavailable | False | | Unavailable | |
| T3 | Blocked | 660–720, blocked | Unavailable | False | | Unavailable | |
| T4 | Exactly 120 min | 720–840 | Available | True | | Available | |
| T5 | 121 min | 720–841 | Unavailable | False | | Unavailable | |
| T6 | Starts now | 540–570 | Unavailable | False | | Unavailable | |
| T7 | Reversed | 720–660 | Unavailable | False | | Unavailable | |
| T8 | Ends at midnight | 1380–1440 | Available | True | | Available | |
| T9 | Past midnight | 1380–1441 | Unavailable | False | | Unavailable | |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | | Unavailable | |
| T11 | Same check twice | 660–720, twice | Available | True | | Available | |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC2 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC3 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC4 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC5 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC6 | (write here) | (write here) | (write here) | (write here) | (write here) |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) | (write here) |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue (write here)

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) |
| 3 | (write here) | (write here) | (write here) | (write here) |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | (write here) |
| Model / plan | (write here) |
| Tool call | (write here) |
| Observation | (write here) |
| Next step | (write here) |
| Human review | (write here) |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** (write here)

**Reliability, security, responsibility:** (write here)

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

(write here)

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** Claude
- **Model:**  Sonnet 5.5 medium
- **Date:** 2026-10-24
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
just make everyghing yourself dont' mind
~~~~

**Response:**

~~~~text
I'll do as much as I legitimately can. The only things I can't do for you are the things that need your hands (Bolt.new, screenshots, running the page, GitHub), and I won't invent anything that didn't happen, because the brief gives 0 for the whole SIS for fabricated prompts, results or screenshots. Everything else (the function, tests, test runs, all the report text, `AI_USAGE.md`, `submission.yml`) I'll write myself, with the §11 exchanges taken from what actually happens in this chat.

## Stage A: Plan for `can_book(start, end, now, blocked, existing)`

**Checks, in this order** (cheapest and most decisive first):
1. **Blocked (AC3):** if `blocked` is true, return `False`.
2. **Day bounds (AC1):** require `0 <= start < end <= 1440`. This also rejects reversed times.
3. **Starts after now (AC1):** require `start > now` (strictly).
4. **Duration (AC2):** require `end - start <= 120`.
5. **Overlap (AC4):** for each `(s, e)` in `existing`, a clash exists if `start < e and s < end`. Return `False` on the first clash.
6. Otherwise return `True`.

**Assumptions**
- `now` is valid (0–1439), so it isn't validated.
- Invalid requests return `False` and never raise.
- Intervals include the start and exclude the end, so touching endpoints don't overlap.
- `existing` is only read: no sorting, no removing, no copying back.
- Standard library only, nothing added beyond the contract.

**Boundary tests to run**
- T1 touching (660–720): True
- T2 overlap (630–690): False
- T3 blocked: False
- T4 exactly 120 min (720–840): True
- T5 121 min (720–841): False
- T6 starts now (540–570): False
- T7 reversed (720–660): False
- T8 ends at 1440 (1380–1440): True
- T9 ends at 1441 (1380–1441): False
- T10 second booking (720–780 with 700–760 existing): False
- T11 same check twice: True both times, and `existing` is unchanged
- Plus one more: a start one minute after now (541–571) must be True.

**Your approval:** if this plan is fine, reply **"approved"**. I'll then generate `can_book` as v1, which you save unedited as `code/original/booking_v1.py`.
~~~~

### B2

- **Tool:** Claude
- **Model:** Sonnet 5.5 medium
- **Date:** 2026-10-24
- **Stage:** Generate
- **Source:** this SIS

**Prompt:**

~~~~text
approved
~~~~

**Response:**

~~~~text
Here is `can_book` v1, exactly as saved in `booking_v1.py`:

```python
def can_book(start, end, now, blocked, existing):
    """Return True only when AC1-AC4 all hold, otherwise False.

    start, end: requested interval in minutes after midnight (start included, end excluded)
    now: current time in minutes after midnight (assumed valid, 0-1439)
    blocked: True if the selected room is blocked
    existing: collection of (start, end) pairs; it is only read, never changed
    """
    # AC3: a blocked room rejects every request
    if blocked:
        return False

    # AC1: 0 <= start < end <= 1440
    if not (0 <= start < end <= 1440):
        return False

    # AC1: start must be strictly after now
    if start <= now:
        return False

    # AC2: at most 120 minutes (exactly 120 is allowed)
    if end - start > 120:
        return False

    # AC4: reject overlap; touching at an endpoint is not an overlap
    for s, e in existing:
        if start < e and s < end:
            return False

    return True
```

It follows the approved plan: blocked, then day bounds, then starts-after-now, then duration, then overlap. It uses only the standard library and never modifies `existing`.

**I ran v1 and this is what it actually returned** (base data: now = 540, existing = [(600, 660)]):

| Case | Result | Expected | Match |
| --- | --- | --- | --- |
| T1 | True | True | ✓ |
| T2 | False | False | ✓ |
| T3 | False | False | ✓ |
| T4 | True | True | ✓ |
| T5 | False | False | ✓ |
| T6 | False | False | ✓ |
| T7 | False | False | ✓ |
| T8 | True | True | ✓ |
| T9 | False | False | ✓ |
| T10 | False | False | ✓ |
| T11 | True, True (and `existing` unchanged) | True, True | ✓ |

Start 541 to 571 also returned True, as it should.

Python v1 passed every case, which the brief allows. In §3 we say v1 was already correct, and in §7 we log a preventive cleanup (adding tests, tightening the docstring and type handling) instead of inventing a defect. I won't make up a bug that doesn't exist.
~~~~

### B3

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B4

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
(paste here)
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
