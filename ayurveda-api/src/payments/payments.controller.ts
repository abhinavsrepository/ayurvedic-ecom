import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, PaymentProvider } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create')
    @ApiOperation({ summary: 'Create a payment' })
    @ApiResponse({ status: 201, description: 'Payment created successfully' })
    async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentsService.createPayment(createPaymentDto);
    }

    @Post('verify/stripe')
    @ApiOperation({ summary: 'Verify Stripe payment' })
    async verifyStripePayment(@Body() body: { paymentIntentId: string }) {
        const isValid = await this.paymentsService.verifyPayment(PaymentProvider.STRIPE, body);
        return { success: isValid };
    }

    @Post('verify/razorpay')
    @ApiOperation({ summary: 'Verify Razorpay payment' })
    async verifyRazorpayPayment(@Body() body: { orderId: string; paymentId: string; signature: string }) {
        const isValid = await this.paymentsService.verifyPayment(PaymentProvider.RAZORPAY, body);
        return { success: isValid };
    }
}
