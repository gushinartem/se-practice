import { describe, it, expect } from "vitest";
import { canBook } from "../src/booking";

type Booking = { start: number; end: number };

// Fresh fixture for every call. No shared mutable state between tests.
function makeInput(
  overrides: Partial<{
    start: number;
    end: number;
    now: number;
    blocked: boolean;
    bookings: Booking[];
  }> = {}
) {
  return {
    start: 0,
    end: 0,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...overrides,
  };
}

describe("canBook: case table (AC1-AC4)", () => {
  // [id, start, end, overrides, expected, ac]
  const cases: Array<[string, number, number, Record<string, unknown>, boolean, string]> = [
    ["T01", 660, 720, {}, true, "AC4"],
    ["T02", 540, 570, {}, false, "AC1"],
    ["T03", 720, 720, {}, false, "AC1"],
    ["T04", 750, 720, {}, false, "AC1"],
    ["T05", 1380, 1441, {}, false, "AC1"],
    ["T06", 720, 840, {}, true, "AC2"],
    ["T07", 720, 841, {}, false, "AC2"],
    ["T08", 570, 600, {}, true, "AC4"],
    ["T09", 630, 690, {}, false, "AC4"],
    ["T10", 570, 690, {}, false, "AC4"],
    ["T11", 615, 645, {}, false, "AC4"],
    ["T12", 600, 660, {}, false, "AC4"],
    ["T13", 660, 720, { blocked: true }, false, "AC3"],
    ["T14", 630, 690, { bookings: [] }, true, "AC4"],
    ["X1", 541, 600, {}, true, "AC1"],
    ["X2", 1320, 1440, {}, true, "AC1"],
  ];

  it.each(cases)("%s (%i-%i) returns %s [%s]", (_id, start, end, overrides, expected) => {
    const input = makeInput({ start, end, ...overrides });
    const result = canBook(input);
    expect(result).toBe(expected);
  });
});

describe("canBook: AC5 - decision does not change booking data", () => {
  it("returns true for an available request and leaves bookings byte-for-byte equal", () => {
    const bookings: Booking[] = [
      { start: 600, end: 660 },
      { start: 780, end: 840 },
    ];
    const before = structuredClone(bookings);
    const input = makeInput({ start: 660, end: 720, bookings });

    const result = canBook(input);

    expect(result).toBe(true);
    expect(input.bookings).toEqual(before);
    expect(input.bookings).toHaveLength(before.length);
    expect(input.bookings[0]).toBe(bookings[0]); // same object, not replaced
  });

  it("leaves bookings unchanged for an unavailable request too", () => {
    const bookings: Booking[] = [{ start: 600, end: 660 }];
    const before = structuredClone(bookings);
    const input = makeInput({ start: 630, end: 690, bookings });

    expect(canBook(input)).toBe(false);
    expect(input.bookings).toEqual(before);
  });
});