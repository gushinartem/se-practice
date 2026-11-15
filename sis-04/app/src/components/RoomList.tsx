import type { Room } from '../rooms';

type Props = {
  rooms: Room[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function RoomList({ rooms, selectedId, onSelect }: Props) {
  if (rooms.length === 0) {
    return <p className="empty">No rooms match these requirements. Try fewer attendees or fewer equipment items.</p>;
  }
  return (
    <ul className="rooms">
      {rooms.map(r => (
        <li key={r.id}>
          <button
            type="button"
            className={`room${selectedId === r.id ? ' selected' : ''}`}
            aria-pressed={selectedId === r.id}
            onClick={() => onSelect(r.id)}
          >
            <strong>{r.name}</strong>
            {r.blocked && <span className="tag">blocked</span>}
            <span className="meta">{r.capacity} seats · {r.equipment.join(', ')}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}