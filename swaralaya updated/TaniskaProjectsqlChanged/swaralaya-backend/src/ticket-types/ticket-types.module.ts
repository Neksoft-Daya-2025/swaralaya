import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketType } from './ticket-type.entity';
import { TicketTypesService } from './ticket-types.service';
import { TicketTypesController } from './ticket-types.controller';
import { Event } from '../events/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketType, Event])],
  controllers: [TicketTypesController],
  providers: [TicketTypesService],
  exports: [TicketTypesService, TypeOrmModule],
})
export class TicketTypesModule {}
