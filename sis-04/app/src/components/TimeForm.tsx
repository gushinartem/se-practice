export type TimeValues = { now: string; start: string; end: string; endOfDay: boolean };

type Props = {
  values: TimeValues;
  onChange: (patch: Partial<TimeValues>) => void;
};

export default function TimeForm({ values, onChange }: Props) {
  return (
    <div className="row">
      <label>Current time
        <input type="time" value={values.now} onChange={e => onChange({ now: e.target.value })} />
      </label>
      <label>Start
        <input type="time" value={values.start} onChange={e => onChange({ start: e.target.value })} />
      </label>
      <label>End
        <input type="time" value={values.end} disabled={values.endOfDay} onChange={e => onChange({ end: e.target.value })} />
      </label>
      <label className="inline">
        <input type="checkbox" checked={values.endOfDay} onChange={e => onChange({ endOfDay: e.target.checked })} /> Ends at 24:00
      </label>
    </div>
  );
}