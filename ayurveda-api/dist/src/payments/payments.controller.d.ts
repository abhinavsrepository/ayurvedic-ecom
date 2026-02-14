import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<any>;
    verifyRazorpayPayment(body: {
        orderId: string;
        paymentId: string;
        signature: string;
        internalOrderId: string;
    }): Promise<{
        success: boolean;
    }>;
    verifyStripePayment(body: {
        paymentIntentId: string;
        internalOrderId: string;
    }): Promise<{
        success: boolean;
    }>;
    getPaymentStatus(orderId: string): Promise<{
        orderId: string;
        orderNumber: string;
        paymentStatus: string;
        orderStatus: string;
        total: number;
    }>;
    processRefund(body: {
        orderId: string;
        amount: number;
        reason: string;
    }, adminUserId: string): Promise<{
        success: boolean;
        message: string;
        orderId: string;
        refundAmount: number;
    }>;
    handleRazorpayWebhook(payload: any, signature: string): Promise<{
        received: boolean;
    }>;
}
