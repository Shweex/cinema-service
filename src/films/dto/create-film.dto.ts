import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({ example: 'Inception' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ example: 148, description: 'Duration in minutes' })
  @IsInt()
  @IsPositive()
  durationMinutes: number;

  @ApiProperty({ example: 2010 })
  @IsInt()
  @IsPositive()
  releaseYear: number;
}
