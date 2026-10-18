import { Lock, Users, MapPin } from "lucide-react";
import type { Room } from "../types";

interface RoomCardProps {
  room: Room;
  selected: boolean;
  onSelect: () => void;
  bookingCount: number;
}

export function RoomCard({ room, selected, onSelect, bookingCount }: RoomCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={room.blocked}
      aria-pressed={selected}
      className={`group relative flex w-full flex-col gap-1 rounded-xl border p-3 text-left transition disabled:cursor-not-allowed ${
        selected
          ? "border-sky-500 bg-sky-50 ring-2 ring-sky-300"
          : room.blocked
          ? "border-slate-200 bg-slate-50 opacity-70"
          : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-slate-800">{room.name}</span>
        {room.blocked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
            <Lock size={11} /> Blocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
            {bookingCount} booked
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <MapPin size={12} /> {room.building}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users size={12} /> {room.capacity} seats
        </span>
      </div>
    </button>
  );
}
