import { Injectable, BadRequestException } from '@nestjs/common';
import { StripeService } from './stripe/stripe.service';
import { RazorpayService } from './razorpay/razorpay.service';
import { CreatePaymentDto, PaymentProvider } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(
        private stripeService: StripeService,
        private razorpayService: RazorpayService,
    ) { }

    async createPayment(createPaymentDto: CreatePaymentDto) {
        const { amount, currency, provider, orderId } = createPaymentDto;

        switch (provider) {
            case PaymentProvider.STRIPE:
                return this.stripeService.createPaymentIntent(amount, currency, { orderId });
            case PaymentProvider.RAZORPAY:
                return this.razorpayService.createOrder(amount, currency, orderId);
            default:
                throw new BadRequestException('Invalid payment provider');
        }
    }

    async verifyPayment(provider: PaymentProvider, data: any) {
        switch (provider) {
            case PaymentProvider.STRIPE:
                return this.stripeService.verifyPayment(data.paymentIntentId);
            case PaymentProvider.RAZORPAY:
                return this.razorpayService.verifyPayment(data.orderId, data.paymentId, data.signature);
            default:
                throw new BadRequestException('Invalid payment provider');
        }
    }
}
