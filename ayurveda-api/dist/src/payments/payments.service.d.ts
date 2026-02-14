import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './stripe/stripe.service';
import { RazorpayService } from './razorpay/razorpay.service';
import { CreatePaymentDto, PaymentProvider } from './dto/create-payment.dto';
export declare class PaymentsService {
    private prisma;
    private stripeService;
    private razorpayService;
    private readonly logger;
    constructor(prisma: PrismaService, stripeService: StripeService, razorpayService: RazorpayService);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<any>;
    verifyPayment(provider: PaymentProvider, data: any): Promise<boolean>;
    getPaymentStatus(orderId: string): Promise<{
        orderId: string;
        orderNumber: string;
        paymentStatus: string;
        orderStatus: string;
        total: number;
    }>;
    processRefund(orderId: string, amount: number, reason: string, adminUserId: string): Promise<{
        success: boolean;
        message: string;
        orderId: string;
        refundAmount: number;
    }>;
    handleRazorpayWebhook(payload: any, signature: string): Promise<{
        received: boolean;
    }>;
    private updateOrderPaymentStatus;
}
