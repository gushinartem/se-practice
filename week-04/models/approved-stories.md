# Approved stories — Smart Campus study room booking

> **Replace this file's stories with your own Week 03 stories, as revised after review**
> (`week-03/requirements/user-stories.md`), keeping their IDs. If you did not complete Week 03, or
> your set was rejected in review, keep the reference set below and say so in `lab-report.md` §1.
> Either way, the IDs here are the ones your consistency table (§7) must use.

**Source of this set:** <my week-03 stories, revised / the reference set>

## Scenario (from the Lesson 04 practice deck, slide 7)

Students view room availability, book a room, and cancel their own bookings. Administrators block
or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## Reference set

| ID | Story | Rules |
| --- | --- | --- |
| US-01 | As a Student, I want to view which study rooms are free and at what times, so that I can choose a suitable room and time slot before booking. | R2, R3 |
| US-02 | As a Student, I want to reserve a free room for a specific time slot, so that I have a guaranteed space to study individually or with a group. | R1, R2, R3, R4 |
| US-03 | As a Student, I want to cancel a booking I made, so that I can release the room if my plans change and free the slot for others. | R2 |
| US-04 |  As a Student, I want to receive a confirmation when my booking is successful, so that I know my reservation is valid and can plan accordingly. | R4 |
| US-05 | As a Student, I want to receive a confirmation when I cancel a booking, so that I have proof the reservation was released and the room is available to others. | - |
| US-06 | As an Administrator, I want to take a room out of service and later return it to service, so that rooms needing maintenance or repair are not booked by students. | R3 |
| US-07 | As an Administrator, I want to see how rooms are being used over a chosen period, so that I can identify demand patterns and inform decisions about room availability. | - |

**Out of scope** (do not model): payments, equipment in rooms, recurring bookings, waiting lists,
notifications other than the booking confirmation, user registration.
