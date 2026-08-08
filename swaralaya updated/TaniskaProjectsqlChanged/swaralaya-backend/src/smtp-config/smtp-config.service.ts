import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import { EmailService } from '../email/email.service';
import { SaveSmtpConfigDto } from './dto/save-smtp-config.dto';
import { TestSmtpConfigDto } from './dto/test-smtp-config.dto';
import {
  SMTP_CONFIG_KEY,
  SmtpConfig,
  SmtpConfigPublic,
} from './smtp-config.types';

@Injectable()
export class SmtpConfigService {
  constructor(
    private settingsService: SettingsService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async getPublicConfig(): Promise<SmtpConfigPublic> {
    const savedConfig = await this.settingsService.get<SmtpConfig>(SMTP_CONFIG_KEY);
    const envPassword = this.configService.get<string>('SMTP_PASS') || '';

    if (savedConfig?.host) {
      return {
        configured: true,
        host: savedConfig.host || '',
        port: savedConfig.port ?? '',
        username: savedConfig.username || '',
        encryption: savedConfig.encryption || 'tls',
        from_email: savedConfig.from_email || '',
        from_name: savedConfig.from_name || '',
        admin_emails: Array.isArray(savedConfig.admin_emails)
          ? savedConfig.admin_emails
          : [],
        has_password: Boolean(savedConfig.password),
      };
    }

    const envHost = this.configService.get<string>('SMTP_HOST') || '';
    const envUsername = this.configService.get<string>('SMTP_USER') || '';
    const isEnvConfigured = Boolean(envHost && envUsername && envPassword);

    return {
      configured: isEnvConfigured,
      host: envHost,
      port: this.configService.get<string>('SMTP_PORT') || 587,
      username: envUsername,
      encryption: 'tls',
      from_email: envUsername,
      from_name: 'Swaralaya School of Music',
      admin_emails: [],
      has_password: Boolean(envPassword),
    };
  }

  async saveConfig(dto: SaveSmtpConfigDto) {
    const existingConfig = await this.settingsService.get<SmtpConfig>(SMTP_CONFIG_KEY);
    const password = this.resolvePasswordForSave(dto.password, existingConfig);

    const adminEmails = this.parseAdminEmails(dto.admin_emails);

    const config: SmtpConfig = {
      host: dto.host.trim(),
      port: dto.port,
      username: dto.username.trim(),
      password,
      encryption: dto.encryption,
      from_email: dto.from_email.trim(),
      from_name: dto.from_name.trim(),
      admin_emails: adminEmails,
    };

    await this.settingsService.set(
      SMTP_CONFIG_KEY,
      config,
      'json',
      'SMTP Email Configuration',
    );

    return {
      success: true,
      message: 'SMTP configuration saved successfully',
      configured: true,
    };
  }

  async testConfig(dto: TestSmtpConfigDto) {
    const smtpConfig = await this.emailService.resolveSmtpConfig();

    this.validateSmtpConfig(smtpConfig);

    const recipient = this.resolveTestRecipient(dto.to_email, smtpConfig);

    await this.emailService.sendTestEmail(recipient, smtpConfig);

    return {
      success: true,
      message: `Test email sent successfully to ${recipient}`,
    };
  }

  private resolvePasswordForSave(
    submittedPassword: string | undefined,
    existingConfig: SmtpConfig | null,
  ): string {
    if (submittedPassword && submittedPassword.trim()) {
      return submittedPassword.trim();
    }

    if (existingConfig?.password) {
      return existingConfig.password;
    }

    const envPassword = this.configService.get<string>('SMTP_PASS') || '';
    if (envPassword) {
      return envPassword;
    }

    throw new UnprocessableEntityException('Password is required.');
  }

  private parseAdminEmails(adminEmails?: string | string[]): string[] {
    if (!adminEmails) {
      return [];
    }

    if (Array.isArray(adminEmails)) {
      return adminEmails.map((email) => email.trim()).filter(Boolean);
    }

    return adminEmails
      .split('\n')
      .map((email) => email.trim())
      .filter(Boolean);
  }

  private validateSmtpConfig(config: SmtpConfig) {
    if (!config.host?.trim()) {
      throw new BadRequestException('SMTP host is required.');
    }

    if (!config.port) {
      throw new BadRequestException('SMTP port is required.');
    }

    if (!config.username?.trim()) {
      throw new BadRequestException('SMTP username is required.');
    }

    if (!config.password) {
      throw new BadRequestException('SMTP password is required.');
    }

    if (!config.encryption) {
      throw new BadRequestException('SMTP encryption is required.');
    }

    if (!config.from_email?.trim()) {
      throw new BadRequestException('From email is required.');
    }

    if (!config.from_name?.trim()) {
      throw new BadRequestException('From name is required.');
    }
  }

  private resolveTestRecipient(
    requestedEmail: string | undefined,
    config: SmtpConfig,
  ): string {
    if (requestedEmail?.trim()) {
      return requestedEmail.trim();
    }

    if (config.admin_emails?.length) {
      return config.admin_emails[0];
    }

    if (config.from_email?.trim()) {
      return config.from_email.trim();
    }

    throw new BadRequestException(
      'No test recipient available. Configure admin emails or from email.',
    );
  }
}
