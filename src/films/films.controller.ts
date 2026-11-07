import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';
import type { Film } from './entities/film.entity.js';
import { FilmsService } from './films.service.js';

@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a film' })
  @ApiCreatedResponse({ description: 'Film created' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  create(@Body() dto: CreateFilmDto): Film {
    return this.filmsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all films' })
  @ApiOkResponse({ description: 'Array of films' })
  findAll(): Film[] {
    return this.filmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a film by id' })
  @ApiOkResponse({ description: 'Film found' })
  @ApiNotFoundResponse({ description: 'Film not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Film {
    return this.filmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a film' })
  @ApiOkResponse({ description: 'Film updated' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiNotFoundResponse({ description: 'Film not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFilmDto,
  ): Film {
    return this.filmsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a film' })
  @ApiNoContentResponse({ description: 'Film deleted' })
  @ApiNotFoundResponse({ description: 'Film not found' })
  @ApiConflictResponse({
    description: 'Film is referenced by at least one showing',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.filmsService.remove(id);
  }
}
