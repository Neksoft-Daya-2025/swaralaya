import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Event } from '../events/event.entity';
import { MollieService } from '../mollie/mollie.service';
import { EmailService } from '../email/email.service';

export interface CreateBookingResult {
  booking: Booking;
  checkoutUrl: string | null;
  paymentRequired: boolean;
}

export interface PaymentSyncResult {
  outcome: 'success' | 'cancelled' | 'failed' | 'pending';
  booking: Booking | null;
  mollieStatus: string | null;
}

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly dataSource: DataSource,
    private readonly mollieService: MollieService,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateBookingDto): Promise<CreateBookingResult> {
    if (dto.attendees.length !== dto.quantity) {
      throw new BadRequestException(
        `Attendee details are required for all ${dto.quantity} tickets.`,
      );
    }

    const savedBooking = await this.dataSource.transaction(async (manager) => {
      const event = await manager.findOne(Event, {
        where: { id: dto.eventId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!event) {
        throw new NotFoundException(`Event ${dto.eventId} not found`);
      }

      const capacity = Number(event.ticketCapacity) || 0;
      const sold = Number(event.ticketsSold) || 0;
      const remaining = Math.max(0, capacity - sold);

      if (dto.quantity > remaining) {
        throw new BadRequestException(`Only ${remaining} tickets are remaining.`);
      }

      const totalAmount = Number(event.ticketPrice) * dto.quantity;
      const booking = manager.create(Booking, {
        bookingReference: this.generateReference(),
        eventId: dto.eventId,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone ?? null,
        notes: dto.notes ?? null,
        attendees: dto.attendees,
        quantity: dto.quantity,
        totalAmount,
        status: BookingStatus.Pending,
        molliePaymentId: null,
        paymentMethod: null,
        paymentStatus: 'pending',
        confirmationEmailSent: false,
      });

      const createdBooking = await manager.save(Booking, booking);
      event.ticketsSold = sold + dto.quantity;
      await manager.save(Event, event);
      return createdBooking;
    });

    const totalAmount = Number(savedBooking.totalAmount);

    // Free booking — confirm immediately
    if (totalAmount <= 0) {
      await this.markBookingPaid(savedBooking.id, {
        status: BookingStatus.Confirmed,
        paymentStatus: 'free',
        paymentMethod: 'free',
      });
      await this.sendConfirmationEmailOnce(savedBooking.id);

      return {
        booking: await this.findOne(savedBooking.id),
        checkoutUrl: null,
        paymentRequired: false,
      };
    }

    // Paid booking — start Mollie checkout
    try {
      const currency = this.mollieService.getCurrency();
      const description = `${this.mollieService.getDescriptionPrefix()} Event Ticket ${savedBooking.bookingReference}`;
      const webhookUrl = this.mollieService.buildWebhookUrl();

      const payment = await this.mollieService.createPayment({
        amount: totalAmount,
        currency,
        description,
        redirectUrl: this.mollieService.buildBookingReturnUrl(savedBooking.id),
        webhookUrl,
        metadata: {
          bookingId: savedBooking.id,
          bookingReference: savedBooking.bookingReference,
        },
      });

      savedBooking.molliePaymentId = payment.id;
      savedBooking.paymentMethod = 'mollie';
      savedBooking.paymentStatus = 'pending';
      await this.bookingRepo.save(savedBooking);

      return {
        booking: await this.findOne(savedBooking.id),
        checkoutUrl: payment.checkoutUrl,
        paymentRequired: true,
      };
    } catch (error) {
      await this.cancelAndReleaseCapacity(savedBooking.id, 'payment_failed');
      this.logger.error(
        `Failed to create Mollie payment for booking ${savedBooking.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        'Unable to start payment right now. Please try again later.',
      );
    }
  }

  /**
   * Sync booking from Mollie (webhook + return). Idempotent.
   * Always re-fetches payment from Mollie — never trusts query params alone.
   */
  async syncPaymentFromMollie(molliePaymentId: string): Promise<PaymentSyncResult> {
    const payment = await this.mollieService.verifyPayment(molliePaymentId);
    const booking = await this.bookingRepo.findOne({
      where: { molliePaymentId },
      relations: ['items', 'items.ticketType', 'event'],
    });

    if (!booking) {
      this.logger.warn(
        `No booking found for Mollie payment ${molliePaymentId}`,
      );
      return {
        outcome: this.mapMollieOutcome(payment.status),
        booking: null,
        mollieStatus: payment.status,
      };
    }

    if (payment.status === 'paid') {
      // Already finalized — ignore duplicate webhook / return
      if (
        booking.status === BookingStatus.Paid ||
        booking.paymentStatus === 'paid'
      ) {
        if (!booking.confirmationEmailSent) {
          await this.sendConfirmationEmailOnce(booking.id);
        }
        return {
          outcome: 'success',
          booking: await this.findOne(booking.id),
          mollieStatus: payment.status,
        };
      }

      await this.markBookingPaid(booking.id, {
        status: BookingStatus.Paid,
        paymentStatus: 'paid',
        paymentMethod: 'mollie',
      });
      await this.sendConfirmationEmailOnce(booking.id);

      return {
        outcome: 'success',
        booking: await this.findOne(booking.id),
        mollieStatus: payment.status,
      };
    }

    if (
      payment.status === 'canceled' ||
      payment.status === 'failed' ||
      payment.status === 'expired'
    ) {
      if (booking.status === BookingStatus.Pending) {
        await this.cancelAndReleaseCapacity(
          booking.id,
          payment.status === 'canceled' ? 'cancelled' : payment.status,
        );
      }

      return {
        outcome: payment.status === 'canceled' ? 'cancelled' : 'failed',
        booking: await this.findOne(booking.id),
        mollieStatus: payment.status,
      };
    }

    booking.paymentStatus = payment.status;
    await this.bookingRepo.save(booking);

    return {
      outcome: 'pending',
      booking: await this.findOne(booking.id),
      mollieStatus: payment.status,
    };
  }

  async syncByBookingId(bookingId: string): Promise<PaymentSyncResult> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }

    if (!booking.molliePaymentId) {
      return {
        outcome:
          booking.status === BookingStatus.Confirmed ||
          booking.status === BookingStatus.Paid
            ? 'success'
            : booking.status === BookingStatus.Cancelled
              ? 'cancelled'
              : 'pending',
        booking: await this.findOne(booking.id),
        mollieStatus: null,
      };
    }

    // Use stored Mollie id — never trust client-supplied payment status
    return this.syncPaymentFromMollie(booking.molliePaymentId);
  }

  async findAll(query: {
    eventId?: string;
    paymentStatus?: string;
    status?: string;
    date?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    data: Booking[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const qb = this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.event', 'event')
      .leftJoinAndSelect('booking.items', 'items')
      .leftJoinAndSelect('items.ticketType', 'ticketType')
      .orderBy('booking.createdAt', 'DESC');

    if (query.eventId) {
      qb.andWhere('booking.eventId = :eventId', { eventId: query.eventId });
    }

    if (query.paymentStatus) {
      qb.andWhere('booking.paymentStatus = :paymentStatus', {
        paymentStatus: query.paymentStatus,
      });
    }

    if (query.status) {
      qb.andWhere('booking.status = :status', { status: query.status });
    }

    if (query.date) {
      qb.andWhere('DATE(booking.createdAt) = :date', { date: query.date });
    }

    const search = query.search?.trim();
    if (search) {
      qb.andWhere(
        `(booking.bookingReference LIKE :search
          OR booking.customerName LIKE :search
          OR booking.customerEmail LIKE :search
          OR booking.id LIKE :search)`,
        { search: `%${search}%` },
      );
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['items', 'items.ticketType', 'event'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }
    return booking;
  }

  /**
   * Admin — resend confirmation email for paid/free bookings.
   * Forces send even if confirmationEmailSent is already true.
   * On failure, leaves confirmationEmailSent unchanged (or false) for later retry.
   */
  async resendConfirmationEmail(id: string): Promise<Booking> {
    const booking = await this.findOne(id);

    const isPaid =
      booking.paymentStatus === 'paid' ||
      booking.paymentStatus === 'free' ||
      booking.status === BookingStatus.Paid ||
      booking.status === BookingStatus.Confirmed;

    if (!isPaid) {
      throw new BadRequestException(
        'Confirmation email can only be resent when payment is paid.',
      );
    }

    try {
      await this.emailService.sendBookingConfirmation(booking);
      booking.confirmationEmailSent = true;
      await this.bookingRepo.save(booking);
      this.logger.log(
        `Confirmation email resent for booking ${booking.bookingReference}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to resend booking confirmation for ${booking.bookingReference}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        'Failed to send confirmation email. It can be retried later.',
      );
    }

    return this.findOne(id);
  }

  /** Admin — cancel booking and release reserved capacity. */
  async cancelBooking(id: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.Cancelled) {
      throw new BadRequestException('Booking is already cancelled.');
    }

    const nextPaymentStatus =
      booking.paymentStatus === 'pending'
        ? 'cancelled'
        : booking.paymentStatus;

    await this.cancelAndReleaseCapacity(id, nextPaymentStatus);
    return this.findOne(id);
  }

  async findByReference(reference: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { bookingReference: reference },
      relations: ['items', 'items.ticketType', 'event'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking reference ${reference} not found`);
    }
    return booking;
  }

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    Object.assign(booking, dto);
    await this.bookingRepo.save(booking);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.dataSource.transaction(async (manager) => {
      const booking = await manager.findOne(Booking, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!booking) {
        throw new NotFoundException(`Booking ${id} not found`);
      }

      if (booking.status !== BookingStatus.Cancelled) {
        const event = await manager.findOne(Event, {
          where: { id: booking.eventId },
          lock: { mode: 'pessimistic_write' },
        });
        if (event) {
          event.ticketsSold = Math.max(
            0,
            Number(event.ticketsSold) - booking.quantity,
          );
          await manager.save(Event, event);
        }
      }

      await manager.delete(Booking, id);
    });
    return { message: 'Booking deleted successfully' };
  }

  private async cancelAndReleaseCapacity(
    bookingId: string,
    paymentStatus: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const booking = await manager.findOne(Booking, {
        where: { id: bookingId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!booking || booking.status === BookingStatus.Cancelled) {
        return;
      }

      const event = await manager.findOne(Event, {
        where: { id: booking.eventId },
        lock: { mode: 'pessimistic_write' },
      });

      booking.status = BookingStatus.Cancelled;
      booking.paymentStatus = paymentStatus;
      await manager.save(Booking, booking);

      if (event) {
        event.ticketsSold = Math.max(
          0,
          Number(event.ticketsSold) - booking.quantity,
        );
        await manager.save(Event, event);
      }
    });
  }

  private async markBookingPaid(
    bookingId: string,
    fields: {
      status: BookingStatus;
      paymentStatus: string;
      paymentMethod: string;
    },
  ): Promise<void> {
    await this.bookingRepo.update(bookingId, {
      status: fields.status,
      paymentStatus: fields.paymentStatus,
      paymentMethod: fields.paymentMethod,
    });
  }

  private async sendConfirmationEmailOnce(bookingId: string): Promise<void> {
    const booking = await this.findOne(bookingId);
    if (booking.confirmationEmailSent) {
      this.logger.log(
        `Confirmation email already sent for booking ${booking.bookingReference} — skipping`,
      );
      return;
    }

    try {
      await this.emailService.sendBookingConfirmation(booking);
      booking.confirmationEmailSent = true;
      await this.bookingRepo.save(booking);
    } catch (error) {
      this.logger.error(
        `Failed to send booking confirmation for ${booking.bookingReference}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private mapMollieOutcome(
    status: string,
  ): PaymentSyncResult['outcome'] {
    if (status === 'paid') return 'success';
    if (status === 'canceled') return 'cancelled';
    if (status === 'failed' || status === 'expired') return 'failed';
    return 'pending';
  }

  private generateReference(): string {
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `SW-${stamp}-${rand}`;
  }
}
