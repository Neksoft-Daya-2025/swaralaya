import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  // GET /api/events — public, returns published events
  @Get()
  getAllEvents(@Query('all') all: string) {
    const onlyPublished = all !== 'true';
    return this.eventsService.findAll(onlyPublished);
  }

  // GET /api/events/:id — public, returns single event
  @Get(':id')
  getSingleEvent(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  // POST /api/events — protected, create event
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniquePart = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = extname(file.originalname);
        callback(null, `event-${uniquePart}${fileExtension}`);
      },
    }),
  }))
  createEvent(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      body.image = `/uploads/${file.filename}`;
    }

    // Convert published status from string to boolean
    if (body.published !== undefined) {
      body.published = body.published === 'true' || body.published === true;
    }
    this.parseTicketFields(body);

    return this.eventsService.create(body);
  }

  // PUT /api/events/:id — protected, update event
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniquePart = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = extname(file.originalname);
        callback(null, `event-${uniquePart}${fileExtension}`);
      },
    }),
  }))
  updateEvent(@Param('id') id: string, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      body.image = `/uploads/${file.filename}`;
    }

    // Convert published status from string to boolean
    if (body.published !== undefined) {
      body.published = body.published === 'true' || body.published === true;
    }
    this.parseTicketFields(body);

    return this.eventsService.update(id, body);
  }

  // DELETE /api/events/:id — protected, delete event
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteEvent(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  private parseTicketFields(body: any) {
    delete body.ticketsSold;
    delete body.ticketsRemaining;

    if (body.ticketPrice !== undefined) {
      body.ticketPrice = Math.max(0, Number(body.ticketPrice) || 0);
    }
    if (body.ticketCapacity !== undefined) {
      body.ticketCapacity = Math.max(
        0,
        Math.floor(Number(body.ticketCapacity) || 0),
      );
    }
  }
}