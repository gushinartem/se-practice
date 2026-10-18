import type { Booking, Room } from "./types";

export const SAMPLE_ROOMS: Room[] = [
  { id: "r1", name: "Ada Lovelace Hall", building: "Engineering Block A", capacity: 40, blocked: false },
  { id: "r2", name: "Turing Lab 204", building: "Computing Wing", capacity: 24, blocked: false },
  { id: "r3", name: "Curie Auditorium", building: "Science Block C", capacity: 120, blocked: false },
  { id: "r4", name: "Newton Seminar Room", building: "Math Tower", capacity: 16, blocked: true },
  { id: "r5", name: "Da Vinci Studio", building: "Design Hub", capacity: 30, blocked: false },
];

export const SAMPLE_BOOKINGS: Booking[] = [
  { id: "b1", roomId: "r1", start: 540, end: 600, title: "Algorithms 201", owner: "Prof. Hale" },
  { id: "b2", roomId: "r1", start: 720, end: 780, title: "Faculty Sync", owner: "Dean Office" },
  { id: "b3", roomId: "r2", start: 600, end: 660, title: "Robotics Lab", owner: "Prof. Ito" },
  { id: "b4", roomId: "r2", start: 900, end: 960, title: "Open Hack Session", owner: "CS Club" },
  { id: "b5", roomId: "r3", start: 480, end: 540, title: "Guest Lecture", owner: "Events Team" },
  { id: "b6", roomId: "r3", start: 1020, end: 1080, title: "Symposium Prep", owner: "Events Team" },
  { id: "b7", roomId: "r5", start: 630, end: 690, title: "Design Critique", owner: "Studio Lead" },
];
