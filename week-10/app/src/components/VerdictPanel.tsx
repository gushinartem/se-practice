import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { CheckResult, Room } from "../types";
import { fmt } from "../utils/availability";

interface VerdictPanelProps {
  result: CheckResult | null;
  room: Room | null;
  start: number;
  end: number;
}

export function VerdictPanel({ result, room, start, end }: VerdictPanelProps) {
  if (!result) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 p-4 text-sm text-slate-500">
        <Clock className="text-slate-400" size={20} />
        Pick a room and enter a start and end time to see availability.
      </div>
    );
  }

  const available = result.verdict === "available";

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-4 transition ${
        available
          ? "border-emerald-200 bg-emerald-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {available ? (
          <CheckCircle2 className="text-emerald-600" size={24} />
        ) : (
          <XCircle className="text-red-600" size={24} />
        )}
        <div>
          <p
            className={`text-base font-bold ${
              available ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {available ? "Available" : "Unavailable"}
          </p>
          {room && available && (
            <p className="text-xs text-slate-600">
              {room.name} is free from {fmt(start)} to {fmt(end)}.
            </p>
          )}
        </div>
      </div>

      {!available && result.reasons.length > 0 && (
        <ul className="ml-1 list-disc space-y-1 pl-5 text-sm text-red-700/90">
          {result.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
