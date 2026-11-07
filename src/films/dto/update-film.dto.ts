import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class UpdateFilmDto {
  @ApiPropertyOptional({ example: 'Inception' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ example: 148 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 2010 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  releaseYear?: number;
}
