import { useState } from 'react';
import { checkRoom, isValidRange, END_OF_DAY } from './booking';
import { filterRooms } from './filter';
import { ROOMS } from './rooms';

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

const EQUIPMENT = Array.from(new Set(ROOMS.flatMap(r => r.equipment))).sort();

export default function App() {
  const [attendees, setAttendees] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const matching = filterRooms(ROOMS, { attendees: Number(attendees) || 0, equipment });
  const room = matching.find(r => r.id === roomId) ?? matching[0] ?? null;

  // Any change to the room, the filter or the times makes the old answer stale.
  function clearFeedback() {
    setResult(null);
    setError('');
  }

  function toggleEquipment(item: string) {
    setEquipment(current => (current.includes(item) ? current.filter(x => x !== item) : [...current, item]));
    clearFeedback();
  }

  function check() {
    if (!room) return;
    if (!start || !now || (!end && !endOfDay)) {
      setResult(null);
      setError('Fill in the current time, the start and the end.');
      return;
    }
    const s = toMinutes(start);
    const e = endOfDay ? END_OF_DAY : toMinutes(end);
    const n = toMinutes(now);
    if (!isValidRange(s, e)) {
      setResult(null);
      setError('The end time must be after the start time.');
      return;
    }
    setError('');
    setResult(checkRoom(ROOMS, room.id, { start: s, end: e, now: n }));
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>

      <h2>1. Find a room</h2>
      <div className="row">
        <label>Attendees
          <input
            type="number"
            min="1"
            value={attendees}
            placeholder="any"
            onChange={e => { setAttendees(e.target.value); clearFeedback(); }}
          />
        </label>
        {EQUIPMENT.map(item => (
          <label className="inline" key={item}>
            <input type="checkbox" checked={equipment.includes(item)} onChange={() => toggleEquipment(item)} /> {item}
          </label>
        ))}
      </div>

      {matching.length === 0 ? (
        <p className="empty">No rooms match these requirements. Try fewer attendees or fewer equipment items.</p>
      ) : (
        <ul className="rooms">
          {matching.map(r => (
            <li key={r.id}>
              <button
                type="button"
                className={`room${room?.id === r.id ? ' selected' : ''}`}
                aria-pressed={room?.id === r.id}
                onClick={() => { setRoomId(r.id); clearFeedback(); }}
              >
                <strong>{r.name}</strong>
                {r.blocked && <span className="tag">blocked</span>}
                <span className="meta">{r.capacity} seats · {r.equipment.join(', ')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>2. Check a time</h2>
      <div className="row">
        <label>Current time
          <input type="time" value={now} onChange={e => { setNow(e.target.value); clearFeedback(); }} />
        </label>
        <label>Start
          <input type="time" value={start} onChange={e => { setStart(e.target.value); clearFeedback(); }} />
        </label>
        <label>End
          <input type="time" value={end} disabled={endOfDay} onChange={e => { setEnd(e.target.value); clearFeedback(); }} />
        </label>
        <label className="inline">
          <input type="checkbox" checked={endOfDay} onChange={e => { setEndOfDay(e.target.checked); clearFeedback(); }} /> Ends at 24:00
        </label>
      </div>
      <button onClick={check} disabled={!room}>Check availability</button>
      {error && <p className="error">{error}</p>}
      {result !== null && room && (
        <p className={`result ${result ? 'available' : 'unavailable'}`}>{room.name}: {result ? 'Available' : 'Unavailable'}</p>
      )}

      {room && (
        <>
          <h2>Existing bookings: {room.name}</h2>
          <ul>{room.bookings.length ? room.bookings.map((b, i) => <li key={i}>{fmt(b.start)}–{fmt(b.end)}</li>) : <li>none</li>}</ul>
        </>
      )}
    </main>
  );
}