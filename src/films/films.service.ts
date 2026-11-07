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
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';
import { Film } from './entities/film.entity.js';

@Injectable()
export class FilmsService {
  private readonly films: Film[] = [];

  constructor(
    @Inject(forwardRef(() => SHOWINGS_SERVICE))
    private readonly showingsService: ShowingsService,
  ) {}

  create(dto: CreateFilmDto): Film {
    const film: Film = {
      id: randomUUID(),
      title: dto.title,
      durationMinutes: dto.durationMinutes,
      releaseYear: dto.releaseYear,
    };
    this.films.push(film);
    return film;
  }

  findAll(): Film[] {
    return [...this.films];
  }

  findOne(id: string): Film {
    const film = this.films.find((item) => item.id === id);
    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    return film;
  }

  findOneOrNull(id: string): Film | null {
    return this.films.find((item) => item.id === id) ?? null;
  }

  update(id: string, dto: UpdateFilmDto): Film {
    const film = this.findOne(id);
    if (dto.title !== undefined) {
      film.title = dto.title;
    }
    if (dto.durationMinutes !== undefined) {
      film.durationMinutes = dto.durationMinutes;
    }
    if (dto.releaseYear !== undefined) {
      film.releaseYear = dto.releaseYear;
    }
    return film;
  }

  remove(id: string): void {
    const index = this.films.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    if (this.showingsService.existsByFilmId(id)) {
      throw new ConflictException(
        `Film with id ${id} cannot be deleted because it is referenced by at least one showing`,
      );
    }
    this.films.splice(index, 1);
  }
}
