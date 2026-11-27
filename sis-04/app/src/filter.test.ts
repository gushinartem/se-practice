import { test, expect } from 'vitest';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import type { Room } from './rooms';

const CATALOG: Room[] = [
  { id: 'r1', name: 'Small', capacity: 8, equipment: ['whiteboard'], blocked: false, bookings: [] },
  { id: 'r2', name: 'Medium', capacity: 12, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'r3', name: 'Large', capacity: 20, equipment: ['projector', 'whiteboard', 'video-conference'], blocked: false, bookings: [] },
  { id: 'r4', name: 'Hall', capacity: 40, equipment: ['projector', 'video-conference'], blocked: true, bookings: [] },
];

const ids = (rooms: Room[]) => rooms.map(r => r.id);

test('T17 F1: only rooms with capacity of at least 10 are kept', () => {
  expect(ids(filterRooms(CATALOG, { attendees: 10, equipment: [] }))).toEqual(['r2', 'r3', 'r4']);
});

test('T18 B5 F1: capacity exactly equal to the attendees (12) is included', () => {
  expect(ids(filterRooms(CATALOG, { attendees: 12, equipment: [] }))).toContain('r2');
});

test('T19 B6 F1: capacity one below the attendees (8 seats for 9) is excluded', () => {
  expect(ids(filterRooms(CATALOG, { attendees: 9, equipment: [] }))).toEqual(['r2', 'r3', 'r4']);
});

test('T20 F2: a room must contain all selected items (projector and whiteboard)', () => {
  expect(ids(filterRooms(CATALOG, { attendees: 1, equipment: ['projector', 'whiteboard'] }))).toEqual(['r2', 'r3']);
});

test('T21 F2: having only one of two selected items is not enough', () => {
  expect(ids(filterRooms(CATALOG, { attendees: 1, equipment: ['whiteboard', 'video-conference'] }))).toEqual(['r3']);
});

test('T22 F2: with no equipment selected every room with enough seats is kept', () => {
  expect(ids(filterRooms(CATALOG, { attendees: 1, equipment: [] }))).toEqual(['r1', 'r2', 'r3', 'r4']);
});

test('T23 F1 F2: capacity and equipment are applied together', () => {
  expect(ids(filterRooms(CATALOG, { attendees: 15, equipment: ['projector', 'whiteboard'] }))).toEqual(['r3']);
});

test('T24 F4: when no room matches the result is an empty list', () => {
  expect(filterRooms(CATALOG, { attendees: 100, equipment: [] })).toEqual([]);
});

test('T25 INT: filterRooms then checkRoom on each returned room', () => {
  const matching = filterRooms(CATALOG, { attendees: 10, equipment: ['projector'] });
  const answers = matching.map(r => checkRoom(CATALOG, r.id, { start: 600, end: 660, now: 480 }));
  // r2 is booked 10:00-11:00, r3 is free, r4 is blocked
  expect(ids(matching)).toEqual(['r2', 'r3', 'r4']);
  expect(answers).toEqual([false, true, false]);
});

test('T26 F1: filterRooms does not change the catalog', () => {
  const before = JSON.stringify(CATALOG);
  filterRooms(CATALOG, { attendees: 10, equipment: ['projector'] });
  expect(JSON.stringify(CATALOG)).toBe(before);
});