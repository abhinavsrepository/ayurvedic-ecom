import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<any>;
    verifyStripePayment(body: {
        paymentIntentId: string;
    }): Promise<{
        success: boolean;
    }>;
    verifyRazorpayPayment(body: {
        orderId: string;
        paymentId: string;
        signature: string;
    }): Promise<{
        success: boolean;
    }>;
}
