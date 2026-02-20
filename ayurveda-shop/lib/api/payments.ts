import { apiClient } from './client';
import {
  CreatePaymentDto,
  PaymentResponse,
  RazorpayPaymentData,
  StripePaymentData,
  PaymentStatusResponse,
  PaymentProvider,
} from './types';

export const paymentsApi = {
  // Create a payment order/intent
  create: async (data: CreatePaymentDto): Promise<PaymentResponse> => {
    return apiClient.post<PaymentResponse>('/api/payments/create', data);
  },

  // Verify Razorpay payment
  verifyRazorpay: async (data: RazorpayPaymentData): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>('/api/payments/verify/razorpay', data);
  },

  // Verify Stripe payment
  verifyStripe: async (data: StripePaymentData): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>('/api/payments/verify/stripe', data);
  },

  // Get payment status for an order
  getStatus: async (orderId: string): Promise<PaymentStatusResponse> => {
    const response = await apiClient.get<any>(`/api/payments/status/${orderId}`);
    return {
      ...response,
      paymentStatus: typeof response.paymentStatus === 'string'
        ? response.paymentStatus.toLowerCase()
        : response.paymentStatus,
      orderStatus: typeof response.orderStatus === 'string'
        ? response.orderStatus.toLowerCase()
        : response.orderStatus,
    };
  },

  // Process refund (Admin only)
  processRefund: async (orderId: string, amount: number, reason: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>('/api/payments/refund', {
      orderId,
      amount,
      reason,
    });
  },
};

// Razorpay checkout helper
export const initializeRazorpay = (
  orderDetails: {
    key: string;
    amount: number;
    currency: string;
    orderId: string;
    name: string;
    description: string;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    theme?: {
      color: string;
    };
  },
  onSuccess: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void,
  onError: (error: any) => void
) => {
  if (typeof window === 'undefined' || !(window as any).Razorpay) {
    onError(new Error('Razorpay SDK not loaded'));
    return null;
  }

  const options = {
    key: orderDetails.key,
    amount: orderDetails.amount,
    currency: orderDetails.currency,
    order_id: orderDetails.orderId,
    name: orderDetails.name,
    description: orderDetails.description,
    handler: onSuccess,
    prefill: orderDetails.prefill,
    theme: orderDetails.theme || { color: '#2E7D32' },
    modal: {
      ondismiss: () => {
        console.log('Payment modal closed');
      },
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.on('payment.failed', onError);
  return rzp;
};

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
