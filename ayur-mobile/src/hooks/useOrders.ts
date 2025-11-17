/**
 * Orders React Query Hooks
 *
 * Provides hooks for all order operations including:
 * - Creating orders
 * - Fetching order history
 * - Order tracking
 * - Order cancellation
 *
 * Integrates with orderService for API calls and proper caching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderKeys, cartKeys } from '../lib/constants/queryKeys';
import * as orderService from '../services/api/orderService';

/**
 * Hook for fetching orders with filters and pagination
 *
 * @param params - Query parameters including filters
 * @example
 * ```tsx
 * const { data, isLoading } = useOrders({ status: 'delivered', page: 1 });
 * ```
 */
export const useOrders = (params?: orderService.OrderQueryParams) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderService.getOrders(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching single order by ID
 *
 * @param id - Order ID
 * @param options - Query options
 * @example
 * ```tsx
 * const { data: order } = useOrder('order-123');
 * ```
 */
export const useOrder = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrder(id),
    enabled: !!id && (options?.enabled ?? true),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for creating a new order
 * Automatically clears cart on success
 *
 * @example
 * ```tsx
 * const { mutate: createOrder, isPending } = useCreateOrder();
 *
 * createOrder({
 *   shippingAddressId: 'addr-123',
 *   paymentMethod: 'card'
 * });
 * ```
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (data) => {
      // Invalidate orders list to include new order
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      // Clear cart after successful order
      queryClient.invalidateQueries({ queryKey: cartKeys.current() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });

      // Set order details in cache
      queryClient.setQueryData(orderKeys.detail(data.order.id), data.order);
    },
  });
};

/**
 * Hook for tracking order status and shipping
 * Includes polling for real-time updates
 *
 * @param id - Order ID
 * @param options - Query options including refetch interval
 * @example
 * ```tsx
 * const { data: tracking } = useTrackOrder('order-123', {
 *   refetchInterval: 30000 // Poll every 30 seconds
 * });
 * ```
 */
export const useTrackOrder = (
  id: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery({
    queryKey: orderKeys.tracking(id),
    queryFn: () => orderService.trackOrder(id),
    enabled: !!id && (options?.enabled ?? true),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: options?.refetchInterval ?? false, // Optional polling
  });
};

/**
 * Hook for canceling an order
 *
 * @example
 * ```tsx
 * const { mutate: cancelOrder } = useCancelOrder();
 *
 * cancelOrder({
 *   orderId: 'order-123',
 *   reason: 'Changed my mind'
 * });
 * ```
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      reason,
    }: {
      orderId: string;
      reason?: string;
    }) => orderService.cancelOrder(orderId, reason),
    onSuccess: (data, variables) => {
      // Update order in cache
      queryClient.setQueryData(orderKeys.detail(variables.orderId), data);

      // Invalidate orders list to reflect status change
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      // Invalidate tracking
      queryClient.invalidateQueries({
        queryKey: orderKeys.tracking(variables.orderId),
      });
    },
  });
};

/**
 * Hook for requesting order return
 *
 * @example
 * ```tsx
 * const { mutate: requestReturn } = useRequestReturn();
 *
 * requestReturn({
 *   orderId: 'order-123',
 *   items: [{ itemId: 'item-1', quantity: 1 }],
 *   reason: 'Damaged product'
 * });
 * ```
 */
export const useRequestReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      items,
      reason,
    }: {
      orderId: string;
      items: Array<{ itemId: string; quantity: number }>;
      reason: string;
    }) => orderService.requestReturn(orderId, items, reason),
    onSuccess: (data, variables) => {
      // Invalidate order details to reflect return request
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });

      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      // Invalidate returns list
      queryClient.invalidateQueries({ queryKey: orderKeys.returns() });
    },
  });
};

/**
 * Hook for confirming order receipt
 *
 * @example
 * ```tsx
 * const { mutate: confirmReceipt } = useConfirmOrderReceipt();
 *
 * confirmReceipt('order-123');
 * ```
 */
export const useConfirmOrderReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.confirmOrderReceipt(orderId),
    onSuccess: (data, orderId) => {
      queryClient.setQueryData(orderKeys.detail(orderId), data);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.tracking(orderId) });
    },
  });
};

/**
 * Hook for reordering (creating new order from previous order)
 *
 * @example
 * ```tsx
 * const { mutate: reorder } = useReorder();
 *
 * reorder('order-123');
 * ```
 */
export const useReorder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.reorder(orderId),
    onSuccess: (data) => {
      // Add new order to cache
      queryClient.setQueryData(orderKeys.detail(data.order.id), data.order);

      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      // Update cart if items were added
      queryClient.invalidateQueries({ queryKey: cartKeys.current() });
    },
  });
};

/**
 * Hook for fetching order invoice
 *
 * @param orderId - Order ID
 * @example
 * ```tsx
 * const { data: invoice } = useOrderInvoice('order-123');
 * ```
 */
export const useOrderInvoice = (orderId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: orderKeys.invoice(orderId),
    queryFn: () => orderService.getOrderInvoice(orderId),
    enabled: !!orderId && (options?.enabled ?? true),
    staleTime: 30 * 60 * 1000, // 30 minutes - invoices don't change
  });
};

/**
 * Hook for downloading order invoice PDF
 *
 * @example
 * ```tsx
 * const { mutate: downloadInvoice } = useDownloadInvoice();
 *
 * downloadInvoice('order-123');
 * ```
 */
export const useDownloadInvoice = () => {
  return useMutation({
    mutationFn: (orderId: string) => orderService.downloadInvoice(orderId),
  });
};

/**
 * Hook for updating order payment method
 *
 * @example
 * ```tsx
 * const { mutate: updatePayment } = useUpdateOrderPayment();
 *
 * updatePayment({
 *   orderId: 'order-123',
 *   paymentMethod: 'upi'
 * });
 * ```
 */
export const useUpdateOrderPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      paymentMethod,
    }: {
      orderId: string;
      paymentMethod: any;
    }) => orderService.updateOrderPayment(orderId, paymentMethod),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
    },
  });
};

/**
 * Hook for confirming payment
 *
 * @example
 * ```tsx
 * const { mutate: confirmPayment } = useConfirmPayment();
 *
 * confirmPayment({
 *   orderId: 'order-123',
 *   paymentDetails: {
 *     transactionId: 'txn-456',
 *     method: 'card'
 *   }
 * });
 * ```
 */
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      paymentDetails,
    }: {
      orderId: string;
      paymentDetails: any;
    }) => orderService.confirmPayment(orderId, paymentDetails),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(orderKeys.detail(variables.orderId), data);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

/**
 * Hook for fetching order statistics
 *
 * @example
 * ```tsx
 * const { data: stats } = useOrderStatistics();
 * ```
 */
export const useOrderStatistics = () => {
  return useQuery({
    queryKey: [...orderKeys.all, 'statistics'],
    queryFn: orderService.getOrderStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for verifying payment status
 *
 * @param orderId - Order ID
 * @param options - Query options including refetch interval for polling
 * @example
 * ```tsx
 * const { data: paymentStatus } = useVerifyPaymentStatus('order-123', {
 *   refetchInterval: 5000 // Poll every 5 seconds
 * });
 * ```
 */
export const useVerifyPaymentStatus = (
  orderId: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery({
    queryKey: [...orderKeys.detail(orderId), 'payment-status'],
    queryFn: () => orderService.verifyPaymentStatus(orderId),
    enabled: !!orderId && (options?.enabled ?? true),
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: options?.refetchInterval ?? false,
  });
};
