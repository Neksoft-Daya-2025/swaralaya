import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /** Public — create a pending booking (payment wiring comes later). */
  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  /**
   * Admin — list bookings with pagination, filtering, and search.
   * Query: eventId, paymentStatus, status, date (YYYY-MM-DD), search, page, limit
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('eventId') eventId?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingsService.findAll({
      eventId,
      paymentStatus,
      status,
      date,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  /** Public — look up by human-readable reference. */
  @Get('by-reference/:reference')
  findByReference(@Param('reference') reference: string) {
    return this.bookingsService.findByReference(reference);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  /** Admin — resend confirmation email (paid bookings only). */
  @UseGuards(JwtAuthGuard)
  @Post(':id/resend-confirmation')
  resendConfirmation(@Param('id') id: string) {
    return this.bookingsService.resendConfirmationEmail(id);
  }

  /** Admin — cancel booking and release capacity. */
  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancelBooking(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
