import { useMemo, useState } from "react";
import { Clock, Search, Sparkles } from "lucide-react";
import { SAMPLE_BOOKINGS, SAMPLE_ROOMS } from "./data";
import type { Room } from "./types";
import {
  checkAvailability,
  fmt,
  parseHHMM,
} from "./utils/availability";
import { TimeInput } from "./components/TimeInput";
import { RoomCard } from "./components/RoomCard";
import { VerdictPanel } from "./components/VerdictPanel";
import { RoomSchedule } from "./components/RoomSchedule";

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function defaultCurrent(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function App() {
  const [bookings] = useState(SAMPLE_BOOKINGS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [startStr, setStartStr] = useState("");
  const [endStr, setEndStr] = useState("");
  const [currentTime, setCurrentTime] = useState<number>(defaultCurrent());
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(nowHHMM());
  const [query, setQuery] = useState("");

  const selectedRoom: Room | null =
    SAMPLE_ROOMS.find((r) => r.id === selectedRoomId) ?? null;

  const start = parseHHMM(startStr);
  const end = parseHHMM(endStr);

  const result = useMemo(() => {
    if (!startStr || !endStr) return null;
    return checkAvailability(
      { start, end },
      selectedRoom,
      bookings,
      currentTime
    );
  }, [startStr, endStr, start, end, selectedRoom, bookings, currentTime]);

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_ROOMS;
    return SAMPLE_ROOMS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.building.toLowerCase().includes(q)
    );
  }, [query]);

  const candidate =
    startStr && endStr && !Number.isNaN(start) && !Number.isNaN(end) && start < end
      ? { start, end }
      : null;

  const duration =
    !Number.isNaN(start) && !Number.isNaN(end) && end > start ? end - start : 0;

  const handleCurrentChange = (v: string) => {
    setCurrentTimeStr(v);
    const parsed = parseHHMM(v);
    if (!Number.isNaN(parsed)) setCurrentTime(parsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
            <Sparkles size={14} /> Smart Campus
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Room Availability Checker
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Pick a room and a time window to see whether it's free right now.
            Times use a 24-hour campus clock. Bookings are capped at 120 minutes
            and can't overlap existing ones.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: room picker */}
          <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-800">Rooms</h2>
              <label className="relative flex-1 max-w-[220px]">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search rooms..."
                  className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-xs text-slate-700 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </label>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  selected={room.id === selectedRoomId}
                  onSelect={() => setSelectedRoomId(room.id)}
                  bookingCount={bookings.filter((b) => b.roomId === room.id).length}
                />
              ))}
              {filteredRooms.length === 0 && (
                <p className="col-span-full text-xs text-slate-500">
                  No rooms match "{query}".
                </p>
              )}
            </div>
          </section>

          {/* Right: form + verdict */}
          <section className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">
                  Check a time
                </h2>
                <label className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Clock size={13} /> Campus now
                  <input
                    type="time"
                    value={currentTimeStr}
                    onChange={(e) => handleCurrentChange(e.target.value)}
                    className="ml-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TimeInput
                  label="Start (HH:MM)"
                  value={startStr}
                  onChange={setStartStr}
                  error={!!startStr && Number.isNaN(start)}
                />
                <TimeInput
                  label="End (HH:MM)"
                  value={endStr}
                  onChange={setEndStr}
                  error={!!endStr && Number.isNaN(end)}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>
                  Current campus time:{" "}
                  <strong className="text-slate-700">{fmt(currentTime)}</strong>
                </span>
                {duration > 0 && (
                  <span>
                    Duration:{" "}
                    <strong className="text-slate-700">{duration} min</strong>
                  </span>
                )}
              </div>

              <div className="mt-4">
                <VerdictPanel
                  result={result}
                  room={selectedRoom}
                  start={start}
                  end={end}
                />
              </div>
            </div>

            <RoomSchedule
              room={selectedRoom}
              bookings={bookings}
              candidate={candidate}
            />
          </section>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Fictional sample data. No bookings are actually created or modified.
        </footer>
      </div>
    </div>
  );
}

export default App;
