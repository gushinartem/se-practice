import type { Booking, CheckResult, Interval, Room } from "../types";

export const MINUTES_PER_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

/** Two intervals overlap if one starts strictly before the other ends. Touching endpoints are allowed. */
export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Evaluate a candidate booking against the acceptance criteria.
 *
 * AC1: 0 <= start < end <= 1440 and start must be after current time.
 * AC2: duration must be <= 120 minutes.
 * AC3: selected room must not be blocked.
 * AC4: interval must not overlap any existing booking (touching endpoints allowed).
 * AC5: returns a decision without mutating booking data.
 */
export function checkAvailability(
  interval: Interval,
  room: Room | null,
  bookings: Booking[],
  currentTime: number
): CheckResult {
  const reasons: string[] = [];
  const { start, end } = interval;

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return { verdict: "unavailable", reasons: ["Enter a valid start and end time."] };
  }

  // AC1: basic ordering and day bounds
  if (start < 0 || end > MINUTES_PER_DAY) {
    reasons.push("Times must stay within the day (00:00 to 24:00).");
  }
  if (start >= end) {
    reasons.push("Start time must be earlier than end time.");
  }
  // AC1: start must be after the supplied current time
  if (start <= currentTime) {
    reasons.push("Start time must be after the current campus time.");
  }

  // AC2: duration cap
  if (end - start > MAX_BOOKING_MINUTES) {
    reasons.push("Bookings cannot be longer than 120 minutes.");
  }

  // AC3: blocked room
  if (!room) {
    reasons.push("Select a room to check.");
  } else if (room.blocked) {
    reasons.push(`${room.name} is currently blocked for maintenance.`);
  }

  // AC4: overlap check (only meaningful if the interval itself is well-formed)
  if (room && start < end && start >= 0 && end <= MINUTES_PER_DAY) {
    const conflicts = bookings.filter(
      (b) => b.roomId === room.id && overlaps(interval, b)
    );
    if (conflicts.length > 0) {
      const first = conflicts[0];
      reasons.push(
        `Overlaps "${first.title}" (${fmt(first.start)}–${fmt(first.end)}).`
      );
    }
  }

  const verdict = reasons.length === 0 ? "available" : "unavailable";
  return { verdict, reasons };
}

/** Format minutes-since-midnight as HH:MM. */
export function fmt(min: number): string {
  if (Number.isNaN(min)) return "--:--";
  const clamped = Math.max(0, Math.min(MINUTES_PER_DAY, Math.round(min)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Parse an HH:MM string into minutes since midnight, or NaN. */
export function parseHHMM(value: string): number {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return NaN;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return NaN;
  return h * 60 + m;
}
