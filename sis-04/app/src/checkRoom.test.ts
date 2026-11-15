import { test, expect } from 'vitest';
import { checkRoom } from './booking';
import type { Room } from './rooms';

const NOW = 480; // 08:00

const CATALOG: Room[] = [
  { id: 'r1', name: 'Room One', capacity: 10, equipment: [], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'r2', name: 'Room Two', capacity: 20, equipment: [], blocked: false, bookings: [] },
  { id: 'r3', name: 'Room Three', capacity: 30, equipment: [], blocked: true, bookings: [] },
];

test('T12 F3: a blocked room is not available even when its time is free', () => {
  expect(checkRoom(CATALOG, 'r3', { start: 720, end: 780, now: NOW })).toBe(false);
});

test('T13 F5: the same times give different results for different rooms', () => {
  const request = { start: 600, end: 660, now: NOW };
  expect(checkRoom(CATALOG, 'r1', request)).toBe(false);
  expect(checkRoom(CATALOG, 'r2', request)).toBe(true);
});

test('T14 F5: a room is not blocked by the bookings of another room', () => {
  expect(checkRoom(CATALOG, 'r2', { start: 630, end: 690, now: NOW })).toBe(true);
});

test('T15 F5: an unknown room id is not available', () => {
  expect(checkRoom(CATALOG, 'zzz', { start: 720, end: 780, now: NOW })).toBe(false);
});

test('T16 AC5: checkRoom does not change the catalog', () => {
  const before = JSON.stringify(CATALOG);
  checkRoom(CATALOG, 'r1', { start: 630, end: 690, now: NOW });
  checkRoom(CATALOG, 'r2', { start: 720, end: 780, now: NOW });
  expect(JSON.stringify(CATALOG)).toBe(before);
});