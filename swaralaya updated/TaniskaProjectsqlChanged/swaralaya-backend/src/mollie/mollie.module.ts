import { Module, forwardRef } from '@nestjs/common';
import { MollieService } from './mollie.service';
import { PaymentController } from '../payment/payment.controller';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [forwardRef(() => BookingsModule)],
  controllers: [PaymentController],
  providers: [MollieService],
  exports: [MollieService],
})
export class MollieModule {}
