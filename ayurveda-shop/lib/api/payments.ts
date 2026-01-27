/**
 * Payments API Module
 *
 * API methods for payment processing with Razorpay.
 */

import { apiClient } from './client';

export type PaymentProvider = 'STRIPE' | 'RAZORPAY';

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  paymentMethodId?: string;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  orderId: string;
}

export interface VerifyRazorpayRequest {
  orderId: string;
  paymentId: string;
  signature: string;
  internalOrderId: string;
}

export interface PaymentStatus {
  orderId: string;
  orderNumber: string;
  paymentStatus: string;
  orderStatus: string;
  total: number;
}

export interface RefundRequest {
  orderId: string;
  amount: number;
  reason: string;
}

export interface RefundResponse {
  success: boolean;
  message: string;
  orderId: string;
  refundAmount: number;
}

export const paymentsApi = {
  /**
   * Create a payment order
   */
  createPayment: async (data: CreatePaymentRequest): Promise<RazorpayOrder> => {
    return apiClient.post<RazorpayOrder>('/api/payments/create', data);
  },

  /**
   * Verify Razorpay payment
   */
  verifyRazorpay: async (
    data: VerifyRazorpayRequest,
  ): Promise<{ success: boolean }> => {
    return apiClient.post('/api/payments/verify/razorpay', data);
  },

  /**
   * Get payment status for an order
   */
  getStatus: async (orderId: string): Promise<PaymentStatus> => {
    return apiClient.get<PaymentStatus>(`/api/payments/status/${orderId}`);
  },

  /**
   * Process refund (Admin only)
   */
  processRefund: async (data: RefundRequest): Promise<RefundResponse> => {
    return apiClient.post<RefundResponse>('/api/payments/refund', data);
  },
};

// Helper to initialize Razorpay checkout
export const initRazorpayCheckout = async (
  razorpayOrder: RazorpayOrder,
  options: {
    name: string;
    description: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
    };
    onSuccess: (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => void;
    onError?: (error: any) => void;
    onClose?: () => void;
  },
) => {
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  if (!razorpayKeyId) {
    throw new Error('Razorpay key ID not configured');
  }

  // Load Razorpay script if not already loaded
  if (typeof window !== 'undefined' && !(window as any).Razorpay) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  }

  const razorpayOptions = {
    key: razorpayKeyId,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    name: options.name,
    description: options.description,
    order_id: razorpayOrder.id,
    prefill: options.prefill || {},
    theme: options.theme || { color: '#22c55e' },
    handler: options.onSuccess,
    modal: {
      ondismiss: options.onClose,
    },
  };

  const razorpay = new (window as any).Razorpay(razorpayOptions);
  razorpay.on('payment.failed', options.onError);
  razorpay.open();
};

export default paymentsApi;
