import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsISO8601, IsPositive, IsUUID } from 'class-validator';

export class CreateShowingDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  filmId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  hallId: string;

  @ApiProperty({
    example: '2030-06-15T18:30:00.000Z',
    description: 'ISO 8601 start datetime in the future',
  })
  @IsISO8601()
  startsAt: string;

  @ApiProperty({
    example: 12500,
    description: 'Ticket price in the smallest currency unit (kopiykas)',
  })
  @IsInt()
  @IsPositive()
  price: number;
}
