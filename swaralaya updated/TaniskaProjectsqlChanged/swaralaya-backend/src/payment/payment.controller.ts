import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Query,
  Res,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { BookingsService } from '../bookings/bookings.service';

@Controller('api/payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    @Inject(forwardRef(() => BookingsService))
    private readonly bookingsService: BookingsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * GET /api/payment/return?bookingId=<uuid>
   * Also accepts paymentId for legacy/debug. Always re-verifies via Mollie API
   * using the booking's stored molliePaymentId — never trusts query status.
   */
  @Get('return')
  async paymentReturn(
    @Query('bookingId') bookingId: string | undefined,
    @Query('paymentId') paymentId: string | undefined,
    @Query('id') legacyId: string | undefined,
    @Res() res: Response,
  ) {
    let outcome: 'success' | 'cancelled' | 'failed' | 'pending' | 'error' =
      'pending';
    let resolvedBookingId = bookingId || '';
    let bookingStatus = '';
    let paymentStatus = '';

    try {
      if (bookingId) {
        const result = await this.bookingsService.syncByBookingId(bookingId);
        outcome = result.outcome;
        if (result.booking) {
          resolvedBookingId = result.booking.id;
          bookingStatus = result.booking.status;
          paymentStatus = result.booking.paymentStatus;
        }
      } else {
        const molliePaymentId = paymentId || legacyId;
        if (!molliePaymentId) {
          outcome = 'error';
        } else {
          const result =
            await this.bookingsService.syncPaymentFromMollie(molliePaymentId);
          outcome = result.outcome;
          if (result.booking) {
            resolvedBookingId = result.booking.id;
            bookingStatus = result.booking.status;
            paymentStatus = result.booking.paymentStatus;
          }
        }
      }

      this.logger.log(
        `Payment return → outcome=${outcome} booking=${resolvedBookingId || 'n/a'} status=${bookingStatus}`,
      );
    } catch (error) {
      this.logger.error(
        'Payment return failed',
        error instanceof Error ? error.stack : String(error),
      );
      outcome = 'error';
    }

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const params = new URLSearchParams({ outcome });
    if (resolvedBookingId) params.set('bookingId', resolvedBookingId);
    if (bookingStatus) params.set('bookingStatus', bookingStatus);
    if (paymentStatus) params.set('paymentStatus', paymentStatus);

    return res.redirect(
      `${frontendUrl.replace(/\/$/, '')}/payment/confirmation?${params.toString()}`,
    );
  }

  /**
   * POST /api/payment/webhook
   * Mollie posts { id: "tr_xxx" }. Re-fetch from Mollie, update booking idempotently.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async paymentWebhook(@Body('id') gatewayPaymentId?: string) {
    if (!gatewayPaymentId) {
      this.logger.warn('Payment webhook received without payment id');
      return { status: 'ok' };
    }

    try {
      const result =
        await this.bookingsService.syncPaymentFromMollie(gatewayPaymentId);
      this.logger.log(
        `Payment webhook: ${gatewayPaymentId} → outcome=${result.outcome} booking=${result.booking?.id ?? 'n/a'}`,
      );
    } catch (error) {
      this.logger.error(
        `Payment webhook failed for ${gatewayPaymentId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }

    return { status: 'ok' };
  }
}
