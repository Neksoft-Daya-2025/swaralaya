import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { EmailModule } from '../email/email.module';
import { SmtpConfigController } from './smtp-config.controller';
import { SmtpConfigService } from './smtp-config.service';

@Module({
  imports: [SettingsModule, EmailModule],
  providers: [SmtpConfigService],
  controllers: [SmtpConfigController],
})
export class SmtpConfigModule {}
