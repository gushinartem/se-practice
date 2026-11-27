export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: { start: number; end: number }[]; // minutes after midnight, 600 = 10:00
};

export const ROOMS: Room[] = [
  {
    id: 'a101',
    name: 'Room A-101',
    capacity: 12,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'b204',
    name: 'Room B-204',
    capacity: 30,
    equipment: ['projector', 'whiteboard', 'video-conference'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'c310',
    name: 'Room C-310',
    capacity: 6,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [
      { start: 540, end: 600 },
      { start: 720, end: 780 },
    ],
  },
  {
    id: 'd015',
    name: 'Lab D-015',
    capacity: 24,
    equipment: ['computers', 'projector'],
    blocked: false,
    bookings: [{ start: 780, end: 900 }],
  },
  {
    id: 'e402',
    name: 'Hall E-402',
    capacity: 60,
    equipment: ['projector', 'video-conference'],
    blocked: true,
    bookings: [],
  },
];