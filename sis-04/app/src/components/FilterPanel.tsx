type Props = {
  attendees: string;
  equipment: string[];
  options: string[];
  onAttendees: (value: string) => void;
  onToggle: (item: string) => void;
};

export default function FilterPanel({ attendees, equipment, options, onAttendees, onToggle }: Props) {
  return (
    <div className="row">
      <label>Attendees
        <input
          type="number"
          min="1"
          value={attendees}
          placeholder="any"
          onChange={e => onAttendees(e.target.value)}
        />
      </label>
      {options.map(item => (
        <label className="inline" key={item}>
          <input type="checkbox" checked={equipment.includes(item)} onChange={() => onToggle(item)} /> {item}
        </label>
      ))}
    </div>
  );
}