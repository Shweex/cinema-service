export interface BookingSeat {
  row: number;
  seat: number;
}

export interface Booking {
  id: string;
  showingId: string;
  seats: BookingSeat[];
  totalPrice: number;
}
