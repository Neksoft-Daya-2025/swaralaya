import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SmtpConfigService } from './smtp-config.service';
import { SaveSmtpConfigDto } from './dto/save-smtp-config.dto';
import { TestSmtpConfigDto } from './dto/test-smtp-config.dto';

@Controller('api/smtp-config')
export class SmtpConfigController {
  constructor(private smtpConfigService: SmtpConfigService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getConfig() {
    return this.smtpConfigService.getPublicConfig();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  saveConfig(@Body() dto: SaveSmtpConfigDto) {
    return this.smtpConfigService.saveConfig(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  testConfig(@Body() dto: TestSmtpConfigDto) {
    return this.smtpConfigService.testConfig(dto);
  }
}
