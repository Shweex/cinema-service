import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { HallsService } from '../halls/halls.service.js';
import { ShowingsService } from '../showings/showings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { Booking, BookingSeat } from './entities/booking.entity.js';

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];

  constructor(
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: ShowingsService,
    private readonly hallsService: HallsService,
  ) {}

  findAll(): Booking[] {
    return this.bookings.map((booking) => this.clone(booking));
  }

  findByShowing(showingId: string): Booking[] {
    this.showingsService.findEntity(showingId);
    return this.bookings
      .filter((booking) => booking.showingId === showingId)
      .map((booking) => this.clone(booking));
  }

  create(showingId: string, dto: CreateBookingDto): Booking {
    const showing = this.showingsService.findEntity(showingId);
    const hall = this.hallsService.findOne(showing.hallId);

    for (const seat of dto.seats) {
      if (!this.hallsService.isSeatInHall(hall, seat.row, seat.seat)) {
        throw new BadRequestException(
          `Seat row ${seat.row} seat ${seat.seat} is outside hall layout (${hall.rows}x${hall.seatsPerRow})`,
        );
      }
    }

    const bookedKeys = new Set(
      this.getBookedSeatsForShowing(showingId).map(
        (seat) => `${seat.row}:${seat.seat}`,
      ),
    );

    const conflicting = dto.seats.find((seat) =>
      bookedKeys.has(`${seat.row}:${seat.seat}`),
    );
    if (conflicting) {
      throw new ConflictException(
        `Seat row ${conflicting.row} seat ${conflicting.seat} is already booked for this showing`,
      );
    }

    const booking: Booking = {
      id: randomUUID(),
      showingId,
      seats: dto.seats.map((seat) => ({ row: seat.row, seat: seat.seat })),
      totalPrice: showing.price * dto.seats.length,
    };
    this.bookings.push(booking);
    return this.clone(booking);
  }

  remove(id: string): void {
    const index = this.bookings.findIndex((booking) => booking.id === id);
    if (index === -1) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    this.bookings.splice(index, 1);
  }

  getBookedSeatsForShowing(showingId: string): BookingSeat[] {
    return this.bookings
      .filter((booking) => booking.showingId === showingId)
      .flatMap((booking) => booking.seats);
  }

  private clone(booking: Booking): Booking {
    return {
      id: booking.id,
      showingId: booking.showingId,
      seats: booking.seats.map((seat) => ({ row: seat.row, seat: seat.seat })),
      totalPrice: booking.totalPrice,
    };
  }
}
