import type { Booking, Room } from "../types";
import { fmt } from "../utils/availability";

interface RoomScheduleProps {
  room: Room | null;
  bookings: Booking[];
  candidate: { start: number; end: number } | null;
}

const START_HOUR = 8;
const END_HOUR = 20;
const DAY_START = START_HOUR * 60;
const DAY_END = END_HOUR * 60;

function position(min: number): number {
  const span = DAY_END - DAY_START;
  const clamped = Math.max(DAY_START, Math.min(DAY_END, min));
  return ((clamped - DAY_START) / span) * 100;
}

export function RoomSchedule({ room, bookings, candidate }: RoomScheduleProps) {
  if (!room) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Select a room to see its daily schedule.
      </div>
    );
  }

  const roomBookings = bookings
    .filter((b) => b.roomId === room.id)
    .sort((a, b) => a.start - b.start);

  const hours: number[] = [];
  for (let h = START_HOUR; h <= END_HOUR; h += 2) hours.push(h);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-slate-800">
          {room.name} — today
        </h3>
        <span className="text-xs text-slate-500">
          {roomBookings.length} existing booking{roomBookings.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="relative h-16 w-full overflow-hidden rounded-lg bg-slate-100">
        {/* hour gridlines */}
        {hours.map((h) => (
          <div
            key={h}
            className="absolute top-0 bottom-0 border-l border-slate-200"
            style={{ left: `${position(h * 60)}%` }}
          >
            <span className="absolute -top-0.5 left-1 text-[9px] text-slate-400">
              {String(h).padStart(2, "0")}:00
            </span>
          </div>
        ))}

        {/* existing bookings */}
        {roomBookings.map((b) => {
          const left = position(b.start);
          const right = position(b.end);
          const width = Math.max(0, right - left);
          return (
            <div
              key={b.id}
              className="absolute top-5 bottom-2 rounded-md bg-slate-400/80 px-1 text-[9px] leading-tight text-white overflow-hidden whitespace-nowrap"
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${b.title} (${fmt(b.start)}–${fmt(b.end)})`}
            >
              {b.title}
            </div>
          );
        })}

        {/* candidate interval */}
        {candidate && candidate.start < candidate.end && (
          <div
            className="absolute top-5 bottom-2 rounded-md border-2 border-dashed border-sky-500 bg-sky-400/30"
            style={{
              left: `${position(Math.max(candidate.start, DAY_START))}%`,
              width: `${Math.max(
                0,
                position(Math.min(candidate.end, DAY_END)) -
                  position(Math.max(candidate.start, DAY_START))
              )}%`,
            }}
            title={`Candidate ${fmt(candidate.start)}–${fmt(candidate.end)}`}
          />
        )}
      </div>

      <p className="mt-2 text-[11px] text-slate-400">
        Showing 08:00–20:00. Grey blocks are existing bookings; the dashed outline is your candidate slot.
      </p>
    </div>
  );
}
