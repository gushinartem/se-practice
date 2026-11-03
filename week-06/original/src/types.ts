export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes since midnight
  end: number; // minutes since midnight
  title: string;
  owner: string;
}

export interface Interval {
  start: number;
  end: number;
}

export type Verdict = "available" | "unavailable" | "pending";

export interface CheckResult {
  verdict: Verdict;
  reasons: string[];
}
