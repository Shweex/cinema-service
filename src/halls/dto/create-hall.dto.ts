import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateHallDto {
  @ApiProperty({ example: 'Red Hall' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 3, description: 'Number of rows' })
  @IsInt()
  @IsPositive()
  rows: number;

  @ApiProperty({ example: 5, description: 'Seats in each row' })
  @IsInt()
  @IsPositive()
  seatsPerRow: number;
}
