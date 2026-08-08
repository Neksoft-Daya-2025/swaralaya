import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ContactsModule } from './contacts/contacts.module';
import { EmailModule } from './email/email.module';
import { EventsModule } from './events/events.module';
import { SettingsModule } from './settings/settings.module';
import { SmtpConfigModule } from './smtp-config/smtp-config.module';
import { MollieModule } from './mollie/mollie.module';
import { TicketTypesModule } from './ticket-types/ticket-types.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_DATABASE', 'swaralaya_db'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    BlogsModule,
    EnrollmentsModule,
    ContactsModule,
    EmailModule,
    EventsModule,
    SettingsModule,
    SmtpConfigModule,
    MollieModule,
    TicketTypesModule,
    BookingsModule,
  ],
})
export class AppModule {}
