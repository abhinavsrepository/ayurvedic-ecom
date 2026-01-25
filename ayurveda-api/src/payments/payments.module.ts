import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeService } from './stripe/stripe.service';
import { RazorpayService } from './razorpay/razorpay.service';

@Module({
  imports: [ConfigModule],
  providers: [PaymentsService, StripeService, RazorpayService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule { }
