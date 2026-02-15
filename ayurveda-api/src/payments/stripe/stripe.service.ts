import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (secretKey) {
      this.stripe = new Stripe(secretKey);
    } else {
      this.logger.warn('STRIPE_SECRET_KEY not found in environment variables');
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: any = {},
  ) {
    if (!this.stripe) {
      throw new Error('Stripe is not initialized');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    } catch (error) {
      this.logger.error(
        `Stripe payment intent creation failed: ${error.message}`,
      );
      throw error;
    }
  }

  async verifyPayment(paymentIntentId: string) {
    if (!this.stripe) {
      throw new Error('Stripe is not initialized');
    }

    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      this.logger.error(`Stripe payment verification failed: ${error.message}`);
      throw error;
    }
  }
}
