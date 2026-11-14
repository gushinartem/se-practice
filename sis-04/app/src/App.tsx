import { useState } from 'react';
import { checkRoom, isValidRange, END_OF_DAY } from './booking';
import { filterRooms } from './filter';
import { ROOMS } from './rooms';
import { toMinutes } from './time';
import FilterPanel from './components/FilterPanel';
import RoomList from './components/RoomList';
import TimeForm from './components/TimeForm';
import type { TimeValues } from './components/TimeForm';
import ResultPanel from './components/ResultPanel';
import BookingsList from './components/BookingsList';

const EQUIPMENT = Array.from(new Set(ROOMS.flatMap(r => r.equipment))).sort();

export default function App() {
  const [attendees, setAttendees] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState('a101');
  const [times, setTimes] = useState<TimeValues>({ now: '09:00', start: '11:00', end: '12:00', endOfDay: false });
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const matching = filterRooms(ROOMS, { attendees: Number(attendees) || 0, equipment });
  const room = matching.find(r => r.id === roomId) ?? matching[0] ?? null;

  // Any change to the room, the filter or the times makes the old answer stale.
  function clearFeedback() {
    setResult(null);
    setError('');
  }

  function changeAttendees(value: string) {
    setAttendees(value);
    clearFeedback();
  }

  function toggleEquipment(item: string) {
    setEquipment(current => (current.includes(item) ? current.filter(x => x !== item) : [...current, item]));
    clearFeedback();
  }

  function selectRoom(id: string) {
    setRoomId(id);
    clearFeedback();
  }

  function changeTimes(patch: Partial<TimeValues>) {
    setTimes(current => ({ ...current, ...patch }));
    clearFeedback();
  }

  function check() {
    if (!room) return;
    const { now, start, end, endOfDay } = times;
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
      <FilterPanel
        attendees={attendees}
        equipment={equipment}
        options={EQUIPMENT}
        onAttendees={changeAttendees}
        onToggle={toggleEquipment}
      />
      <RoomList rooms={matching} selectedId={room?.id ?? null} onSelect={selectRoom} />

      <h2>2. Check a time</h2>
      <TimeForm values={times} onChange={changeTimes} />
      <button onClick={check} disabled={!room}>Check availability</button>
      <ResultPanel error={error} result={result} roomName={room?.name ?? null} />

      {room && <BookingsList room={room} />}
    </main>
  );
}