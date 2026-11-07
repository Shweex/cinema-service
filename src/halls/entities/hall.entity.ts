export interface Seat {
  row: number;
  seat: number;
}

export interface Hall {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
}

export interface HallWithSeats extends Hall {
  seats: Seat[];
}
