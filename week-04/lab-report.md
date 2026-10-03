# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Artem Guchshin |
| Group | Monday 16-19 |
| AI assistant | Claude |
| Exact model | Claude Sonnet 5.5 Medium |
| Renderer | PlantUML web server |
| Behaviour diagram | activity |
| Stories used | my week-03 stories, revised |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
This is the Smart Campus scenario, its rules R1-R4 and my approved user stories. I will ask you for several UML diagrams in PlantUML. Use only this scenario. Wait for my first request.Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate a UML activity diagram in PlantUML for Book room. Show the initial node, actions, guarded decisions, and final nodes. Check the time range, blocked-room status, and overlapping bookings. Show confirmation after success and rejection after failure. Use branches rather than parallel paths unless concurrency is required.
```

### 2.4 Focused correction prompts (if you sent any)

```text
-
```

### 2.5 Critique prompt

```text
<paste>
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** <one line each, or "the AI listed none" — that is a finding too>

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | UC2 `<<include>>` UC4 | UC4 is a system action, not a user goal. The include is not "always": confirmation happens only on success. | R4, US-04 | Deleted UC4. R4 is now a success guarantee of UC2. |
| 2 | UC3 Cancel Booking | The cancellation confirmation has no use case or note. | US-05 | Added it as a success guarantee of UC3. |
| 3 | UC2 / UC5 (no assumptions declared) | Touching bookings and blocking a booked room are undecided, so the overlap check and the effect of blocking are undefined. | R2, R3, US-06 | A1: touching bookings do not overlap. A2: blocking does not cancel existing bookings. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One student makes 0..* bookings. | Each booking belongs to exactly 1 student. | 1 / 0..* |
| Room — Booking | One room is reserved by 0..* bookings. | Each booking is for exactly 1 room. | 1 / 0..* |
| Booking — Confirmation | One booking produces exactly 1 confirmation. | Each confirmation belongs to exactly 1 booking. | 1 / 1 |

### 4.2 Constraints the multiplicities cannot show

- R2: a note on Booking says active bookings of the same room must not overlap (touching is allowed, A1).
- R1: a note on Booking says the start must be in the future and 0 < duration <= 2h (exactly 2h is allowed).
- R3: a note on Room says a blocked room accepts no new booking (the `blocked` flag holds the state).
- R4: a note on Booking says only a successful booking has a Confirmation.

### 4.3 Assumptions

- A1: touching bookings (10:00-12:00 and 12:00-13:00) do not overlap, so back-to-back bookings are allowed.
- A2: blocking a room does not cancel its existing bookings. R3 stops only new ones.
- A3: a Booking exists only after a successful booking, so "1 Booking : 1 Confirmation" holds.

### 4.4 Findings

| 1 | Booking (no notes) | R1, R2 and R4 are not shown, and R2 cannot be drawn with multiplicities. | R1, R2, R4 | Added notes on Booking (R1, R2, R4) and on Room (R3). |
| 2 | `BookingStatus.COMPLETED` | No rule or story needs it. A finished booking is known from `endTime`. | R2, US-03 | Removed it. The enum is now ACTIVE and CANCELLED. |
| 3 | `Student.reserveRoom()` and `cancelBooking()` | They are actions, and they duplicate `Booking.cancel()`. Student is a domain concept, not a service. | US-02, US-03 | Removed both methods. |
| 4 | `overlapsWith` (touching case undeclared) | The result for back-to-back bookings is undefined. | R2 | Declared A1. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** <3A sequence / 3B activity — one sentence on why>

**Design components added beyond the domain model:** <name each one, e.g. `BookingService` —
what it does in one line; write "none" for an activity diagram>

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Decision "Slot overlaps an active booking for this room?" | The touching case (10:00-12:00 vs 12:00-13:00) is not stated, so the check is undefined for back-to-back bookings. | R2, A1 | Added a note on the decision: "overlap is strict, touching bookings are allowed (A1)". |
| 2 | Two decisions for R1 (future start, then duration) | The review expects one decision per rule, and R1 has two. A single combined diamond would hide which part failed, so the split is kept. | R1, US-02 | Kept both diamonds. Declared that they are two conditions of the same rule, so the student gets a specific reason for each. |
| 3 | Overlap check wording "active booking" | Without a stated meaning, cancelled bookings could be read as blocking a slot. | R2, US-03 | Added to the note: "only ACTIVE bookings count, CANCELLED ones are ignored". |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | The note on Book Room cites only R4 and A1, but US-02 lists R1, R2, R3 and R4, so the use case does not show three of its rules. | `use-case.puml`, note on UC2 (Book Room) | Accept | The approved stories table maps US-02 to R1-R4, so the note is incomplete. I replaced it with a note that lists US-02 and US-04 and all four rules, which makes the §7 trace for Book Room complete. |
| 2 | US-05 (cancellation confirmation) is not modelled in the class or activity diagram. `Confirmation` is 1:1 with `Booking` and the R4 note says only a successful booking has one, which contradicts the UC3 note. | `class.puml`, `Confirmation` and the `Booking "1" -- "1" Confirmation` association; `use-case.puml`, note on UC3 | Accept | US-05 is an approved story, so the cancellation confirmation has to appear in the model. I added `ConfirmationType { BOOKING, CANCELLATION }` and changed the multiplicity to `1..2`. I recorded in §1 that US-05 is read as a confirmation of the cancellation itself, not as a new notification channel, so it does not conflict with the out-of-scope line. |
| 3 | Administrator is an actor but not a class, so nothing shows who calls `Room.block()` and `Room.unblock()`. The AI suggested adding an `Administrator` class linked to `Room`. | `class.puml`, `Room.block()` / `unblock()`; `use-case.puml`, actor Administrator | Reject (the class); accept (the traceability gap) | An `Administrator` class would have no attributes or behaviour that any story needs, and user registration is out of scope, so it would be an unjustified element. The actual gap is only traceability. I fixed it with the AI's lighter option, a note on `Room` saying block and unblock are invoked by the Administrator (UC5, UC6, US-06). |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book Room | Booking (startTime, endTime, /duration {0 < duration <= 2h}, startsInFuture()) | Activity decisions "Start time is in the future? (R1)" and "Duration > 0 and <= 2 hours? (R1)"; both reject the request on [no] |
| R2 | Book Room (also View Room Availability, Cancel Booking) | Booking (status, overlapsWith(), isActive()), Room (isAvailable()), note on Booking: only ACTIVE bookings count, touching allowed (A1) | Activity decision "Overlaps an active booking? (R2)"; reject with "slot already booked" on [yes] |
| R3 | Book Room (also Block Room, Unblock Room, View Room Availability) | Room (blocked, block(), unblock(), isAvailable() returns false if blocked) | Activity decision "Room is blocked? (R3)"; reject with "room is blocked" on [yes] |
| R4 | Book Room | Booking, Confirmation (confirmationId, issuedAt, type = BOOKING); only a successful booking has one | Activity actions "Generate confirmation (R4)" and "Show confirmation to Student" after "Create booking with status ACTIVE" |
| US-01 | View Room Availability | Room (blocked, isAvailable()), Booking (status, startTime, endTime) | Calls Room.isAvailable(start, end), which applies R2 and R3 |
| US-02 | Book Room | Student, Booking, Room, Confirmation | Activity diagram "Book Room", from submit request to show confirmation (R1-R4) |
| US-03 | Cancel Booking | Student (studentId), Booking (status, cancel(), isActive()) | Action Booking.cancel(): status ACTIVE -> CANCELLED, which frees the slot for R2. Precondition: the Student owns the booking |
| US-04 | Book Room | Booking, Confirmation (type = BOOKING) | Action "Generate confirmation (R4)" in the Book Room activity diagram |
| US-05 | Cancel Booking | Booking, Confirmation (type = CANCELLATION, exists only when status = CANCELLED) | Success guarantee in the UC3 note: a cancellation confirmation is produced |
| US-06 | Block Room | Room (blocked, block()); Administrator invokes it | Room.block() sets blocked = true; existing bookings stay valid (A2); R3 is enforced in the Book Room decision |
| US-06 | Unblock Room | Room (blocked, unblock()); Administrator invokes it | Room.unblock() sets blocked = false; the room can be booked again |
| US-07 | Review Room Usage | Booking (startTime, endTime, status), Room; usage is derived from Bookings over the chosen period | No activity diagram. Covered by the use case and the UC6 note "US-07: usage over a chosen period" |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | Use case (`use-case.puml`) | Note on UC2 (Book Room) cited only R4 and A1. | Note lists US-02, US-04 and R1, R2, R3, R4 (with A1 for touching bookings). | US-02 maps to R1-R4 in the approved stories, so the use case must show all four rules. |
| 2 | Use case (`use-case.puml`) | Use cases numbered UC1, UC2, UC3, UC5, UC6, UC7 (no UC4); the last one was named "View Room Usage Report". | Renumbered UC1-UC6; "View Room Usage Report" renamed "Review Room Usage", with a note "US-07: usage over a chosen period". | The gap in numbering looked like a missing use case, and "Report" implied an artifact that does not exist in the model. The new name matches US-07 and the scenario ("review usage"). |
| 3 | Class (`class.puml`) | `Confirmation` linked 1:1 to `Booking`, with no type; the note said only a successful booking has a confirmation. | Added `enum ConfirmationType { BOOKING, CANCELLATION }` and `- type : ConfirmationType` on `Confirmation`; association changed to `Booking "1" -- "1..2" Confirmation`. | US-05 requires a confirmation when a booking is cancelled, which the 1:1 association could not represent. |
| 4 | Class (`class.puml`) | R1 appeared only in the note on `Booking`; `Student` had a `name` attribute; `Room` had no link to the Administrator. | `/ duration : Duration {0 < duration <= 2h}` and `+ startsInFuture(now : DateTime)` added to `Booking`; `Student.name` removed; `Room` note says block/unblock are invoked by the Administrator (US-06). | R1 needed a model element, `name` is not used by any story (registration is out of scope), and the note closes the traceability gap without adding an unjustified `Administrator` class. |
| 5 | Activity (`activity.puml`) | Only R2 and A1 were labelled; the reject message said "room is out of service" while the decision said "blocked". | Each decision and action is tagged: "Start time is in the future? (R1)", "Duration > 0 and <= 2 hours? (R1)", "Room is blocked? (R3)", "Overlaps an active booking? (R2)", "Generate confirmation (R4)"; reject message changed to "room is blocked (R3)". | Every rule must be traceable from the diagram to §7, and the terminology must match R3 and the class model. |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
AC1  PASS  initial and final nodes present
AC2  PASS  separate decisions check R1, R3 and R2 (4 decisions)
AC3  PASS  every branch has a labelled guard
AC4  PASS  no parallel paths
AC5  PASS  confirmation on success, rejection on failure
AC6  PASS  creation comes after all rule checks
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  4 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 3 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  3 critique issues with a verdict
LR7  FAIL  §8 needs >= 3 rows and one per diagram (rows: 0, missing: use case, class, behaviour)
CS1  PASS  7 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  FAIL  use case(s) with no §7 row tracing to an approved story: View Room Usage Report

SUMMARY pass=33 fail=2 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:**  I don't know what they even mean :)

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
