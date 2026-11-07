import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import type { Booking } from './entities/booking.entity.js';

@ApiTags('bookings')
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('bookings')
  @ApiOperation({ summary: 'List all bookings' })
  @ApiOkResponse({ description: 'Array of bookings' })
  findAll(): Booking[] {
    return this.bookingsService.findAll();
  }

  @Post('showings/:id/bookings')
  @ApiOperation({ summary: 'Book seats for a showing' })
  @ApiCreatedResponse({ description: 'Booking created' })
  @ApiBadRequestResponse({
    description: 'Invalid seats or seats outside hall layout',
  })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  @ApiConflictResponse({ description: 'One or more seats already booked' })
  create(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateBookingDto,
  ): Booking {
    return this.bookingsService.create(id, dto);
  }

  @Get('showings/:id/bookings')
  @ApiOperation({ summary: 'List bookings for a showing' })
  @ApiOkResponse({ description: 'Array of bookings for the showing' })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  findByShowing(@Param('id', ParseUUIDPipe) id: string): Booking[] {
    return this.bookingsService.findByShowing(id);
  }

  @Delete('bookings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiNoContentResponse({ description: 'Booking cancelled' })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.bookingsService.remove(id);
  }
}
