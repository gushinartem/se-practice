export type Interval = { start: number; end: number };

export const MAX_MINUTES = 120;
export const END_OF_DAY = 1440;

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
  bookings: Interval[];
}): boolean {
  if (!(0 <= start && start < end && end <= END_OF_DAY)) return false;
  if (!(start > now)) return false;
  if (end - start > MAX_MINUTES) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}