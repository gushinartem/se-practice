
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