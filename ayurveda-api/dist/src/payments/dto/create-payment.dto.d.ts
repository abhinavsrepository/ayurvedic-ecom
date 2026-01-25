export declare enum PaymentProvider {
    STRIPE = "STRIPE",
    RAZORPAY = "RAZORPAY"
}
export declare class CreatePaymentDto {
    orderId: string;
    amount: number;
    currency: string;
    provider: PaymentProvider;
    paymentMethodId?: string;
}
