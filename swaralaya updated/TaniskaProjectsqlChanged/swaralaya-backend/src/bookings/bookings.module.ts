import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingItem } from './booking-item.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Event } from '../events/event.entity';
import { TicketType } from '../ticket-types/ticket-type.entity';
import { TicketTypesModule } from '../ticket-types/ticket-types.module';
import { MollieModule } from '../mollie/mollie.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingItem, Event, TicketType]),
    TicketTypesModule,
    forwardRef(() => MollieModule),
    EmailModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService, TypeOrmModule],
})
export class BookingsModule {}
