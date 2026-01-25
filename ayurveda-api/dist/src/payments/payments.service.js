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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const stripe_service_1 = require("./stripe/stripe.service");
const razorpay_service_1 = require("./razorpay/razorpay.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
let PaymentsService = class PaymentsService {
    stripeService;
    razorpayService;
    constructor(stripeService, razorpayService) {
        this.stripeService = stripeService;
        this.razorpayService = razorpayService;
    }
    async createPayment(createPaymentDto) {
        const { amount, currency, provider, orderId } = createPaymentDto;
        switch (provider) {
            case create_payment_dto_1.PaymentProvider.STRIPE:
                return this.stripeService.createPaymentIntent(amount, currency, { orderId });
            case create_payment_dto_1.PaymentProvider.RAZORPAY:
                return this.razorpayService.createOrder(amount, currency, orderId);
            default:
                throw new common_1.BadRequestException('Invalid payment provider');
        }
    }
    async verifyPayment(provider, data) {
        switch (provider) {
            case create_payment_dto_1.PaymentProvider.STRIPE:
                return this.stripeService.verifyPayment(data.paymentIntentId);
            case create_payment_dto_1.PaymentProvider.RAZORPAY:
                return this.razorpayService.verifyPayment(data.orderId, data.paymentId, data.signature);
            default:
                throw new common_1.BadRequestException('Invalid payment provider');
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stripe_service_1.StripeService,
        razorpay_service_1.RazorpayService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map