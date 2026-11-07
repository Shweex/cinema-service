import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { SeatDto } from './seat.dto.js';

export class CreateBookingDto {
  @ApiProperty({ type: [SeatDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  @ArrayUnique((seat: SeatDto) => `${seat.row}:${seat.seat}`, {
    message: 'seats must not contain duplicate places',
  })
  seats: SeatDto[];
}
