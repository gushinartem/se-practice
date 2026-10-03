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
| Behaviour diagram | <sequence / activity / both> |
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
<paste>
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
<paste>
```

### 2.4 Focused correction prompts (if you sent any)

```text
<paste, or write "none">
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
| 1 | <element> | <problem> | <rule or story> | <fix> |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | <issue> | <element> | <accept / reject> | <your reason> |
| 2 | <issue> | <element> | <accept / reject> | <your reason> |
| 3 | <issue> | <element> | <accept / reject> | <your reason> |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | <use case> | <classes and attributes> | <message, guard or decision> |
| R2 | <use case> | <classes, note> | <message, guard or decision> |
| R3 | <use case> | <classes and attributes> | <message, guard or decision> |
| R4 | <use case> | <classes> | <message or action> |
| <US-01> | <Book room> | <Student, Booking, Room> | <message or action> |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | <use case> | <before> | <after> | <rule, story or notation reason> |
| 2 | <class> | <before> | <after> | <reason> |
| 3 | <sequence / activity> | <before> | <after> | <reason> |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<paste the full output>
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
