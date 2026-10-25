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
| Bolt.new model | not displayed |
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
| T1 | Touching | 660–720 | Available | True | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Available | Available |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Unavailable | Unavailable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Unavailable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Available | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py` lines 20-28 (v1: `booking_v1.py` lines 14-18); page: `src/lib/availability.ts` (v1: `src/App.tsx`) | T6, T7, T8, T9 | Unavailable, Unavailable, Available, Unavailable | Python False, False, True, False; page Unavailable, Unavailable, Available, Unavailable. v1 also returned True for 600.5-660.5 and for a boolean start (section 7, issue 1). | Same four cases with the same results; the float and boolean unit tests now return False. |
| AC2 | `code/booking.py` line 32 (v1: line 22); page: `src/lib/availability.ts` (v1: `src/App.tsx`) | T4, T5 | Available, Unavailable | Python True, False; page Available, Unavailable | Python True, False; page Available, Unavailable |
| AC3 | `code/booking.py` line 16 (v1: line 10); page: `src/lib/availability.ts` (v1: `src/App.tsx`) | T3 | Unavailable | Python False; page Unavailable | Python False; page Unavailable |
| AC4 | `code/booking.py` lines 36-37 (v1: lines 26-27); page: `src/lib/availability.ts` (v1: `src/App.tsx`) | T1, T2, T10 | Available, Unavailable, Unavailable | Python True, False, False; page Available, Unavailable, Unavailable | Python True, False, False; page Available, Unavailable, Unavailable |
| AC5 | `code/booking.py` returns a Boolean and only reads `existing` (lines 36-37); page: result banner and read-only bookings list in `src/App.tsx` | T11 | Available on both checks, bookings unchanged | Python True, True with `existing` unchanged; page Available | Python True, True with `existing` unchanged; page Available |
| AC6 | Page: validation messages in `src/lib/availability.ts` (v1: `src/App.tsx`) and the responsive layout in `src/App.tsx` | T12 (about 375 px wide) | Available, with a readable, usable layout | Page Available at about 375 px | Page Available; `evidence/final-narrow.png` shows a single column with every field and the button visible |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | `can_book` accepts non-integer times: a float or a boolean passes the AC1 checks (found in the critique, exchange B3). | AC1: `can_book(600.5, 660.5, 500, False, [])` and `can_book(True, 60, 0, False, [])` both returned `True` on v1 and on the first final. | Medium | Prompt: "can_book(600.5, 660.5, 500, False, []) returns True and can_book(True, 60, 0, False, []) returns True, but AC1 says candidate times are integer minutes. Make the smallest change in code/booking.py so that a start or end that is not an int (booleans excluded) returns False. Do not change the signature, do not validate now, existing or blocked, and do not add any feature. Add tests for these two cases, for start 0 with now 0, and for a one-minute overlap." Change: one new check, `if type(start) is not int or type(end) is not int: return False`, before the day-bounds check, plus four tests (exchange B4). | The float and boolean tests failed on the old code and pass now. The suite has 23 tests and passes, and T1 to T11 on the final are unchanged. |
| 2 | Preventive cleanup: the availability rules, the time conversion and the messages are written inside the UI component `src/App.tsx`, which mixes logic with layout and makes the rules hard to review or test on their own. No case failed on v1, so this is not a defect. | AC1 to AC4: all of T1 to T11 passed on v1, and the rules are in `src/App.tsx` (section 4). | Low | Prompt: "The availability rules are written inside the component in src/App.tsx. Move them into a separate plain function in a new file src/lib/availability.ts, and make App.tsx call it. Behaviour must stay exactly the same: the same results, the same messages, and the same layout. Do not add any feature, and do not add login, backend or database." Change: Bolt wrote `src/lib/availability.ts` with a plain `checkAvailability` function, the `Booking` and `AvailabilityResult` types and the `toMinutes` and `toTime` helpers, and `App.tsx` now imports them (exchange B6). | Bolt reported that the build passes. I reran T1 to T12 on the final page and every result matched the Expected column, and the same input (09:00, 11:00-12:00) gave the same Available result and layout before and after. |
 
**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 2, the preventive cleanup: the same input (current time 09:00, 11:00-12:00, Data set 1) gives the same Available result and the same layout before and after the rules moved into `src/lib/availability.ts`.

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | Integer validation is missing: floats and Booleans pass the time checks, so `start`, `end` and `now` should be validated as integers (not Booleans). | I ran the final `can_book`: `can_book(600.5, 660.5, 500, False, [])` returned `True`, and `can_book(True, 60, 0, False, [])` returned `True`. | Modify | AC1 requires integer minutes, so I accept it for `start` and `end`. I do not validate `now`, because the brief says to assume `now` is valid. The fix is issue 1 in section 7. |
| 2 | A `blocked` value such as the string "false" is truthy, so the request is rejected; the input contract should stay clear. | I ran `can_book(660, 720, 540, 'false', [(600, 660)])`, and it returned `False`. | Reject | AC3. The contract says `blocked` is a Boolean, a wrong type fails on the safe side (the request is rejected), and the page passes a checkbox value. No code change. |
| 3 | Existing bookings are trusted: malformed records could raise an exception, so validate them. | I ran `can_book(660, 720, 540, False, [(600,)])`, which raised `ValueError`, and with `[None]`, which raised `TypeError`. | Reject | AC4 and the contract: `existing` is a collection of `(start, end)` pairs (assumption 4 in section 2.5), and the page uses fixed fictional data. Extra validation would add code beyond the contract. |
| 4 | Availability can become stale, so a server must recheck it when a booking is confirmed. | I re-read the brief: the page only checks availability and has no backend and no booking step. | Reject | Out of scope under AC5 and the listed exclusions (backend, database, booking). It would matter only in a real booking system. |
| 5 | Add tests for `start = 0` with `now = 0`, a one-minute overlap, touching, 120 and 121 minutes. | I ran them: 0-30 with now = 0 gave `False`, 659-720 against 600-660 gave `False`, 660-720 gave `True`, 600-720 gave `True`, 600-721 gave `False`. I also checked `test_booking.py`: touching, 120 and 121 were already tested, but the first two were not. | Accept | AC1 and AC4. I add the two missing tests and keep the existing ones. |
| 6 | AC6 cannot be verified from the description alone. | I checked my prompt in B3: it gave only a text description of the page, with no code and no screenshot, so the limitation is real. | Accept | AC6. I check the validation messages and the phone-width layout on the page itself (`evi

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | Move the availability rules out of the page component into a separate function without changing any behaviour (the cleanup prompt, exchange B6). |
| Model / plan | Bolt said it would move the logic into a new file and update `App.tsx` to import it. |
| Tool call | Bolt read `src/App.tsx`, wrote `src/lib/availability.ts` and edited `App.tsx`; its action list also showed steps I did not open. |
| Observation | Bolt reported that the build passes and that the results, messages and layout are unchanged. |
| Next step | It stopped and gave me a summary: a plain `checkAvailability` function, two types and the `toMinutes` and `toTime` helpers. |
| Human review | I did not accept the summary as proof. I compared the page before and after on the same input (`before-1.png`, `after-1.png`), reran T1 to T12 on the final page and took the phone-width screenshot. |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Claude (claude.ai chat) | The two files I uploaded (`README.md` and `report.md`) and the whole chat history, including the results I pasted. | A sandbox where it read the files, created `booking.py` and the tests, and ran `python -m unittest`. It had no access to my Git repository, so I copied and committed every file myself. | Observed: the files and test output appeared in the chat and I had to commit them. Assumed: it could not reach my repository or the internet beyond its sandbox. |
| Bolt.new | My first prompt, and for the cleanup the existing project: it read `src/App.tsx` before changing it. | Reading and writing files inside its own project, and a build step; the action list showed "Read" and "Wrote" for the files. | Observed: the reply listed the file it read, the file it wrote and "Build passes". |
| Bolt.new | The earlier conversation in the same project. | No external services: I forbade login, backend and database, and its first reply said no Bolt Database was needed. | Assumed: that Bolt kept my first prompt as context for the second one, and that it made no network calls. |
| ChatGPT (critique chat) | Only what I pasted: `booking.py` and a text description of the page. | None that I saw. | Assumed: that it did not run the code, because its review says it could not verify the page and it never reported a run. |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting any AI-generated change I kept the first version unedited, then ran the full suite and the twelve cases myself. For the integer fix I added the new tests first and ran them against the old code, where two failed, and then against the new code, where all 23 passed. For the Bolt cleanup I compared the page before and after on the same input and reran every case.
 
**Reliability, security, responsibility:** The workflow is only as reliable as the checks I run myself. Bolt said "Build passes", but I still reran all twelve cases, and ChatGPT's critique was partly out of scope, so I verified each claim before deciding. Security depends on permissions: Claude worked in a sandbox and Bolt only inside its own project, so I copied and committed every file myself. Responsibility for the requirements, the review and what I submit stays with me.

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

For the function, AI-assisted coding kept me in control: I saved v1 unedited, reviewed each branch, and wrote tests whose expected values came from the criteria. For the page, vibe coding meant describing the goal to Bolt and judging the result mainly by using it. Reliability risk: v1 accepted 600.5 and True as times, which only the critique and a rerun exposed. Usability risk: a phone user could find the page unusable, so I checked it at about 375 px. Security risk: a generated project can pull in many dependencies or add network calls, which is why my prompt forbade them. Review, tool permissions and tests remain human responsibilities because the AI cannot know what the requirements mean to me or what it should be allowed to touch. I rejected ChatGPT's advice to validate blocked and existing, because the contract already defines them, and I narrowed its integer advice to start and end. Next I would add unit tests for availability.ts, without adding any feature.


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
just make everyghing yourself dont' mind do what you want and as you want , without any my help and intructions 
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
approved ratified , authoriszed, endorese,d sanctioned , confirmed , certifyd , geernlighted , accepted , allowed , permitted , passed , consent to , praised , applaued , favored , commended
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
 
- **Tool:** ChatGPT
- **Model:** not displayed
- **Date:** 2026-10-24
- **Stage:** Critique
- **Source:** this SIS
**Prompt:**
 
~~~~text
Review the following can_book function and the described web page against these acceptance criteria. For each criterion say whether it is satisfied and point to the code or behaviour. List any bugs, risks or recommendations.
 
AC1: Candidate times are integer minutes after midnight: 0 <= start < end <= 1440; start must be strictly after now.
AC2: Duration must not exceed 120 minutes. Exactly 120 minutes is permitted.
AC3: Reject every request when the selected room is blocked.
AC4: Reject overlap with any existing booking. Intervals touching at an endpoint do not overlap.
AC5: Display an unambiguous Available / Unavailable result; do not mutate existing bookings.
AC6: Provide understandable validation feedback and a usable narrow/mobile layout.
 
"""Room availability check for the Smart Campus Room Availability Checker (SIS #03)."""
 
MINUTES_PER_DAY = 1440   # AC1: the day ends at 1440 minutes after midnight
MAX_DURATION = 120       # AC2: longest allowed booking, in minutes (120 itself is allowed)
 
 
def can_book(start, end, now, blocked, existing):
    """Return True only when AC1-AC4 all hold, otherwise False.
 
    start, end: requested interval in minutes after midnight (start included, end excluded)
    now: current time in minutes after midnight (assumed valid, 0-1439)
    blocked: True if the selected room is blocked
    existing: collection of (start, end) pairs; it is only read, never changed (AC5)
    """
    # AC3: a blocked room rejects every request
    if blocked:
        return False
 
    # AC1: 0 <= start < end <= 1440
    if not (0 <= start < end <= MINUTES_PER_DAY):
        return False
 
    # AC1: the start must be strictly after now
    if start <= now:
        return False
 
    # AC2: at most 120 minutes; exactly 120 is allowed
    if end - start > MAX_DURATION:
        return False
 
    # AC4: reject overlap with any existing booking; touching at an endpoint is allowed
    for booked_start, booked_end in existing:
        if start < booked_end and booked_start < end:
            return False
 
    return True
 
The page is a React single-page app (Room A-101) with inputs for current time, start, end, booking data set and a "room blocked" checkbox, a "Check availability" button, and an Available/Unavailable result banner with validation messages. Existing bookings are fictional and read-only.
~~~~
 
**Response:**
 
~~~~text
# Review of `can_book` and the Room Availability Checker
 
## 1. Acceptance criteria review
 
The Python function appears to satisfy AC1–AC5 based on the supplied code. AC6 is only partially verifiable because the React source code and rendered page are not provided; the description confirms some relevant UI elements but does not establish their accessibility or mobile usability.
 
| Criterion                                   | Status                        | Evidence                                                                                                                                                                                                     |
| ------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AC1 — Valid time interval                   | Satisfied, with an assumption | `0 <= start < end <= MINUTES_PER_DAY` validates the interval, and `start <= now` rejects starts at or before the current time.                                                                               |
| AC2 — Maximum duration                      | Satisfied                     | `end - start > MAX_DURATION` rejects durations greater than 120 minutes while permitting exactly 120.                                                                                                        |
| AC3 — Blocked room                          | Satisfied                     | `if blocked: return False` rejects every request when the room is blocked.                                                                                                                                   |
| AC4 — No overlapping bookings               | Satisfied                     | `start < booked_end and booked_start < end` detects interval overlap while allowing endpoint touching.                                                                                                       |
| AC5 — Clear result and no mutation          | Partially satisfied           | The function returns a Boolean and only reads `existing`. The page description specifies an Available/Unavailable banner and read-only bookings, but actual rendering and state mutation cannot be verified. |
| AC6 — Validation feedback and mobile layout | Partially verified            | The description mentions validation messages and a React SPA, but no implementation details or screenshot are provided to verify feedback quality, accessibility, or responsive behaviour.                   |
 
## 2. Detailed code review
 
### AC1 — Valid time interval
 
```
if not (0 <= start < end <= MINUTES_PER_DAY):    return Falseif start <= now:    return False
```
 
What works:
 
- `start` cannot be negative.
- `end` cannot exceed 1440, which represents midnight at the end of the day.
- `start` must be strictly less than `end`.
- A booking starting exactly at `now` is rejected.
 
Potential bug: incorrect input types.
 
Python does not enforce integer types through the function signature. For example:
 
```
can_book(600.5, 660.5, 500, False, [])
```
 
This returns `True`, even though AC1 requires integer minutes. Booleans also behave like integers in Python, so `True` could be accepted as a time value.
 
Recommendation: Explicitly validate that `start`, `end`, and `now` are integers, excluding booleans. The current-time assumption is documented, but validation may be appropriate if `now` comes from the web page.
 
### AC2 — Maximum duration
 
```
if end - start > MAX_DURATION:    return False
```
 
Satisfied. The comparison is strictly greater than 120, so exactly 120 minutes is permitted.
 
Examples:
 
| Start | End | Duration | Expected                            |
| ----- | --- | -------- | ----------------------------------- |
| 600   | 720 | 120 min  | Available, if other conditions pass |
| 600   | 721 | 121 min  | Unavailable                         |
| 600   | 601 | 1 min    | Available, if other conditions pass |
 
No code change is necessary for this criterion.
 
### AC3 — Blocked room
 
```
if blocked:    return False
```
 
Satisfied. The check happens before the other booking validations, so a blocked room always returns `False`.
 
One consideration is that the function relies on `blocked` being a Boolean. Unexpected values such as `"false"` are truthy in Python and would cause the request to be rejected. If the web page supplies a real checkbox value, this is unlikely to be an issue, but the input contract should remain clear.
 
### AC4 — Overlapping bookings
 
```
for booked_start, booked_end in existing:    if start < booked_end and booked_start < end:        return False
```
 
Satisfied for valid booking intervals.
 
The overlap condition correctly treats both intervals as half-open: the start is included, but the end is excluded.
 
For example, a requested booking from 660 to 720 does not overlap an existing booking from 600 to 660. However, a booking from 659 to 720 does overlap it.
 
Potential risks:
 
- The function assumes every existing booking contains a valid pair of times.
- Malformed or invalid existing bookings are not validated.
- If `existing` contains an invalid entry, unpacking or comparisons could raise an exception rather than return `False`.
 
Recommendation: Validate booking data when it is loaded into the application, or define how malformed existing bookings should be handled. Avoid silently accepting corrupted booking records.
 
### AC5 — Unambiguous result and no mutation
 
The function returns `True` when all checks pass and `False` otherwise. It does not append, remove, or modify existing bookings.
 
This satisfies the function-level requirements.
 
The React page is described as displaying an Available/Unavailable banner and using fictional, read-only booking data. However, without the React code, it is not possible to verify that:
 
- The result banner updates after each check.
- A previous result is cleared or updated when inputs change.
- The UI maps `True` and `False` to the correct labels.
- Existing bookings remain unchanged in React state.
 
Recommendation: Test both the Python function and the UI. Use explicit labels, and ensure that changing an input cannot leave a misleading result from a previous check.
 
### AC6 — Validation feedback and mobile usability
 
The page description confirms that validation messages and a result banner exist. It does not show how validation errors are presented or whether the page works on narrow screens.
 
Check that:
 
- Users receive understandable feedback for invalid times, past start times, excessive duration, blocked rooms, and overlapping bookings.
- Inputs have visible labels and errors identify the relevant fields.
- The result is communicated through text, not colour alone.
- The layout works on narrow screens without horizontal scrolling.
- Buttons and inputs are large enough to use comfortably on touchscreens.
- Keyboard navigation and screen-reader announcements work correctly.
 
Important distinction: The Python function returns only a Boolean. It does not explain why a booking was rejected. The React layer must provide appropriate validation feedback if AC6 requires users to understand the reason for rejection.
 
## 3. Additional bugs, risks, and recommendations
 
1\. Integer validation is missing
 
The most concrete issue is that floating-point values and Boolean values can pass the time checks. Add strict integer validation for `start`, `end`, and `now`.
 
2\. Booking data is trusted
 
Existing intervals are assumed to be well-formed. Validate them when loading the data, and define how the application should respond to corrupt records.
 
3\. Boolean results do not identify the rejection reason
 
Keep the Boolean contract if required by the assignment, but add reason-specific validation in the UI or a separate validation layer.
 
4\. Availability can become stale
 
If the page later connects to a real booking system, another user could reserve the room between checking availability and submitting a booking. The server must recheck availability when confirming the reservation.
 
## 4. Recommended additional tests
 
These cases would strengthen confidence in the implementation:
 
| Test case                                               | Expected result                       |
| ------------------------------------------------------- | ------------------------------------- |
| `start = 0`, `now = 0`                                  | `False` — start is not after now      |
| `end = 1440` with valid earlier start                   | `True`, if other conditions pass      |
| Duration exactly 120 minutes                            | `True`, if other conditions pass      |
| Duration 121 minutes                                    | `False`                               |
| Requested interval touches an existing booking endpoint | `True`, if other conditions pass      |
| Requested interval overlaps by one minute               | `False`                               |
| Room blocked, otherwise valid request                   | `False`                               |
| `start = 600.5`                                         | `False` — integer requirement         |
| `start = True`                                          | `False` — Boolean is not a valid time |
| Existing bookings before and after the request          | `True`, if neither overlaps           |
| Existing bookings before and after a check              | Unchanged                             |
 
## Final assessment
 
- AC1: Satisfied for numeric inputs, but strict integer validation is missing.
- AC2: Satisfied.
- AC3: Satisfied.
- AC4: Satisfied for valid existing booking intervals.
- AC5: Function-level requirements are satisfied; page behaviour requires implementation-level testing.
- AC6: Not fully verifiable from the description alone.
 
The highest-priority code improvement is to enforce integer input types. The highest-priority UI improvement is to ensure that validation messages explain rejection reasons clearly and that the layout remains usable on mobile devices.
~~~~

### B4
 
- **Tool:** Claude (claude.ai)
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-10-24
- **Stage:** Repair
- **Source:** this SIS
**Prompt:**
 
~~~~text
can_book(600.5, 660.5, 500, False, []) returns True and can_book(True, 60, 0, False, []) returns True, but AC1 says candidate times are integer minutes. Make the smallest change in code/booking.py so that a start or end that is not an int (booleans excluded) returns False. Do not change the signature, do not validate now, existing or blocked, and do not add any feature. Add tests for these two cases, for start 0 with now 0, and for a one-minute overlap.
~~~~
 
**Response:**
 
~~~~text
Done. The change is one new check, and the suite is green.
 
**The change in `code/booking.py`**, placed just before the day-bounds check:
 
```python
    # AC1: start and end must be integer minutes (a bool is not a time)
    if type(start) is not int or type(end) is not int:
        return False
```
 
The signature is unchanged, and `now`, `existing` and `blocked` are not validated.
 
**Four tests added** (23 in total): float start and end, boolean start, start 0 with now 0, and a one-minute overlap.
 
**What I observed:**
- Against the old `booking.py`, the float test and the boolean test failed and the other two passed, so those two tests really detect the defect.
- Against the new `booking.py`, `python -m unittest -v` gave `Ran 23 tests … OK`.
- v1 also returned `True` for both inputs, so the defect was already in v1. The final now returns `False` for both.
- T1–T11 on the new final give the same results as before, so the Python final column in §5 is unchanged.
 
**In `report.md`** I filled issue 1 in §7, replaced the §12.1 suite output with the new run, and logged this exchange as **B4** (Repair).
 
**What you do:**
1. Copy the new `booking.py`, `test_booking.py` and `report.md` into `sis-03/`.
2. Run `python -m unittest -v` in `sis-03/code/` and confirm you also get 23 tests and `OK`.
3. Commit and push: `git add sis-03 && git commit -m "sis-03: integer validation fix and tests" && git push`.
 
Issue 2 in §7 is still open, and it must be something real from the page. Send me your observations from the four checks in my last message (text versus colour, sideways scroll at 375 px, the validation messages, anything confusing on first load), and I'll write the Bolt repair prompt from them.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
test_boolean_start_is_rejected (test_booking.TestCanBook.test_boolean_start_is_rejected) ... ok
test_equal_start_and_end_is_rejected (test_booking.TestCanBook.test_equal_start_and_end_is_rejected) ... ok
test_float_start_and_end_are_rejected (test_booking.TestCanBook.test_float_start_and_end_are_rejected) ... ok
test_gap_between_two_bookings_is_allowed (test_booking.TestCanBook.test_gap_between_two_bookings_is_allowed) ... ok
test_negative_start_is_rejected (test_booking.TestCanBook.test_negative_start_is_rejected) ... ok
test_no_existing_bookings_is_allowed (test_booking.TestCanBook.test_no_existing_bookings_is_allowed) ... ok
test_overlap_by_one_minute_is_rejected (test_booking.TestCanBook.test_overlap_by_one_minute_is_rejected) ... ok
test_request_inside_a_booking_is_rejected (test_booking.TestCanBook.test_request_inside_a_booking_is_rejected) ... ok
test_start_before_now_is_rejected (test_booking.TestCanBook.test_start_before_now_is_rejected) ... ok
test_start_zero_with_now_zero_is_rejected (test_booking.TestCanBook.test_start_zero_with_now_zero_is_rejected) ... ok
test_starting_one_minute_after_now_is_allowed (test_booking.TestCanBook.test_starting_one_minute_after_now_is_allowed) ... ok
test_t10_second_of_several_bookings_is_checked (test_booking.TestCanBook.test_t10_second_of_several_bookings_is_checked) ... ok
test_t11_existing_is_not_changed_and_result_is_stable (test_booking.TestCanBook.test_t11_existing_is_not_changed_and_result_is_stable) ... ok
test_t1_touching_endpoint_is_allowed (test_booking.TestCanBook.test_t1_touching_endpoint_is_allowed) ... ok
test_t2_overlap_is_rejected (test_booking.TestCanBook.test_t2_overlap_is_rejected) ... ok
test_t3_blocked_room_rejects_a_valid_request (test_booking.TestCanBook.test_t3_blocked_room_rejects_a_valid_request) ... ok
test_t4_exactly_120_minutes_is_allowed (test_booking.TestCanBook.test_t4_exactly_120_minutes_is_allowed) ... ok
test_t5_121_minutes_is_rejected (test_booking.TestCanBook.test_t5_121_minutes_is_rejected) ... ok
test_t6_starting_exactly_now_is_rejected (test_booking.TestCanBook.test_t6_starting_exactly_now_is_rejected) ... ok
test_t7_reversed_times_are_rejected (test_booking.TestCanBook.test_t7_reversed_times_are_rejected) ... ok
test_t8_ending_exactly_at_midnight_is_allowed (test_booking.TestCanBook.test_t8_ending_exactly_at_midnight_is_allowed) ... ok
test_t9_ending_after_midnight_is_rejected (test_booking.TestCanBook.test_t9_ending_after_midnight_is_rejected) ... ok
test_touching_the_start_of_a_booking_is_allowed (test_booking.TestCanBook.test_touching_the_start_of_a_booking_is_allowed) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.013s

OK
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
| The types of `now`, `blocked` and `existing` are not validated | Section 8, decisions 2 and 3: the contract defines them, and the brief says to assume `now` is valid. Only `start` and `end` are checked as integers. | If the function were connected to real data, validate them where the data is loaded. |
| The page rules have no automated test | I checked the final page by hand (T1 to T12). Its rules in `src/lib/availability.ts` have no unit test, and the checker does not run the page. | Add unit tests for `checkAvailability`, which is easy now that it is a separate function. |
 
