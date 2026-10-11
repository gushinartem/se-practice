def can_book(start, end, now, blocked, existing):
    # AC1: valid range, and the booking starts strictly after now.
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: duration is at most 120 minutes.
    if end - start > 120:
        return False

    # AC3: the room must not be blocked.
    if blocked:
        return False

    # AC4: no overlap with an existing booking. Half-open intervals mean
    # touching endpoints do not overlap.
    for booked_start, booked_end in existing:
        if start < booked_end and booked_start < end:
            return False

    # AC5: all conditions hold.
    return True