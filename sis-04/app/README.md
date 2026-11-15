# Smart Campus Room Availability Checker

A small React + TypeScript + Vite app. It holds a fictional catalog of 5 rooms, filters them by capacity and equipment, and checks whether a chosen room is available for a time range. Fictional data only: no login, payments, live APIs or database.

## Setup

```text
npm install
```

## Run

```text
npm run dev
```

Then open http://localhost:5173/ in the browser.

## Test

```text
npx vitest run
```

The suite has 26 tests in three files (`booking.test.ts`, `checkRoom.test.ts`, `filter.test.ts`). They import the real modules and use their own fixed catalog, not the page's demo data.

## Build

```text
npm run build
```

## Structure (`src/`)

| File | What it does |
| --- | --- |
| `rooms.ts` | The `Room` type and `ROOMS`: data only. |
| `booking.ts` | `isValidRange`, `canBook` (AC1-AC5) and `checkRoom` (the chosen room's own data; F3, F5). |
| `filter.ts` | `filterRooms` (F1 capacity, F2 all selected equipment). |
| `time.ts` | `toMinutes` and `fmt` time helpers. |
| `App.tsx` | The page: state and calls to the rules. No room data and no rules. |
| `components/` | `FilterPanel`, `RoomList`, `TimeForm`, `ResultPanel`, `BookingsList`: presentation only. |