const DAY_END_MINUTES = 1440;

/** Format minutes-since-midnight as HH:MM. */
export function fmt(min: number): string {
  if (Number.isNaN(min)) return "--:--";
  const clamped = Math.max(0, Math.min(DAY_END_MINUTES, Math.round(min)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Parse an HH:MM string into minutes since midnight, or NaN.
 * "24:00" is accepted and means the end of the day (1440).
 * Every other hour above 23 is rejected.
 */
export function parseHHMM(value: string): number {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return NaN;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h === 24 && m === 0) return DAY_END_MINUTES;
  if (h < 0 || h > 23 || m < 0 || m > 59) return NaN;
  return h * 60 + m;
}