# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name: Artem Guchshin
Student ID: 24B031011
GitHub username: gushinartem

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | Claude |
| Exact model name and version | Sonnet 5 medium |
| Date of the session | 27.09.2026 |
| Diagram renderer used | vscode |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```
User Stories — Smart Campus Study Room Booking

1. View Room Availability
As a Student, I want to view which study rooms are free and at what times, so that I can choose a suitable room and time slot before booking.

Priority: High
Assumption: Availability data reflects only confirmed bookings and blocked rooms, updated in real time.

2. Book a Room
As a Student, I want to reserve a free room for a specific time slot, so that I have a guaranteed space to study individually or with a group.

Priority: High
Assumption: The system automatically rejects a booking request if the start time is not in the future, the duration exceeds two hours, or the slot overlaps an existing booking for that room (R1, R2, R3).

3. Cancel a Booking
As a Student, I want to cancel a booking I made, so that I can release the room if my plans change and free the slot for others.

Priority: Medium
Assumption: A student can only cancel their own bookings, not those made by other students.

4. Receive Booking Confirmation
As a Student, I want to receive a confirmation when my booking is successful, so that I know my reservation is valid and can plan accordingly.

Priority: Medium
Assumption: Confirmation is sent through a single channel (e.g., in-app notification or email) immediately after the booking is accepted.

5. Receive Cancellation Confirmation
As a Student, I want to receive a confirmation when I cancel a booking, so that I have proof the reservation was released and the room is available to others.

Priority: Low
Assumption: Cancellation confirmations use the same delivery channel as booking confirmations.

6. Block or Unblock a Room
As an Administrator, I want to take a room out of service and later return it to service, so that rooms needing maintenance or repair are not booked by students.

Priority: High
Assumption: A blocked room cannot accept new bookings while blocked, and existing future bookings on a room being blocked require an administrator decision outside this story's scope (system enforces R4 going forward).

7. Review Room Usage
As an Administrator, I want to see how rooms are being used over a chosen period, so that I can identify demand patterns and inform decisions about room availability.

Priority: Medium
Assumption: Usage data is drawn from completed and cancelled bookings within the selected date range only.
```

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| Kept unchanged because all user stories were perfect with ideal business rules |  | --- | --- |
| | | | |

**Did the assistant invent anything outside the scenario?** No , it didn't 

**How many stories did you end with, and why that number?** 7 , that's the number of stories that ai generated

---

## 4. Original AI output — acceptance criteria (Part 3)

```
(paste here)
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| | | | |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed / not-allowed | |
| Is exactly two hours allowed under R2? | allowed / not-allowed | |

**Which invalid or boundary case did the assistant leave out?**

---

## 6. Original AI output — use-case diagram (Part 4)

```
(paste the PlantUML source exactly as generated)
```

Rendered diagram (image, or a link):

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| | | |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.

**Did any screen, database or internal component appear as a use case or an actor?**

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them:
- Stories with **no use case** they belong to:
- Criteria that test **no rule** from section 1:

**What does the largest gap tell you about the generated requirements?**

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
(paste)
```

```
$ python tests/validate_submission.py
(paste)
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | | | |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
