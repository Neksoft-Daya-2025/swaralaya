import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import { SMTP_CONFIG_KEY, SmtpConfig } from '../smtp-config/smtp-config.types';

@Injectable()
export class EmailService {
  constructor(
    private config: ConfigService,
    private settingsService: SettingsService,
  ) {}

  async resolveSmtpConfig(): Promise<SmtpConfig> {
    const savedConfig = await this.settingsService.get<SmtpConfig>(SMTP_CONFIG_KEY);

    if (savedConfig?.host) {
      return {
        host: savedConfig.host || '',
        port: savedConfig.port ?? 587,
        username: savedConfig.username || '',
        password: savedConfig.password || '',
        encryption: savedConfig.encryption || 'tls',
        from_email: savedConfig.from_email || savedConfig.username || '',
        from_name: savedConfig.from_name || 'Swaralaya School of Music',
        admin_emails: Array.isArray(savedConfig.admin_emails)
          ? savedConfig.admin_emails
          : [],
      };
    }

    return {
      host: this.config.get('SMTP_HOST') || '',
      port: this.config.get('SMTP_PORT') || 587,
      username: this.config.get('SMTP_USER') || '',
      password: this.config.get('SMTP_PASS') || '',
      encryption: 'tls',
      from_email: this.config.get('SMTP_USER') || '',
      from_name: 'Swaralaya School of Music',
      admin_emails: [],
    };
  }

  private createTransporter(smtpConfig: SmtpConfig): nodemailer.Transporter {
    const secure = smtpConfig.encryption === 'ssl';
    const requireTLS = smtpConfig.encryption === 'tls';

    return nodemailer.createTransport({
      host: smtpConfig.host,
      port: Number(smtpConfig.port),
      secure,
      requireTLS,
      auth: smtpConfig.username
        ? {
            user: smtpConfig.username,
            pass: smtpConfig.password,
          }
        : undefined,
    });
  }

  async sendTestEmail(recipient: string, smtpConfig?: SmtpConfig) {
    const config = smtpConfig || (await this.resolveSmtpConfig());
    const transporter = this.createTransporter(config);
    const fromAddress = config.from_email || config.username;

    await transporter.sendMail({
      from: `"${config.from_name}" <${fromAddress}>`,
      to: recipient,
      subject: 'SMTP Test - Swaralaya Admin Dashboard',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #6F3527;">SMTP Test Successful</h2>
          <p style="color: #555;">This is a test email from the Swaralaya Admin Dashboard. SMTP connection is working.</p>
        </div>
      `,
    });
  }

  // Send a congratulations email when a student is accepted
  async sendEnrollmentAccepted(studentEmail: string, studentName: string, courseName: string) {
    console.log(`Sending acceptance email to ${studentEmail}...`);

    const smtpConfig = await this.resolveSmtpConfig();
    const transporter = this.createTransporter(smtpConfig);
    const fromAddress = smtpConfig.from_email || smtpConfig.username || this.config.get('SMTP_USER');
    const senderName = `"Swaralaya School of Music" <${fromAddress}>`;
    const emailSubject = '🎵 Enrollment Confirmed – Welcome to Swaralaya!';
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #eee; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2023/04/white-logo.png" alt="Swaralaya" style="height: 60px; background: #6F3527; padding: 10px; border-radius: 8px;" />
        </div>
        <h1 style="color: #6F3527; font-size: 24px; margin-bottom: 12px;">Congratulations, ${studentName}! 🎉</h1>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          We are thrilled to inform you that your enrollment request for <strong>${courseName}</strong> at 
          <strong>Swaralaya School of Music</strong> has been <strong style="color: #22c55e;">accepted!</strong>
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Our team will reach out to you shortly with details about your first class, schedule, and any further steps.
        </p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="https://swaralayaschoolofmusic.nl" style="background: #6F3527; color: #fff; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">
            Visit Our Website
          </a>
        </div>
        <p style="color: #999; font-size: 13px; text-align: center; margin-top: 32px;">
          Swaralaya School of Music | J J Slauerhoffstraat 63, 1321RA Almere, Netherlands<br/>
          <a href="mailto:info@swaralayaschoolofmusic.nl" style="color: #6F3527;">info@swaralayaschoolofmusic.nl</a>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: senderName,
      to: studentEmail,
      subject: emailSubject,
      html: emailBody,
    });

    console.log(`Acceptance email sent successfully to ${studentEmail}`);
  }

  // Send a rejection update email when enrollment is not approved
  async sendEnrollmentRejected(studentEmail: string, studentName: string, courseName: string) {
    console.log(`Sending rejection email to ${studentEmail}...`);

    const smtpConfig = await this.resolveSmtpConfig();
    const transporter = this.createTransporter(smtpConfig);
    const fromAddress = smtpConfig.from_email || smtpConfig.username || this.config.get('SMTP_USER');
    const senderName = `"Swaralaya School of Music" <${fromAddress}>`;
    const emailSubject = 'Swaralaya – Enrollment Update';
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #eee; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2023/04/white-logo.png" alt="Swaralaya" style="height: 60px; background: #6F3527; padding: 10px; border-radius: 8px;" />
        </div>
        <h1 style="color: #6F3527; font-size: 24px; margin-bottom: 12px;">Dear ${studentName},</h1>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Thank you for your interest in enrolling for <strong>${courseName}</strong> at Swaralaya School of Music.
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Unfortunately, we were unable to accommodate your enrollment request at this time due to capacity constraints or scheduling conflicts.
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          We encourage you to apply again in the next enrollment cycle. Feel free to reach out to us if you have any questions.
        </p>
        <p style="color: #999; font-size: 13px; text-align: center; margin-top: 32px;">
          Swaralaya School of Music | J J Slauerhoffstraat 63, 1321RA Almere, Netherlands<br/>
          <a href="mailto:info@swaralayaschoolofmusic.nl" style="color: #6F3527;">info@swaralayaschoolofmusic.nl</a>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: senderName,
      to: studentEmail,
      subject: emailSubject,
      html: emailBody,
    });

    console.log(`Rejection email sent to ${studentEmail}`);
  }

  // Send a notification email to the admin / school inbox
  async sendAdminNotification(subject: string, htmlContent: string) {
    const schoolEmail = this.config.get('SCHOOL_EMAIL');

    // If school email not configured, skip
    if (!schoolEmail) {
      console.log('No school email configured in .env - skipping admin notification');
      return;
    }

    const smtpConfig = await this.resolveSmtpConfig();
    const transporter = this.createTransporter(smtpConfig);
    const fromAddress = smtpConfig.from_email || smtpConfig.username || this.config.get('SMTP_USER');
    const senderName = `"Swaralaya System" <${fromAddress}>`;

    await transporter.sendMail({
      from: senderName,
      to: schoolEmail,
      subject: subject,
      html: htmlContent,
    });

    console.log(`Admin notification sent to ${schoolEmail}`);
  }

  async sendBookingConfirmation(booking: {
    customerName: string;
    customerEmail: string;
    bookingReference: string;
    totalAmount: number | string;
    quantity: number;
    event?: { title?: string; date?: string; time?: string; location?: string } | null;
  }) {
    console.log(`Sending booking confirmation to ${booking.customerEmail}...`);

    const smtpConfig = await this.resolveSmtpConfig();
    const transporter = this.createTransporter(smtpConfig);
    const fromAddress =
      smtpConfig.from_email || smtpConfig.username || this.config.get('SMTP_USER');
    const senderName = `"Swaralaya School of Music" <${fromAddress}>`;
    const eventTitle = booking.event?.title || 'Swaralaya Event';
    const amount = Number(booking.totalAmount).toFixed(2);
    const eventDate = booking.event?.date || '';
    const eventTime = booking.event?.time || '';
    const eventLocation = booking.event?.location || '';

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #eee; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://swaralayaschoolofmusic.nl/wp-content/uploads/2023/04/white-logo.png" alt="Swaralaya" style="height: 60px; background: #6F3527; padding: 10px; border-radius: 8px;" />
        </div>
        <h1 style="color: #6F3527; font-size: 24px; margin-bottom: 12px;">Booking Confirmed</h1>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Dear ${booking.customerName},
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Your booking for <strong>${eventTitle}</strong> is confirmed.
        </p>
        <div style="background: #faf7f5; border-radius: 8px; padding: 16px 20px; margin: 24px 0;">
          <p style="margin: 6px 0; color: #333;"><strong>Reference:</strong> ${booking.bookingReference}</p>
          <p style="margin: 6px 0; color: #333;"><strong>Tickets:</strong> ${booking.quantity}</p>
          <p style="margin: 6px 0; color: #333;"><strong>Amount:</strong> €${amount}</p>
          ${eventDate ? `<p style="margin: 6px 0; color: #333;"><strong>Date:</strong> ${eventDate}${eventTime ? ` · ${eventTime}` : ''}</p>` : ''}
          ${eventLocation ? `<p style="margin: 6px 0; color: #333;"><strong>Location:</strong> ${eventLocation}</p>` : ''}
        </div>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          We look forward to seeing you at Swaralaya School of Music.
        </p>
        <p style="color: #999; font-size: 13px; text-align: center; margin-top: 32px;">
          Swaralaya School of Music | J J Slauerhoffstraat 63, 1321RA Almere, Netherlands<br/>
          <a href="mailto:info@swaralayaschoolofmusic.nl" style="color: #6F3527;">info@swaralayaschoolofmusic.nl</a>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: senderName,
      to: booking.customerEmail,
      subject: `Booking Confirmation – ${booking.bookingReference}`,
      html: emailBody,
    });

    console.log(`Booking confirmation email sent to ${booking.customerEmail}`);
  }
}
