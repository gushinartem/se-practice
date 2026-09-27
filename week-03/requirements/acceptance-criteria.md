# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

These must settle the two questions the scenario leaves open. Either answer is accepted; no answer
is not.

- **Overlap:** a booking that ends exactly when another begins is allowed.
- **Duration:** a booking of exactly two hours is allowed under R2, because i want that so.

---

## US-01 — <View available rooms>

### AC-01
- **Given** a student wants to find a study space
- **When**  they view the study room availability
- **Then**  they see which rooms are free and their available time slots

### AC-02
- **Given** a room is currently blocked
- **When** the student views the room availability
- **Then** the blocked room is not shown as a free option

### AC-03
- **Given** a room has a confirmed booking
- **When** the student views the availability
- **Then** the specific time slot for that confirmed booking is shown as unavailable

---

## US-02 — <Book a room>

### AC-04
- **Given** a room is free for a future time slot
- **When** a student requests a booking for a duration of less than two hours
- **Then**  the room is successfully reserved

### AC-05
- **Given** the current time
- **When** a student attempts to book a slot that is not in the future
- **Then** the booking request is rejected

### AC-06
- **Given** a student is making a reservation
- **When** the requested duration exceeds two hours
- **Then** the booking request is rejected

---

## US-03 — <Cancel booking>

### AC-07
- **Given** a student has an existing booking
- **When**  the student chooses to cancel their booking
- **Then** the booking is cancelled and the slot is released for others

### AC-08
- **Given** a booking made by another student
- **When** a student attempts to cancel that booking
- **Then** the cancellation is rejected

### AC-09
- **Given** a student hasn't an existing booking
- **When** the student attempt to cancel someone's else
- **Then** the cancellation is rejected
