export type Booking = { start: number; end: number; label: string };

export type AvailabilityResult =
  | { kind: 'idle' }
  | { kind: 'available'; message: string }
  | { kind: 'unavailable'; message: string; reason: string }
  | { kind: 'invalid'; message: string };

export function toMinutes(time: string): number | null {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

export function toTime(min: number): string {
  const h = Math.floor(min / 60);
  const mm = min % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function overlaps(s1: number, e1: number, s2: number, e2: number): boolean {
  return s1 < e2 && s2 < e1;
}

export function checkAvailability(
  currentMin: number,
  startMin: number,
  endMin: number,
  blocked: boolean,
  bookings: Booking[]
): AvailabilityResult {
  if (startMin < 0 || startMin >= 1440 || endMin < 0 || endMin > 1440) {
    return { kind: 'invalid', message: 'Times must be within the same day (00:00–24:00).' };
  }
  if (endMin <= startMin) {
    return { kind: 'invalid', message: 'End time must be after the start time.' };
  }
  if (startMin <= currentMin) {
    return { kind: 'invalid', message: 'Start time must be strictly after the current time.' };
  }
  const duration = endMin - startMin;
  if (duration > 120) {
    return { kind: 'invalid', message: `Requested duration is ${duration} minutes. Maximum allowed is 120 minutes.` };
  }
  if (blocked) {
    return { kind: 'unavailable', message: 'Room A-101 is blocked and cannot be booked.', reason: 'blocked' };
  }
  for (const b of bookings) {
    if (overlaps(startMin, endMin, b.start, b.end)) {
      return {
        kind: 'unavailable',
        message: `Overlaps existing booking ${toTime(b.start)}–${toTime(b.end)} (${b.label}).`,
        reason: 'overlap',
      };
    }
  }
  return { kind: 'available', message: 'Room A-101 is available for the requested time.' };
}
