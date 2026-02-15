/**
 * Payments Service
 *
 * Business logic for payment processing with Razorpay and Stripe.
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './stripe/stripe.service';
import { RazorpayService } from './razorpay/razorpay.service';
import { CreatePaymentDto, PaymentProvider } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
    private razorpayService: RazorpayService,
  ) {}

  /**
   * Create a payment intent/order
   */
  async createPayment(createPaymentDto: CreatePaymentDto) {
    const { amount, currency, provider, orderId } = createPaymentDto;

    // Verify order exists and is pending payment
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.payment_status === 'PAID') {
      throw new BadRequestException('Order is already paid');
    }

    switch (provider) {
      case PaymentProvider.STRIPE:
        return this.stripeService.createPaymentIntent(amount, currency, {
          orderId,
        });
      case PaymentProvider.RAZORPAY:
        const razorpayOrder = await this.razorpayService.createOrder(
          amount,
          currency,
          orderId,
        );
        return {
          ...razorpayOrder,
          orderId,
        };
      default:
        throw new BadRequestException('Invalid payment provider');
    }
  }

  /**
   * Verify payment and update order status
   */
  async verifyPayment(provider: PaymentProvider, data: any) {
    let isValid = false;

    switch (provider) {
      case PaymentProvider.STRIPE:
        isValid = await this.stripeService.verifyPayment(data.paymentIntentId);
        break;
      case PaymentProvider.RAZORPAY:
        isValid = this.razorpayService.verifyPayment(
          data.orderId,
          data.paymentId,
          data.signature,
        );
        break;
      default:
        throw new BadRequestException('Invalid payment provider');
    }

    if (isValid && data.internalOrderId) {
      // Update order payment status
      await this.updateOrderPaymentStatus(data.internalOrderId, 'PAID', {
        provider,
        externalId:
          provider === PaymentProvider.RAZORPAY
            ? data.paymentId
            : data.paymentIntentId,
        verifiedAt: new Date(),
      });
    }

    return isValid;
  }

  /**
   * Get payment status for an order
   */
  async getPaymentStatus(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        order_number: true,
        payment_status: true,
        total: true,
        status: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      orderId: order.id,
      orderNumber: order.order_number,
      paymentStatus: order.payment_status,
      orderStatus: order.status,
      total: Number(order.total),
    };
  }

  /**
   * Process refund
   */
  async processRefund(
    orderId: string,
    amount: number,
    reason: string,
    adminUserId: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.payment_status !== 'PAID') {
      throw new BadRequestException('Order is not paid');
    }

    // For now, just update status - actual refund would go through payment provider
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        payment_status:
          amount >= Number(order.total) ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
        status: 'CANCELLED',
        cancelled_at: new Date(),
        cancelled_reason: reason,
        notes: `Refund of ${amount} processed by admin ${adminUserId}`,
        updated_at: new Date(),
      },
    });

    this.logger.log(`Refund processed for order ${orderId}: ${amount}`);

    return {
      success: true,
      message: 'Refund processed successfully',
      orderId,
      refundAmount: amount,
    };
  }

  /**
   * Handle Razorpay webhook
   */
  async handleRazorpayWebhook(payload: any, signature: string) {
    // Verify webhook signature
    const isValid = this.razorpayService.verifyWebhookSignature(
      payload,
      signature,
    );

    if (!isValid) {
      this.logger.warn('Invalid Razorpay webhook signature');
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    this.logger.log(`Razorpay webhook received: ${event}`);

    switch (event) {
      case 'payment.captured':
        if (paymentEntity?.notes?.orderId) {
          await this.updateOrderPaymentStatus(
            paymentEntity.notes.orderId,
            'PAID',
            {
              provider: PaymentProvider.RAZORPAY,
              externalId: paymentEntity.id,
              capturedAt: new Date(),
            },
          );
        }
        break;

      case 'payment.failed':
        if (paymentEntity?.notes?.orderId) {
          await this.updateOrderPaymentStatus(
            paymentEntity.notes.orderId,
            'FAILED',
            {
              provider: PaymentProvider.RAZORPAY,
              externalId: paymentEntity.id,
              failedAt: new Date(),
              error: paymentEntity.error_description,
            },
          );
        }
        break;

      case 'refund.processed':
        const refundEntity = payload.payload?.refund?.entity;
        if (refundEntity?.notes?.orderId) {
          await this.updateOrderPaymentStatus(
            refundEntity.notes.orderId,
            'REFUNDED',
            {
              provider: PaymentProvider.RAZORPAY,
              refundId: refundEntity.id,
              refundedAt: new Date(),
            },
          );
        }
        break;

      default:
        this.logger.log(`Unhandled Razorpay event: ${event}`);
    }

    return { received: true };
  }

  /**
   * Update order payment status
   */
  private async updateOrderPaymentStatus(
    orderId: string,
    status: string,
    metadata: any,
  ) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        payment_status: status,
        status: status === 'PAID' ? 'CONFIRMED' : undefined,
        notes: JSON.stringify(metadata),
        updated_at: new Date(),
      },
    });

    this.logger.log(`Order ${orderId} payment status updated to ${status}`);
  }
}
