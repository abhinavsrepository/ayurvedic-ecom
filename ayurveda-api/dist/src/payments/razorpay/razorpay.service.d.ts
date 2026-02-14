import { ConfigService } from '@nestjs/config';
export declare class RazorpayService {
    private configService;
    private razorpay;
    private readonly logger;
    constructor(configService: ConfigService);
    createOrder(amount: number, currency: string, receipt: string): Promise<any>;
    verifyPayment(orderId: string, paymentId: string, signature: string): boolean;
    verifyWebhookSignature(payload: any, signature: string): boolean;
    getPayment(paymentId: string): Promise<any>;
    createRefund(paymentId: string, amount: number, notes?: Record<string, string>): Promise<any>;
}
