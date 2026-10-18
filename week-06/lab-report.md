# Week 06 — Lab report

**Name:** Guchshin Artem
**Group:** Monday16-19
**Date:** 2026-10-18

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | GLM 5.3 Flash  |
| Bolt project link (or `not shared`, and why) | https://bolt.new/p/72147161 |
| Browser and version | Chrome 155.0.8059.80 |
| If you could not use Bolt.new: the tool you used instead, and why | - |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | I think AI won't clearly understand what does "usable" mean | AC6 | |
| 2 | I think AI will check only begin or end of interval  | AC4 | |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: 
AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes

**Bolt's list of the files/components it created, pasted unedited:**

```text
src/types.ts — shared types (Room, Booking, Verdict, CheckResult)
src/data.ts — fictional rooms and bookings
src/utils/availability.ts — the core rule engine (validation, overlap, verdict)
src/components/TimeInput.tsx — HH:MM time inputs with error styling
src/components/RoomCard.tsx — selectable room tile with blocked/capacity info
src/components/VerdictPanel.tsx — the Available/Unavailable decision card
src/components/RoomSchedule.tsx — visual timeline of a room's day
src/App.tsx — page that wires it all together
```

**What v1 does — one line per thing that works, or visibly does not:**

- Current time is 16:15 trying to book a room from 10:00 to 12:00, rejecting with message that ( start > now)
- Trying to book a room from 17:00 to 18:00 , there is no book overlap and start > now , showing messsage with acceptance
- Trying to book with overlaping time my is 17 - 19 and already booked is from 17-18  , showing message with unavailabilty
- Trying to book a room newton seminar room, but the ui don't give me that since it's blocked
- Trying to book a room from 17 to 20 , reject message with "bookings cannot be longer than 120 minutes"
- Trying to book 18 - 20 a room with book at 16 - 18 , message with available
**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Available | Available | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Unavailable | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Unavailable |Unavailable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Available | Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Unavailable | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Unavailable | Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Unavailable | Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Available | Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Available | Available | final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | there no issues | everything good | Low | nothing to do |
| 2 | there no issues | everything good | Low | nothing to do |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
There is a functional fix prompt - Nothing is to fix everyhing works fine and how it should be There is a functional fix prompt - Nothing is to fix everyhing works fine and how it should be There is a functional fix prompt - Nothing is to fix everyhing works fine and how it should be There is a functional fix prompt - Nothing is to fix everyhing works fine and how it should be


The Room Availability Checker is already built and the build passes. Everything from the original request is in place — the six acceptance criteria all work, the page is responsive, and it uses fictional in-memory data with no backend.
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
There is a cleanup fix prompt - Nothing is to fix everyhing works fine and how it should be There is a cleanup fix prompt - Nothing is to fix everyhing works fine and how it should be There is a cleanup fix prompt - Nothing is to fix everyhing works fine and how it should be There is a cleanup fix prompt - Nothing is to fix everyhing works fine and how it should be


The app is complete and working. Nothing new to do here — just let me know if you'd like any changes, like adding more sample rooms, a different color scheme, or a "quick pick" set of common time slots.
```

Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | - | accept | AC1 | - |
| 2 | - | accept | AC1 | - |

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | no issue  | everything is good | no change | same |
| 2 | no issue  | everything is good | no change | same |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `src/utils/availability.ts`

<!-- Write your explanation below this line -->
It's a function that receive interval , room  ,bookings, currentTime as arguments . It checks all acceptance criteria from 1 to 4 , because they are ones that need to be in code . Firstly it checks if the input data is correct , then it starts checking all ac , and ac4 is checking by "overlaps" built in function . Every acceptance criteria is made as it has to be.
---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| P3 | backend or database - e.g. prototype/package.json |
| O2 | prototype/ is identical to original/ - the deck asks for at least one cleanup, even when v1 passes everything |
| L6 | section 6 needs the functional fix prompt, pasted as sent; the cleanup prompt, pasted as sent |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

- Yes my user can book a room from 23:00 to 24:00 and it's acceptable because we can choose this time.

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

- My v1 program used current time as stupid as it may sound our curent time :) . In test cases i used a sandbox version of my program where i kept the time as 9:00

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Which of your two predictions in section 2 was right, and what did v1 actually get wrong?
     (b) Which AI suggestion did you reject, or would have been wrong to accept, and why?
     (c) What is the difference between "the prototype looks finished" and "the prototype meets
         AC1-AC6" - shown with one case from section 4?
     Worthless: "Bolt made some mistakes and I fixed them."
     Worth everything: "T8 failed on v1: the Check button also added the booking to the list, so
     checking 11:00-12:00 a second time said Unavailable. AC5 says the check must not change the
     booking data." -->

<!-- Write your conclusion below this line -->
Both of my predictions in Section 2 were wrong because I underestimated Bolt AI’s capabilities. The prototype worked correctly from the beginning, and every test case passed. I did not reject any AI suggestions or request additional fixes because the implementation appeared to satisfy all acceptance criteria and requirements. However, this experience taught me that successful tests do not automatically mean that a prototype is perfect; the requirements must still be checked carefully.

The main difference between “the prototype looks finished” and “the prototype meets AC1–AC6” is the level of verification. A finished-looking interface may appear functional while violating important rules. For example, the Check button might accidentally add a booking to the list, even though checking availability should not change existing booking data. Therefore, testing each acceptance criterion is essential to verify that the prototype behaves as expected, not just that it looks complete.