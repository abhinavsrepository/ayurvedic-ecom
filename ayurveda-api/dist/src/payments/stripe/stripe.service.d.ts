import { ConfigService } from '@nestjs/config';
export declare class StripeService {
    private configService;
    private stripe;
    private readonly logger;
    constructor(configService: ConfigService);
    createPaymentIntent(amount: number, currency: string, metadata?: any): Promise<{
        clientSecret: string | null;
        id: string;
    }>;
    verifyPayment(paymentIntentId: string): Promise<boolean>;
}
