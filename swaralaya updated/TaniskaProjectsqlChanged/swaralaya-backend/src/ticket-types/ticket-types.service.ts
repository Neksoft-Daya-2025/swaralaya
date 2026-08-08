import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketType } from './ticket-type.entity';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';
import { Event } from '../events/event.entity';

const LEGACY_DEFAULT_TICKET_NAME = ['General', 'Admission'].join(' ');

@Injectable()
export class TicketTypesService implements OnModuleInit {
  constructor(
    @InjectRepository(TicketType)
    private readonly ticketTypeRepo: Repository<TicketType>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async onModuleInit() {
    await this.ticketTypeRepo.update(
      { name: LEGACY_DEFAULT_TICKET_NAME },
      { name: 'Event Ticket' },
    );
  }

  async create(dto: CreateTicketTypeDto): Promise<TicketType> {
    const event = await this.eventRepo.findOne({ where: { id: dto.eventId } });
    if (!event) {
      throw new NotFoundException(`Event ${dto.eventId} not found`);
    }

    const ticketType = this.ticketTypeRepo.create({
      eventId: dto.eventId,
      name: this.normalizeName(dto.name),
      description: dto.description ?? null,
      price: dto.price ?? 0,
      quantity: dto.quantity ?? 0,
      countsTowardsCapacity: dto.countsTowardsCapacity ?? true,
      maxPerBooking: dto.maxPerBooking ?? null,
      sortOrder: dto.sortOrder ?? 0,
      active: dto.active ?? true,
    });

    return this.ticketTypeRepo.save(ticketType);
  }

  findAll(eventId?: string): Promise<TicketType[]> {
    return this.ticketTypeRepo.find({
      where: eventId ? { eventId } : undefined,
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TicketType> {
    const ticketType = await this.ticketTypeRepo.findOne({ where: { id } });
    if (!ticketType) {
      throw new NotFoundException(`Ticket type ${id} not found`);
    }
    return ticketType;
  }

  async update(id: string, dto: UpdateTicketTypeDto): Promise<TicketType> {
    const ticketType = await this.findOne(id);
    Object.assign(ticketType, dto);
    ticketType.name = this.normalizeName(ticketType.name);
    return this.ticketTypeRepo.save(ticketType);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.ticketTypeRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ticket type ${id} not found`);
    }
    return { message: 'Ticket type deleted successfully' };
  }

  private normalizeName(name: string): string {
    return name.trim().toLowerCase() === LEGACY_DEFAULT_TICKET_NAME.toLowerCase()
      ? 'Event Ticket'
      : name;
  }
}
