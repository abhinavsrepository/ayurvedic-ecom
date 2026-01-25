import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class RazorpayService {
    private razorpay: any;
    private readonly logger = new Logger(RazorpayService.name);

    constructor(private configService: ConfigService) {
        const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
        const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

        if (keyId && keySecret) {
            this.razorpay = new Razorpay({
                key_id: keyId,
                key_secret: keySecret,
            });
        } else {
            this.logger.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not found in environment variables');
        }
    }

    async createOrder(amount: number, currency: string, receipt: string) {
        if (!this.razorpay) {
            throw new Error('Razorpay is not initialized');
        }

        try {
            const options = {
                amount: Math.round(amount * 100), // Razorpay expects amount in paise
                currency: currency.toUpperCase(),
                receipt,
            };

            const order = await this.razorpay.orders.create(options);
            return order;
        } catch (error) {
            this.logger.error(`Razorpay order creation failed: ${error.message}`);
            throw error;
        }
    }

    verifyPayment(orderId: string, paymentId: string, signature: string): boolean {
        if (!this.razorpay) {
            throw new Error('Razorpay is not initialized');
        }

        const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
        if (!keySecret) {
            throw new Error('RAZORPAY_KEY_SECRET is not defined');
        }

        const hmac = crypto.createHmac('sha256', keySecret);

        hmac.update(orderId + '|' + paymentId);
        const generatedSignature = hmac.digest('hex');

        return generatedSignature === signature;
    }
}
