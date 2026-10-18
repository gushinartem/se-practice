interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  placeholder?: string;
}

export function TimeInput({ label, value, onChange, error, placeholder }: TimeInputProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "HH:MM"}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:ring-red-400"
            : "border-slate-300 focus:ring-sky-400"
        }`}
      />
    </label>
  );
}
