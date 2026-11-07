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
import { CreateHallDto } from './dto/create-hall.dto.js';
import type { Hall, HallWithSeats } from './entities/hall.entity.js';
import { HallsService } from './halls.service.js';

@ApiTags('halls')
@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a hall' })
  @ApiCreatedResponse({ description: 'Hall created' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiConflictResponse({ description: 'Hall name already exists' })
  create(@Body() dto: CreateHallDto): Hall {
    return this.hallsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all halls' })
  @ApiOkResponse({ description: 'Array of halls' })
  findAll(): Hall[] {
    return this.hallsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hall with its seats' })
  @ApiOkResponse({ description: 'Hall with seats list' })
  @ApiNotFoundResponse({ description: 'Hall not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): HallWithSeats {
    return this.hallsService.findOneWithSeats(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a hall' })
  @ApiNoContentResponse({ description: 'Hall deleted' })
  @ApiNotFoundResponse({ description: 'Hall not found' })
  @ApiConflictResponse({
    description: 'Hall is referenced by at least one showing',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.hallsService.remove(id);
  }
}
