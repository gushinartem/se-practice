import { describe,it, test, expect } from "vitest";
import { canBook } from "./booking";

// Fresh input on every call. Default fixture: now = 540 (09:00),
// blocked = false, one booking 600-660 (10:00-11:00).
function run(
  start: number,
  end: number,
  overrides: Partial<{
    now: number;
    blocked: boolean;
    bookings: { start: number; end: number }[];
  }> = {}
): boolean {
  return canBook({
    start,
    end,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...overrides,
  });
}

describe("AC1: interval bounds and start after now", () => {
  test("T02 AC1: starts now (540-570) is rejected", () => {
    expect(run(540, 570)).toBe(false);
  });

  test("T03 AC1: zero duration (720-720) is rejected", () => {
    expect(run(720, 720)).toBe(false);
  });

  test("T04 AC1: reversed interval (750-720) is rejected", () => {
    expect(run(750, 720)).toBe(false);
  });

  test("T05 AC1: past the end of the day (1380-1441) is rejected", () => {
    expect(run(1380, 1441)).toBe(false);
  });

  test("X1 AC1: first minute after now, touching the booking (541-600) is accepted", () => {
    expect(run(541, 600)).toBe(true);
  });

  test("X2 AC1: ends exactly at the end of the day (1320-1440) is accepted", () => {
    expect(run(1320, 1440)).toBe(true);
  });
});

describe("AC2: maximum 120 minutes", () => {
  test("T06 AC2: exactly 120 minutes (720-840) is accepted", () => {
    expect(run(720, 840)).toBe(true);
  });

  test("T07 AC2: 121 minutes (720-841) is rejected", () => {
    expect(run(720, 841)).toBe(false);
  });
});

describe("AC3: blocked room", () => {
  test("T13 AC3: blocked room (660-720) is rejected", () => {
    expect(run(660, 720, { blocked: true })).toBe(false);
  });

  test("B04 AC3: blocked room with no bookings (630-690) is rejected", () => {
    expect(run(630, 690, { blocked: true, bookings: [] })).toBe(false);
  });
});

describe("AC4: overlap, touching allowed", () => {
  test("T01 AC4: touching after the booking (660-720) is accepted", () => {
    expect(run(660, 720)).toBe(true);
  });

  test("T08 AC4: touching before the booking (570-600) is accepted", () => {
    expect(run(570, 600)).toBe(true);
  });

  test("T09 AC4: partial overlap (630-690) is rejected", () => {
    expect(run(630, 690)).toBe(false);
  });

  test("T10 AC4: interval contains the booking (570-690) is rejected", () => {
    expect(run(570, 690)).toBe(false);
  });

  test("T11 AC4: interval inside the booking (615-645) is rejected", () => {
    expect(run(615, 645)).toBe(false);
  });

  test("T12 AC4: identical interval (600-660) is rejected", () => {
    expect(run(600, 660)).toBe(false);
  });

  test("T14 AC4: no bookings (630-690) is accepted", () => {
    expect(run(630, 690, { bookings: [] })).toBe(true);
  });

  test("B01 AC4: overlaps only the second of two bookings (740-800) is rejected", () => {
    const bookings = [
      { start: 600, end: 660 },
      { start: 700, end: 760 },
    ];
    expect(run(740, 800, { bookings })).toBe(false);
  });

  test("B02 AC4: fits exactly between two bookings, touching both (660-700) is accepted", () => {
    const bookings = [
      { start: 600, end: 660 },
      { start: 700, end: 760 },
    ];
    expect(run(660, 700, { bookings })).toBe(true);
  });

  test("B03 AC4: overlaps the booking by one minute (659-661) is rejected", () => {
    expect(run(659, 661)).toBe(false);
  });
});

describe("AC5: the decision does not change the booking data", () => {
  test("AC5: an Available request leaves the bookings unchanged", () => {
    const bookings = [
      { start: 600, end: 660 },
      { start: 780, end: 840 },
    ];
    const before = structuredClone(bookings);

    const result = canBook({
      start: 660,
      end: 720,
      now: 540,
      blocked: false,
      bookings,
    });

    expect(result).toBe(true);
    expect(bookings).toEqual(before);
  });

  test("B05 AC5: an Unavailable request also leaves the bookings unchanged", () => {
    const bookings = [{ start: 600, end: 660 }];
    const before = structuredClone(bookings);

    const result = canBook({
      start: 630,
      end: 690,
      now: 540,
      blocked: false,
      bookings,
    });

    expect(result).toBe(false);
    expect(bookings).toEqual(before);
  });
});



describe("BUG regression tests (Week 08)", () => {
  it("BUG-A AC4: a request touching bookings on both sides (660-720) is Available", () => {
    const bookings = [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ];
    const result = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });
    expect(result).toBe(true);
  });

  it("BUG-B AC5: an Available request that touches nothing (720-780) leaves bookings unchanged", () => {
    const bookings = [{ start: 600, end: 660 }];
    const before = JSON.parse(JSON.stringify(bookings));
    const result = canBook({ start: 720, end: 780, now: 540, blocked: false, bookings });
    expect(result).toBe(true);
    expect(bookings).toEqual(before);
  });
});