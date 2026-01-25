import { StripeService } from './stripe/stripe.service';
import { RazorpayService } from './razorpay/razorpay.service';
import { CreatePaymentDto, PaymentProvider } from './dto/create-payment.dto';
export declare class PaymentsService {
    private stripeService;
    private razorpayService;
    constructor(stripeService: StripeService, razorpayService: RazorpayService);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<any>;
    verifyPayment(provider: PaymentProvider, data: any): Promise<boolean>;
}
