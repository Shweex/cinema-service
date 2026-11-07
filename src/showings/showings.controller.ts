import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BOOKINGS_SERVICE } from '../common/tokens.js';
import type { BookingsService } from '../bookings/bookings.service.js';
import { CreateShowingDto } from './dto/create-showing.dto.js';
import { QueryShowingsDto } from './dto/query-showings.dto.js';
import type {
  SeatAvailability,
  Showing,
  ShowingView,
} from './entities/showing.entity.js';
import { ShowingsService } from './showings.service.js';

@ApiTags('showings')
@Controller('showings')
export class ShowingsController {
  constructor(
    private readonly showingsService: ShowingsService,
    @Inject(BOOKINGS_SERVICE)
    private readonly bookingsService: BookingsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a showing' })
  @ApiCreatedResponse({ description: 'Showing created' })
  @ApiBadRequestResponse({
    description: 'Invalid body, missing film/hall, or startsAt in the past',
  })
  create(@Body() dto: CreateShowingDto): Showing {
    return this.showingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List showings with optional filters' })
  @ApiOkResponse({ description: 'Sorted array of showings with names' })
  @ApiBadRequestResponse({ description: 'Invalid date query format' })
  findAll(@Query() query: QueryShowingsDto): ShowingView[] {
    return this.showingsService.findAll(query);
  }

  @Get(':id/seats')
  @ApiOperation({ summary: 'Get seat availability for a showing' })
  @ApiOkResponse({ description: 'Seats with isBooked flag' })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  getSeats(@Param('id', ParseUUIDPipe) id: string): SeatAvailability[] {
    const bookedSeats = this.bookingsService.getBookedSeatsForShowing(id);
    return this.showingsService.buildSeatAvailability(id, bookedSeats);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a showing by id' })
  @ApiOkResponse({ description: 'Showing with film and hall names' })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): ShowingView {
    return this.showingsService.findOne(id);
  }
}
