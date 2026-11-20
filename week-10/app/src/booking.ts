export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return false;
  }

  if (start < 0 || end > 1440) {
    return false;
  }
  if (start >= end) {
    return false;
  }
  if (start <= now) {
    return false;
  }

  if (end - start > 120) {
    return false;
  }

  if (blocked) {
    return false;
  }

  if (bookings.some((b) => start < b.end && b.start < end)) {
    return false;
  }

  return true;
}