import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsService } from '../films/films.service.js';
import { HallsService } from '../halls/halls.service.js';
import { CreateShowingDto } from './dto/create-showing.dto.js';
import { QueryShowingsDto } from './dto/query-showings.dto.js';
import {
  SeatAvailability,
  Showing,
  ShowingView,
} from './entities/showing.entity.js';

export interface BookedSeatRef {
  row: number;
  seat: number;
}

@Injectable()
export class ShowingsService {
  private readonly showings: Showing[] = [];

  constructor(
    @Inject(forwardRef(() => FilmsService))
    private readonly filmsService: FilmsService,
    @Inject(forwardRef(() => HallsService))
    private readonly hallsService: HallsService,
  ) {}

  create(dto: CreateShowingDto): Showing {
    const film = this.filmsService.findOneOrNull(dto.filmId);
    if (!film) {
      throw new BadRequestException(`Film with id ${dto.filmId} not found`);
    }

    const hall = this.hallsService.findOneOrNull(dto.hallId);
    if (!hall) {
      throw new BadRequestException(`Hall with id ${dto.hallId} not found`);
    }

    const startsAtDate = new Date(dto.startsAt);
    if (Number.isNaN(startsAtDate.getTime())) {
      throw new BadRequestException('startsAt must be a valid ISO 8601 date');
    }
    if (startsAtDate.getTime() <= Date.now()) {
      throw new BadRequestException('startsAt must be in the future');
    }

    const showing: Showing = {
      id: randomUUID(),
      filmId: dto.filmId,
      hallId: dto.hallId,
      startsAt: startsAtDate.toISOString(),
      price: dto.price,
    };
    this.showings.push(showing);
    return showing;
  }

  findAll(query: QueryShowingsDto): ShowingView[] {
    let result = [...this.showings];

    if (query.filmId) {
      result = result.filter((showing) => showing.filmId === query.filmId);
    }

    if (query.date) {
      result = result.filter((showing) =>
        showing.startsAt.startsWith(query.date as string),
      );
    }

    result.sort((a, b) => {
      const timeCompare = a.startsAt.localeCompare(b.startsAt);
      if (timeCompare !== 0) {
        return timeCompare;
      }
      return a.id.localeCompare(b.id);
    });

    return result.map((showing) => this.toView(showing));
  }

  findOne(id: string): ShowingView {
    return this.toView(this.findEntity(id));
  }

  findEntity(id: string): Showing {
    const showing = this.showings.find((item) => item.id === id);
    if (!showing) {
      throw new NotFoundException(`Showing with id ${id} not found`);
    }
    return showing;
  }

  findEntityOrNull(id: string): Showing | null {
    return this.showings.find((item) => item.id === id) ?? null;
  }

  buildSeatAvailability(
    id: string,
    bookedSeats: BookedSeatRef[],
  ): SeatAvailability[] {
    const showing = this.findEntity(id);
    const hall = this.hallsService.findOne(showing.hallId);
    const bookedKeys = new Set(
      bookedSeats.map((seat) => `${seat.row}:${seat.seat}`),
    );

    return this.hallsService
      .buildSeats(hall.rows, hall.seatsPerRow)
      .map((seat) => ({
        row: seat.row,
        seat: seat.seat,
        isBooked: bookedKeys.has(`${seat.row}:${seat.seat}`),
      }));
  }

  existsByFilmId(filmId: string): boolean {
    return this.showings.some((showing) => showing.filmId === filmId);
  }

  existsByHallId(hallId: string): boolean {
    return this.showings.some((showing) => showing.hallId === hallId);
  }

  private toView(showing: Showing): ShowingView {
    const film = this.filmsService.findOne(showing.filmId);
    const hall = this.hallsService.findOne(showing.hallId);
    return {
      id: showing.id,
      filmTitle: film.title,
      hallName: hall.name,
      startsAt: showing.startsAt,
      price: showing.price,
    };
  }
}
