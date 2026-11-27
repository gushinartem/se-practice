import { test, expect } from 'vitest';
import { canBook } from './booking';

const NOW = 480; // 08:00
const none: { start: number; end: number }[] = [];
const booked = [{ start: 600, end: 660 }]; // 10:00-11:00

test('T01 AC1: start equal to end is rejected', () => {
  expect(canBook({ start: 720, end: 720, now: NOW, blocked: false, bookings: none })).toBe(false);
});

test('T02 AC1: start after end is rejected', () => {
  expect(canBook({ start: 780, end: 720, now: NOW, blocked: false, bookings: none })).toBe(false);
});

test('T03 AC1: a request in the past is rejected', () => {
  expect(canBook({ start: 540, end: 570, now: 600, blocked: false, bookings: none })).toBe(false);
});

test('T04 B1 AC2: exactly 120 minutes (720-840) is available', () => {
  expect(canBook({ start: 720, end: 840, now: NOW, blocked: false, bookings: none })).toBe(true);
});

test('T05 B2 AC2: 121 minutes (720-841) is rejected', () => {
  expect(canBook({ start: 720, end: 841, now: NOW, blocked: false, bookings: none })).toBe(false);
});

test('T06 AC3: a blocked room is rejected even when the time is free', () => {
  expect(canBook({ start: 720, end: 780, now: NOW, blocked: true, bookings: none })).toBe(false);
});

test('T07 B4 AC4: overlapping an existing booking (630-690 vs 600-660) is rejected', () => {
  expect(canBook({ start: 630, end: 690, now: NOW, blocked: false, bookings: booked })).toBe(false);
});

test('T08 B3 AC4: touching the end of a booking (660-720 after 600-660) is available', () => {
  expect(canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: booked })).toBe(true);
});

test('T09 B3 AC4: touching the start of a booking (540-600 before 600-660) is available', () => {
  expect(canBook({ start: 540, end: 600, now: NOW, blocked: false, bookings: booked })).toBe(true);
});

test('T10 AC5: checking does not change the booking data', () => {
  const list = [{ start: 600, end: 660 }];
  const before = JSON.stringify(list);
  canBook({ start: 630, end: 690, now: NOW, blocked: false, bookings: list });
  canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: list });
  expect(JSON.stringify(list)).toBe(before);
});

test('T11 AC5: the same request asked twice gives the same answer', () => {
  const request = { start: 660, end: 720, now: NOW, blocked: false, bookings: booked };
  const first = canBook(request);
  const second = canBook(request);
  expect(first).toBe(true);
  expect(second).toBe(first);
});