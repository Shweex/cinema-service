import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class SeatDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  row: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  seat: number;
}
