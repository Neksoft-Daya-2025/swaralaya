import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createMollieClient, MollieClient } from '@mollie/api-client';

export interface CreateMolliePaymentParams {
  amount: number;
  currency: string;
  description: string;
  redirectUrl: string;
  webhookUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface MolliePaymentResult {
  id: string;
  status: string;
  checkoutUrl: string | null;
  amount: string | null;
  currency: string | null;
}

/**
 * Owns all communication with the Mollie SDK.
 * Business modules should use this service instead of calling Mollie directly.
 */
@Injectable()
export class MollieService {
  private readonly logger = new Logger(MollieService.name);
  private client: MollieClient | null = null;
  private cachedApiKey: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  getCurrency(): string {
    return (this.configService.get<string>('MOLLIE_CURRENCY') || 'EUR').toUpperCase();
  }

  getDescriptionPrefix(): string {
    return this.configService.get<string>('MOLLIE_DESCRIPTION_PREFIX') || 'Swaralaya';
  }

  /**
   * Browser return URL after Mollie checkout, keyed by booking id.
   * Example: http://localhost:3001/api/payment/return?bookingId=<uuid>
   */
  buildBookingReturnUrl(bookingId: string): string {
    return `${this.apiBaseUrl()}/payment/return?bookingId=${encodeURIComponent(bookingId)}`;
  }

  /**
   * Browser return URL after Mollie checkout (by Mollie payment id).
   * Example: http://localhost:3001/api/payment/return?paymentId=tr_xxx
   */
  buildReturnUrl(paymentId?: string): string {
    const base = `${this.apiBaseUrl()}/payment/return`;
    return paymentId ? `${base}?paymentId=${encodeURIComponent(paymentId)}` : base;
  }

  /**
   * Mollie webhook URL. Omitted on localhost (Mollie cannot reach local machines).
   */
  buildWebhookUrl(): string | undefined {
    const backendUrl =
      this.configService.get<string>('BACKEND_URL') ||
      `http://localhost:${this.configService.get<string>('PORT') || '3001'}`;

    if (
      backendUrl.includes('localhost') ||
      backendUrl.includes('127.0.0.1')
    ) {
      return undefined;
    }

    return `${this.apiBaseUrl(backendUrl)}/payment/webhook`;
  }

  async createPayment(
    params: CreateMolliePaymentParams,
  ): Promise<MolliePaymentResult> {
    const client = this.getClient();
    const payment = await client.payments.create({
      amount: {
        currency: params.currency,
        value: params.amount.toFixed(2),
      },
      description: params.description,
      redirectUrl: params.redirectUrl,
      webhookUrl: params.webhookUrl,
      metadata: params.metadata,
    });

    return this.normalize(payment);
  }

  async getPayment(paymentId: string): Promise<MolliePaymentResult> {
    const client = this.getClient();
    const payment = await client.payments.get(paymentId);
    return this.normalize(payment);
  }

  /**
   * Server-side source of truth: always re-fetch from Mollie
   * instead of trusting redirect params or webhook bodies alone.
   */
  verifyPayment(paymentId: string): Promise<MolliePaymentResult> {
    return this.getPayment(paymentId);
  }

  private getClient(): MollieClient {
    const apiKey = this.configService.get<string>('MOLLIE_API_KEY');

    if (!apiKey) {
      this.logger.error('Mollie API key is not configured (MOLLIE_API_KEY)');
      throw new Error('Mollie API key is not configured');
    }

    if (!this.client || this.cachedApiKey !== apiKey) {
      this.client = createMollieClient({ apiKey });
      this.cachedApiKey = apiKey;
    }

    return this.client;
  }

  private apiBaseUrl(backendUrl?: string): string {
    const base =
      backendUrl ||
      this.configService.get<string>('BACKEND_URL') ||
      `http://localhost:${this.configService.get<string>('PORT') || '3001'}`;

    return `${base.replace(/\/$/, '')}/api`;
  }

  private normalize(payment: {
    id: string;
    status: string;
    amount?: { value: string; currency: string };
    getCheckoutUrl?: () => string | null;
  }): MolliePaymentResult {
    let checkoutUrl: string | null = null;

    try {
      checkoutUrl = payment.getCheckoutUrl ? payment.getCheckoutUrl() : null;
    } catch {
      checkoutUrl = null;
    }

    return {
      id: payment.id,
      status: payment.status,
      checkoutUrl,
      amount: payment.amount?.value ?? null,
      currency: payment.amount?.currency ?? null,
    };
  }
}
