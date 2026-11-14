import type { Room } from './rooms';

export type Interval = { start: number; end: number };

export const MAX_MINUTES = 120;
export const END_OF_DAY = 1440;

export function isValidRange(start: number, end: number): boolean {
  return 0 <= start && start < end && end <= END_OF_DAY;
}

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
  if (!isValidRange(start, end)) return false;
  if (!(start > now)) return false;
  if (end - start > MAX_MINUTES) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}

export function checkRoom(
  rooms: Room[],
  roomId: string,
  request: { start: number; end: number; now: number },
): boolean {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;
  return canBook({
    start: request.start,
    end: request.end,
    now: request.now,
    blocked: room.blocked,
    bookings: room.bookings,
  });
}