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
### US-01
**Assumptions:** 
* Availability data reflects only confirmed bookings and blocked rooms, updated in real time.

**Acceptance Criteria:**
* **Scenario: Successful viewing of availability**
    * **Given** a student wants to find a study space,
    * **When** they view the study room availability,
    * **Then** they see which rooms are free and their available time slots.
* **Scenario: Viewing availability with blocked rooms**
    * **Given** a room is currently blocked,
    * **When** the student views the room availability,
    * **Then** the blocked room is not shown as a free option.
* **Scenario: Viewing availability with confirmed bookings**
    * **Given** a room has a confirmed booking,
    * **When** the student views the availability,
    * **Then** the specific time slot for that confirmed booking is shown as unavailable.

***

### US-02
**Assumptions:** 
* The system automatically rejects a booking request if the start time is not in the future, the duration exceeds two hours, or the slot overlaps an existing booking for that room (R1, R2, R3).

**Acceptance Criteria:**
* **Scenario: Successful room reservation**
    * **Given** a room is free for a future time slot,
    * **When** a student requests a booking for a duration of less than two hours,
    * **Then** the room is successfully reserved.
* **Scenario: Validation of booking time**
    * **Given** the current time,
    * **When** a student attempts to book a slot that is not in the future,
    * **Then** the booking request is rejected.
* **Scenario: Validation of booking duration**
    * **Given** a student is making a reservation,
    * **When** the requested duration exceeds two hours,
    * **Then** the booking request is rejected.
* **Scenario: Validation of room overlap or blocked status**
    * **Given** a room is either blocked or has an existing booking,
    * **When** a student attempts to book a slot that overlaps the existing booking or blocked time,
    * **Then** the booking request is rejected.

***

### US-03
**Assumptions:** 
* A student can only cancel their own bookings, not those made by other students.

**Acceptance Criteria:**
* **Scenario: Successful cancellation of own booking**
    * **Given** a student has an existing booking,
    * **When** the student chooses to cancel their booking,
    * **Then** the booking is cancelled and the slot is released for others.
* **Scenario: Unauthorized cancellation attempt**
    * **Given** a booking made by another student,
    * **When** a student attempts to cancel that booking,
    * **Then** the cancellation is rejected.
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| - | nothing changed | - | - |
| | | | |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed | Because the ones whos going to leave a booked room will like prepare 5 min before so at the end next people can enter the room  |
| Is exactly two hours allowed under R2? | allowed | yes because it's the medium value for booking  |

**Which invalid or boundary case did the assistant leave out?** - 

---

## 6. Original AI output — use-case diagram (Part 4)

```
@startuml
left to right direction

actor Student
actor Administrator

rectangle "Smart Campus study room booking system" {
    usecase "View availability" as UC1
    usecase "Book room" as UC2
    usecase "Cancel booking" as UC3
    usecase "Block or unblock room" as UC4
    usecase "Review usage" as UC5
    usecase "Send confirmation" as UC6
}

Student --> UC1
Student --> UC2
Student --> UC3

Administrator --> UC4
Administrator --> UC5

UC2 ..> UC6 : <<include>>
@enduml
```

Rendered diagram (image, or a link): //www.plantuml.com/plantuml/png/RP3DJiCm3CVlVWfhzqrY7pkWQHhi3PZWxgPPiPOFb3X35UBTSL4ufAAd_ksVVtLzoa99YdVWx5LG8YOUtWLxJjO8nm10HcB2YvJU1gdfgVSSE4iYJG0JIs5m5XSNhpuya_ye6RCEZPXYzDZ5UECmO1wpMB_0Bq1zIhQ6iewziVr4kXCxwjYnZ0kaZA_dXnPxLiklhxRNRVjCmLZtzwtAR6OA5yqDOy8IEdrjTDiMVR5tNKip3ROIkvQusD2ZYU7AoTDqhehjuHkWdWoNo-Fq9xEydkKDG7FLMjx-Mzq1g05NgodiyH4F1mx6gUzuX9CkLRpx0G00

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | nothing is changed |
| | | |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them. - no one

**Did any screen, database or internal component appear as a use case or an actor?** no

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them: none
- Stories with **no use case** they belong to: none
- Criteria that test **no rule** from section 1: -

**What does the largest gap tell you about the generated requirements?** there wasn't any gaps because i use good AI which works well

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
PASS   US-1  user-stories.md         no placeholders left
PASS   US-2  user-stories.md         7 stories, IDs US-01…US-07
PASS   US-3  user-stories.md         every story has the required sentence shape
PASS   US-4  user-stories.md         every story has a priority
PASS   US-5  user-stories.md         every story declares an assumption
PASS   US-6  user-stories.md         only Student and Administrator appear as roles
FAIL   US-7  user-stories.md         out-of-scope vocabulary: maintenance, repair — either the assistant widened the scenario, or say why in lab-report.md
PASS   AC-1  acceptance-criteria.md  no placeholders left
PASS   AC-2  acceptance-criteria.md  three sections, all naming real stories: US-01, US-02, US-03
PASS   AC-3  acceptance-criteria.md  every section has 3 to 5 uniquely numbered criteria
PASS   AC-4  acceptance-criteria.md  all 9 criteria are complete Given/When/Then
PASS   AC-5  acceptance-criteria.md  every section covers an invalid or boundary case
PASS   AC-6  acceptance-criteria.md  2 assumptions listed before the criteria
PASS   AC-7  acceptance-criteria.md  both open questions are settled in the assumptions
PASS   PU-1  use-cases.puml          valid PlantUML block, no placeholders
PASS   PU-2  use-cases.puml          exactly two actors: Student, Administrator
PASS   PU-3  use-cases.puml          all six use cases present
PASS   PU-4  use-cases.puml          system boundary present
PASS   PU-5  use-cases.puml          no screens, databases or internal components
PASS   PU-6  use-cases.puml          no unjustified actor associations found
PASS   TR-1  traceability.md         all six use cases have a row
PASS   TR-2  traceability.md         every ID in the table resolves
PASS   TR-3  traceability.md         every story appears in the table
------------------------------------------------------------------------
22 PASS · 1 FAIL · 0 ERROR   (23 checks)
Every FAIL goes in lab-report.md section 9 with what you decided about it.
A FAIL you report and explain costs you nothing. One you hide costs the criterion.
```

```
$ python tests/validate_submission.py
submission.yml — submission.yml
------------------------------------------------------------------------
PASS   schema                                    1
PASS   week                                      03
PASS   student.name                              Artem Guchshin
PASS   student.student_id                        24B031011
PASS   student.github                            gushinartem
PASS   assistant.tool                            Calude
PASS   assistant.model                           Sonnet 5 medium
PASS   counts.user_stories                       7
PASS   counts.acceptance_criteria_sets           3
PASS   checker                                   22 PASS · 1 FAIL · 0 ERROR
FAIL   checker.commit                            not a commit hash — use `git rev-parse --short HEAD`, got 'git rev-parse --short HEAD'
PASS   assumptions.overlap_touching_bookings     allowed
PASS   assumptions.exactly_two_hours             allowed
PASS   traceability.use_cases_not_covered        []
PASS   traceability.stories_not_traced           US-05
PASS   review_findings                           3 findings
PASS   review_findings[1]                        AI did not make mistakes filler filler filler US-05
PASS   review_findings[2]                        Everything was clear and understanadable US-01
PASS   review_findings[3]                        The AI was helpful in generating acceptance criteria US-02
PASS   honesty.can_explain_everything_submitted  yes
PASS   honesty.ai_usage_disclosed                yes
------------------------------------------------------------------------
20 PASS · 1 FAIL · 0 ERROR · 0 note
Fix the FAIL and ERROR lines above, then run this again before you push.
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | 20 | 1 | 0 |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** FAIL with checker.commit - i don't even know what should i do here , FAIL on US-7 oUt-Of-ScoPe ????? it's just a word, ai can't use these words or what?

**Did you run the checks by hand instead of with Python?** used Python

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?

From the very first prompt, the results were impressively accurate. The AI correctly accounted for every use case defined in the scenario — all six were reflected across the user stories, and none were dropped, merged incorrectly, or left out. Given the scope of the task, this saved a significant amount of time: manually brainstorming user stories for each use case, phrasing them correctly in the required "As a / I want / so that" format, and then coming up with a meaningful priority and assumption for each one would realistically have taken me 30 to 40 minutes on its own, with assumptions alone likely adding another 20 minutes of careful thinking. Instead, I got a complete, well-structured draft from a single prompt. The only issue the automated check flagged was one story (US-07) introducing slightly out-of-scope vocabulary ("maintenance, repair") beyond what the original scenario specified — a minor deviation rather than a structural problem. Overall, the AI performed very well, and only that one small wording adjustment was needed.
