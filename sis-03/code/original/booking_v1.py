def can_book(start, end, now, blocked, existing):
    """Return True only when AC1-AC4 all hold, otherwise False.

    start, end: requested interval in minutes after midnight (start included, end excluded)
    now: current time in minutes after midnight (assumed valid, 0-1439)
    blocked: True if the selected room is blocked
    existing: collection of (start, end) pairs; it is only read, never changed
    """
    # AC3: a blocked room rejects every request
    if blocked:
        return False

    # AC1: 0 <= start < end <= 1440
    if not (0 <= start < end <= 1440):
        return False

    # AC1: start must be strictly after now
    if start <= now:
        return False

    # AC2: at most 120 minutes (exactly 120 is allowed)
    if end - start > 120:
        return False

    # AC4: reject overlap; touching at an endpoint is not an overlap
    for s, e in existing:
        if start < e and s < end:
            return False

    return True
