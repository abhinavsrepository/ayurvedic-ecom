"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_service_1 = require("./stripe/stripe.service");
const razorpay_service_1 = require("./razorpay/razorpay.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    prisma;
    stripeService;
    razorpayService;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(prisma, stripeService, razorpayService) {
        this.prisma = prisma;
        this.stripeService = stripeService;
        this.razorpayService = razorpayService;
    }
    async createPayment(createPaymentDto) {
        const { amount, currency, provider, orderId } = createPaymentDto;
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.payment_status === 'PAID') {
            throw new common_1.BadRequestException('Order is already paid');
        }
        switch (provider) {
            case create_payment_dto_1.PaymentProvider.STRIPE:
                return this.stripeService.createPaymentIntent(amount, currency, {
                    orderId,
                });
            case create_payment_dto_1.PaymentProvider.RAZORPAY:
                const razorpayOrder = await this.razorpayService.createOrder(amount, currency, orderId);
                return {
                    ...razorpayOrder,
                    orderId,
                };
            default:
                throw new common_1.BadRequestException('Invalid payment provider');
        }
    }
    async verifyPayment(provider, data) {
        let isValid = false;
        switch (provider) {
            case create_payment_dto_1.PaymentProvider.STRIPE:
                isValid = await this.stripeService.verifyPayment(data.paymentIntentId);
                break;
            case create_payment_dto_1.PaymentProvider.RAZORPAY:
                isValid = this.razorpayService.verifyPayment(data.orderId, data.paymentId, data.signature);
                break;
            default:
                throw new common_1.BadRequestException('Invalid payment provider');
        }
        if (isValid && data.internalOrderId) {
            await this.updateOrderPaymentStatus(data.internalOrderId, 'PAID', {
                provider,
                externalId: provider === create_payment_dto_1.PaymentProvider.RAZORPAY
                    ? data.paymentId
                    : data.paymentIntentId,
                verifiedAt: new Date(),
            });
        }
        return isValid;
    }
    async getPaymentStatus(orderId) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        return {
            orderId: order.id,
            orderNumber: order.order_number,
            paymentStatus: order.payment_status,
            orderStatus: order.status,
            total: Number(order.total),
        };
    }
    async processRefund(orderId, amount, reason, adminUserId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.payment_status !== 'PAID') {
            throw new common_1.BadRequestException('Order is not paid');
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                payment_status: amount >= Number(order.total) ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
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
    async handleRazorpayWebhook(payload, signature) {
        const isValid = this.razorpayService.verifyWebhookSignature(payload, signature);
        if (!isValid) {
            this.logger.warn('Invalid Razorpay webhook signature');
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        const event = payload.event;
        const paymentEntity = payload.payload?.payment?.entity;
        this.logger.log(`Razorpay webhook received: ${event}`);
        switch (event) {
            case 'payment.captured':
                if (paymentEntity?.notes?.orderId) {
                    await this.updateOrderPaymentStatus(paymentEntity.notes.orderId, 'PAID', {
                        provider: create_payment_dto_1.PaymentProvider.RAZORPAY,
                        externalId: paymentEntity.id,
                        capturedAt: new Date(),
                    });
                }
                break;
            case 'payment.failed':
                if (paymentEntity?.notes?.orderId) {
                    await this.updateOrderPaymentStatus(paymentEntity.notes.orderId, 'FAILED', {
                        provider: create_payment_dto_1.PaymentProvider.RAZORPAY,
                        externalId: paymentEntity.id,
                        failedAt: new Date(),
                        error: paymentEntity.error_description,
                    });
                }
                break;
            case 'refund.processed':
                const refundEntity = payload.payload?.refund?.entity;
                if (refundEntity?.notes?.orderId) {
                    await this.updateOrderPaymentStatus(refundEntity.notes.orderId, 'REFUNDED', {
                        provider: create_payment_dto_1.PaymentProvider.RAZORPAY,
                        refundId: refundEntity.id,
                        refundedAt: new Date(),
                    });
                }
                break;
            default:
                this.logger.log(`Unhandled Razorpay event: ${event}`);
        }
        return { received: true };
    }
    async updateOrderPaymentStatus(orderId, status, metadata) {
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_service_1.StripeService,
        razorpay_service_1.RazorpayService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map