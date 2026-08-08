import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  // Find all events from MySQL. Sort newest first.
  async findAll(publishedOnly = false) {
    console.log('Finding events. Published only filter:', publishedOnly);
    
    const where: any = {};
    if (publishedOnly === true) {
      where.published = true;
      where.date = MoreThanOrEqual(new Date().toISOString().slice(0, 10));
    }
    
    const eventList = await this.eventRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
    return eventList.map((event) => this.withAvailability(event));
  }

  // Find one specific event by ID
  async findOne(id: string) {
    console.log(`Finding event with ID: ${id}`);
    const foundEvent = await this.eventRepository.findOne({ where: { id } });
    if (!foundEvent) {
      throw new NotFoundException('Event could not be found');
    }
    return this.withAvailability(foundEvent);
  }

  // Create new event
  async create(data: Partial<Event>) {
    console.log('Creating new event...');
    const newEvent = this.eventRepository.create(data);
    const savedEvent = await this.eventRepository.save(newEvent);
    return this.withAvailability(savedEvent);
  }

  // Edit event details by ID
  async update(id: string, data: Partial<Event>) {
    console.log(`Updating event ID: ${id}`);
    
    // First, verify the event exists
    const existingEvent = await this.eventRepository.findOne({ where: { id } });
    if (!existingEvent) {
      throw new NotFoundException('Event could not be found');
    }

    if (
      data.ticketCapacity !== undefined &&
      Number(data.ticketCapacity) < Number(existingEvent.ticketsSold)
    ) {
      throw new BadRequestException(
        `Ticket capacity cannot be lower than ${existingEvent.ticketsSold} tickets already sold.`,
      );
    }
    
    // Merge the new data onto the existing event
    const updatedEvent = await this.eventRepository.save({
      ...existingEvent,
      ...data,
    });
    
    return this.withAvailability(updatedEvent);
  }

  // Delete event by ID
  async remove(id: string) {
    console.log(`Deleting event ID: ${id}`);
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Event to delete could not be found');
    }
    return { message: 'Event deleted successfully' };
  }

  private withAvailability(event: Event) {
    const ticketCapacity = Number(event.ticketCapacity) || 0;
    const ticketsSold = Number(event.ticketsSold) || 0;

    return {
      ...event,
      ticketPrice: Number(event.ticketPrice) || 0,
      ticketCapacity,
      ticketsSold,
      ticketsRemaining: Math.max(0, ticketCapacity - ticketsSold),
    };
  }
}