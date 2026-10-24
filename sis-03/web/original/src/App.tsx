import { useMemo, useState } from 'react';
import { Clock, DoorClosed, CalendarCheck, CheckCircle2, XCircle, AlertTriangle, MapPin, ListChecks } from 'lucide-react';

type Booking = { start: number; end: number; label: string };

const DATA_SETS: Record<string, Booking[]> = {
  '1': [{ start: 600, end: 660, label: 'Intro to Algorithms' }],
  '2': [
    { start: 600, end: 660, label: 'Intro to Algorithms' },
    { start: 700, end: 760, label: 'Design Workshop' },
  ],
};

const DATASET_OPTIONS = [
  { value: '1', text: 'Data set 1: 10:00–11:00' },
  { value: '2', text: 'Data set 2: 10:00–11:00 and 11:40–12:40' },
];

function toMinutes(time: string): number | null {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function toTime(min: number): string {
  const h = Math.floor(min / 60);
  const mm = min % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function overlaps(s1: number, e1: number, s2: number, e2: number): boolean {
  return s1 < e2 && s2 < e1;
}

type Result =
  | { kind: 'idle' }
  | { kind: 'available'; message: string }
  | { kind: 'unavailable'; message: string; reason: string }
  | { kind: 'invalid'; message: string };

function evaluate(
  currentMin: number,
  startMin: number,
  endMin: number,
  blocked: boolean,
  bookings: Booking[]
): Result {
  if (startMin < 0 || startMin >= 1440 || endMin < 0 || endMin > 1440) {
    return { kind: 'invalid', message: 'Times must be within the same day (00:00–24:00).' };
  }
  if (endMin <= startMin) {
    return { kind: 'invalid', message: 'End time must be after the start time.' };
  }
  if (startMin <= currentMin) {
    return { kind: 'invalid', message: 'Start time must be strictly after the current time.' };
  }
  const duration = endMin - startMin;
  if (duration > 120) {
    return { kind: 'invalid', message: `Requested duration is ${duration} minutes. Maximum allowed is 120 minutes.` };
  }
  if (blocked) {
    return { kind: 'unavailable', message: 'Room A-101 is blocked and cannot be booked.', reason: 'blocked' };
  }
  for (const b of bookings) {
    if (overlaps(startMin, endMin, b.start, b.end)) {
      return {
        kind: 'unavailable',
        message: `Overlaps existing booking ${toTime(b.start)}–${toTime(b.end)} (${b.label}).`,
        reason: 'overlap',
      };
    }
  }
  return { kind: 'available', message: 'Room A-101 is available for the requested time.' };
}

export default function App() {
  const [currentTime, setCurrentTime] = useState('09:00');
  const [blocked, setBlocked] = useState(false);
  const [startTime, setStartTime] = useState('09:30');
  const [endTime, setEndTime] = useState('10:30');
  const [dataset, setDataset] = useState('1');
  const [result, setResult] = useState<Result>({ kind: 'idle' });

  const bookings = DATA_SETS[dataset];

  const durationPreview = useMemo(() => {
    const s = toMinutes(startTime);
    const e = toMinutes(endTime);
    if (s == null || e == null || e <= s) return null;
    return e - s;
  }, [startTime, endTime]);

  const handleCheck = () => {
    const currentMin = toMinutes(currentTime);
    const startMin = toMinutes(startTime);
    const endMin = toMinutes(endTime);
    if (currentMin == null || startMin == null || endMin == null) {
      setResult({ kind: 'invalid', message: 'Please enter valid times in HH:MM format.' });
      return;
    }
    setResult(evaluate(currentMin, startMin, endMin, blocked, bookings));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-emerald-700">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Campus Facilities</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Smart Campus Room Availability Checker
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Check whether Room A-101 is free for a requested time. No booking is created.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <DoorClosed className="h-5 w-5 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-900">Room A-101</h2>
            <span
              className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                blocked ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${blocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
              {blocked ? 'Blocked' : 'Not blocked'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Current time" icon={<Clock className="h-4 w-4" />}>
              <input
                type="time"
                value={currentTime}
                onChange={(e) => setCurrentTime(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Booking data" icon={<ListChecks className="h-4 w-4" />}>
              <select
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                className={inputClass}
              >
                {DATASET_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.text}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Start time" icon={<Clock className="h-4 w-4" />}>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="End time" icon={<Clock className="h-4 w-4" />}>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
            <input
              type="checkbox"
              checked={blocked}
              onChange={(e) => setBlocked(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700">Room blocked</span>
            <span className="text-xs text-slate-400">Treat every request as unavailable</span>
          </label>

          {durationPreview !== null && (
            <p className="mt-3 text-xs text-slate-500">
              Requested duration: <span className="font-semibold text-slate-700">{durationPreview} min</span>
              {durationPreview > 120 && <span className="ml-1 text-red-600">(exceeds 120 min limit)</span>}
            </p>
          )}

          <button
            onClick={handleCheck}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 active:scale-[0.99]"
          >
            <CalendarCheck className="h-4 w-4" />
            Check availability
          </button>

          <ResultBanner result={result} />
        </section>

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Existing bookings for Room A-101</h2>
            <span className="ml-auto text-xs text-slate-400">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
          </div>
          <ul className="space-y-2">
            {bookings.map((b, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{b.label}</p>
                  <p className="text-xs text-slate-500">
                    {toTime(b.start)}–{toTime(b.end)} ({b.end - b.start} min)
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">
            Bookings are fictional and read-only. Checking availability never changes them.
          </p>
        </section>
      </div>
    </div>
  );
}

const inputClass =
  'mt-1 block w-full rounded-lg border-slate-300 px-3 py-2 text-sm text-slate-800 shadow-sm ring-1 ring-inset ring-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500';

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
        <span className="text-slate-400">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

function ResultBanner({ result }: { result: Result }) {
  if (result.kind === 'idle') {
    return (
      <p className="mt-4 text-center text-xs text-slate-400">
        Enter the details above and press “Check availability”.
      </p>
    );
  }

  if (result.kind === 'invalid') {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-lg bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Invalid input</p>
          <p className="text-sm text-amber-700">{result.message}</p>
        </div>
      </div>
    );
  }

  const available = result.kind === 'available';
  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-lg px-4 py-3 ring-1 ${
        available ? 'bg-emerald-50 ring-emerald-200' : 'bg-red-50 ring-red-200'
      }`}
    >
      {available ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      )}
      <div>
        <p className={`text-sm font-bold ${available ? 'text-emerald-800' : 'text-red-800'}`}>
          {available ? 'Available' : 'Unavailable'}
        </p>
        <p className={`text-sm ${available ? 'text-emerald-700' : 'text-red-700'}`}>{result.message}</p>
      </div>
    </div>
  );
}
