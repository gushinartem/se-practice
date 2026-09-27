# User stories — Smart Campus study room booking

6 to 8 stories. Keep the shape exactly: ID, the As/I want/so that sentence, a priority, one
assumption. Roles are **Student** or **Administrator** only.


---

### US-01
**Story:** As a Student, I want to view which study rooms are free and at what times, so that I can choose a suitable room and time slot before booking.
**Priority:** High
**Assumption:** Availability data reflects only confirmed bookings and blocked rooms, updated in real time.

### US-02
**Story:** As a Student, I want to reserve a free room for a specific time slot, so that I have a guaranteed space to study individually or with a group.
**Priority:** High
**Assumption:** The system automatically rejects a booking request if the start time is not in the future, the duration exceeds two hours, or the slot overlaps an existing booking for that room (R1, R2, R3).

### US-03
**Story:** As a Student, I want to cancel a booking I made, so that I can release the room if my plans change and free the slot for others.
**Priority:** Medium
**Assumption:** A student can only cancel their own bookings, not those made by other students.

### US-04
**Story:** As a Student, I want to receive a confirmation when my booking is successful, so that I know my reservation is valid and can plan accordingly.
**Priority:** Medium
**Assumption:** Confirmation is sent through a single channel (e.g., in-app notification or email) immediately after the booking is accepted.

### US-05
**Story:** As a Student, I want to receive a confirmation when I cancel a booking, so that I have proof the reservation was released and the room is available to others.
**Priority:** Low
**Assumption:** Cancellation confirmations use the same delivery channel as booking confirmations.

### US-06
**Story:** As an Administrator, I want to take a room out of service and later return it to service, so that rooms needing maintenance or repair are not booked by students.
**Priority:** High
**Assumption:** A blocked room cannot accept new bookings while blocked, and existing future bookings on a room being blocked require an administrator decision outside this story's scope (system enforces R4 going forward).


### US-07
**Story:** As an Administrator, I want to see how rooms are being used over a chosen period, so that I can identify demand patterns and inform decisions about room availability.
**Priority:** Medium
**Assumption:** Usage data is drawn from completed and cancelled bookings within the selected date range only.

<!-- Add two more blocks in the same shape if you kept 7 or 8 stories. -->
