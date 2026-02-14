"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RazorpayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto = __importStar(require("crypto"));
let RazorpayService = RazorpayService_1 = class RazorpayService {
    configService;
    razorpay;
    logger = new common_1.Logger(RazorpayService_1.name);
    constructor(configService) {
        this.configService = configService;
        const keyId = this.configService.get('RAZORPAY_KEY_ID');
        const keySecret = this.configService.get('RAZORPAY_KEY_SECRET');
        if (keyId && keySecret) {
            this.razorpay = new razorpay_1.default({
                key_id: keyId,
                key_secret: keySecret,
            });
        }
        else {
            this.logger.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not found in environment variables');
        }
    }
    async createOrder(amount, currency, receipt) {
        if (!this.razorpay) {
            throw new Error('Razorpay is not initialized');
        }
        try {
            const options = {
                amount: Math.round(amount * 100),
                currency: currency.toUpperCase(),
                receipt,
            };
            const order = await this.razorpay.orders.create(options);
            return order;
        }
        catch (error) {
            this.logger.error(`Razorpay order creation failed: ${error.message}`);
            throw error;
        }
    }
    verifyPayment(orderId, paymentId, signature) {
        if (!this.razorpay) {
            throw new Error('Razorpay is not initialized');
        }
        const keySecret = this.configService.get('RAZORPAY_KEY_SECRET');
        if (!keySecret) {
            throw new Error('RAZORPAY_KEY_SECRET is not defined');
        }
        const hmac = crypto.createHmac('sha256', keySecret);
        hmac.update(orderId + '|' + paymentId);
        const generatedSignature = hmac.digest('hex');
        return generatedSignature === signature;
    }
    verifyWebhookSignature(payload, signature) {
        const webhookSecret = this.configService.get('RAZORPAY_WEBHOOK_SECRET');
        if (!webhookSecret) {
            this.logger.warn('RAZORPAY_WEBHOOK_SECRET is not defined');
            return false;
        }
        const hmac = crypto.createHmac('sha256', webhookSecret);
        hmac.update(JSON.stringify(payload));
        const generatedSignature = hmac.digest('hex');
        return generatedSignature === signature;
    }
    async getPayment(paymentId) {
        if (!this.razorpay) {
            throw new Error('Razorpay is not initialized');
        }
        try {
            return await this.razorpay.payments.fetch(paymentId);
        }
        catch (error) {
            this.logger.error(`Failed to fetch payment: ${error.message}`);
            throw error;
        }
    }
    async createRefund(paymentId, amount, notes) {
        if (!this.razorpay) {
            throw new Error('Razorpay is not initialized');
        }
        try {
            return await this.razorpay.payments.refund(paymentId, {
                amount: Math.round(amount * 100),
                notes: notes || {},
            });
        }
        catch (error) {
            this.logger.error(`Failed to create refund: ${error.message}`);
            throw error;
        }
    }
};
exports.RazorpayService = RazorpayService;
exports.RazorpayService = RazorpayService = RazorpayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RazorpayService);
//# sourceMappingURL=razorpay.service.js.map