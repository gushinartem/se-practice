import type { Room } from '../rooms';
import { fmt } from '../time';

export default function BookingsList({ room }: { room: Room }) {
  return (
    <>
      <h2>Existing bookings: {room.name}</h2>
      <ul>
        {room.bookings.length
          ? room.bookings.map((b, i) => <li key={i}>{fmt(b.start)}–{fmt(b.end)}</li>)
          : <li>none</li>}
      </ul>
    </>
  );
}