import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SHOWINGS_SERVICE } from '../common/tokens.js';
import type { ShowingsService } from '../showings/showings.service.js';
import { CreateHallDto } from './dto/create-hall.dto.js';
import { Hall, HallWithSeats, Seat } from './entities/hall.entity.js';

@Injectable()
export class HallsService {
  private readonly halls: Hall[] = [];

  constructor(
    @Inject(forwardRef(() => SHOWINGS_SERVICE))
    private readonly showingsService: ShowingsService,
  ) {}

  create(dto: CreateHallDto): Hall {
    const nameTaken = this.halls.some((hall) => hall.name === dto.name);
    if (nameTaken) {
      throw new ConflictException(`Hall with name "${dto.name}" already exists`);
    }

    const hall: Hall = {
      id: randomUUID(),
      name: dto.name,
      rows: dto.rows,
      seatsPerRow: dto.seatsPerRow,
    };
    this.halls.push(hall);
    return hall;
  }

  findAll(): Hall[] {
    return [...this.halls];
  }

  findOne(id: string): Hall {
    const hall = this.halls.find((item) => item.id === id);
    if (!hall) {
      throw new NotFoundException(`Hall with id ${id} not found`);
    }
    return hall;
  }

  findOneOrNull(id: string): Hall | null {
    return this.halls.find((item) => item.id === id) ?? null;
  }

  findOneWithSeats(id: string): HallWithSeats {
    const hall = this.findOne(id);
    return {
      ...hall,
      seats: this.buildSeats(hall.rows, hall.seatsPerRow),
    };
  }

  buildSeats(rows: number, seatsPerRow: number): Seat[] {
    const seats: Seat[] = [];
    for (let row = 1; row <= rows; row += 1) {
      for (let seat = 1; seat <= seatsPerRow; seat += 1) {
        seats.push({ row, seat });
      }
    }
    return seats;
  }

  isSeatInHall(hall: Hall, row: number, seat: number): boolean {
    return (
      Number.isInteger(row) &&
      Number.isInteger(seat) &&
      row >= 1 &&
      seat >= 1 &&
      row <= hall.rows &&
      seat <= hall.seatsPerRow
    );
  }

  remove(id: string): void {
    const index = this.halls.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Hall with id ${id} not found`);
    }
    if (this.showingsService.existsByHallId(id)) {
      throw new ConflictException(
        `Hall with id ${id} cannot be deleted because it is referenced by at least one showing`,
      );
    }
    this.halls.splice(index, 1);
  }
}
