'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, RefreshCcw } from 'lucide-react';
import { ordersApi } from '@/lib/api/admin';
import { toast } from 'sonner';

type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: any[];
  createdAt: string;
};

type TrackingInfo = {
  orderNumber?: string;
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  trackingNumber?: string;
  carrier?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  returned: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  refunded: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
};

const formatCurrency = (value: number) => `Rs.${Number(value || 0).toLocaleString('en-IN')}`;

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefunding, setIsRefunding] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const [orderData, trackingData] = await Promise.all([
          ordersApi.get(orderId),
          ordersApi.track(orderId).catch(() => null),
        ]);

        setOrder(orderData as AdminOrder);
        setTracking(trackingData as TrackingInfo | null);
      } catch (error: any) {
        console.error('Failed to fetch order details:', error);
        toast.error('Failed to load order details');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const timeline = useMemo(() => {
    if (!order) return [];
    return [
      {
        status: 'created',
        timestamp: order.createdAt,
        note: `Order created (${order.orderNumber})`,
      },
      {
        status: order.status,
        timestamp: tracking?.updatedAt || order.createdAt,
        note:
          tracking?.trackingNumber && tracking?.carrier
            ? `Tracking ${tracking.trackingNumber} via ${tracking.carrier}`
            : undefined,
      },
    ];
  }, [order, tracking]);

  const handleRefund = async () => {
    if (!order) return;

    setIsRefunding(true);
    try {
      await ordersApi.refund(order.id, order.total, 'Refund processed by admin');
      toast.success('Refund processed successfully', {
        description: `${formatCurrency(order.total)} has been refunded`,
      });

      const [orderData, trackingData] = await Promise.all([
        ordersApi.get(order.id),
        ordersApi.track(order.id).catch(() => null),
      ]);
      setOrder(orderData as AdminOrder);
      setTracking(trackingData as TrackingInfo | null);
    } catch (error: any) {
      console.error('Failed to process refund:', error);
      toast.error('Failed to process refund');
    } finally {
      setIsRefunding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Order not found</p>
        <button
          onClick={() => router.push('/admin/orders')}
          className="mt-4 text-green-600 hover:text-green-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/admin/orders')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Order {order.orderNumber}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>
            {order.status}
          </span>
          {(order.status === 'delivered' || order.status === 'returned') && order.paymentStatus === 'paid' && (
            <button
              onClick={handleRefund}
              disabled={isRefunding}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw className={`w-4 h-4 mr-2 ${isRefunding ? 'animate-spin' : ''}`} />
              {isRefunding ? 'Processing...' : 'Refund Order'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Items
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {order.items.map((item) => {
                const productName = item.productName || item.product_name || 'Product';
                const quantity = Number(item.quantity || 0);
                const unitPrice = Number(item.unitPrice ?? item.unit_price ?? 0);
                const lineTotal = Number(item.lineTotal ?? item.line_total ?? 0);

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {productName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(lineTotal)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(unitPrice)} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Order Timeline
              </h2>
            </div>
            <div className="p-6">
              <div className="relative">
                {timeline.map((event, index) => (
                  <div key={index} className="flex items-start mb-6 last:mb-0">
                    <div className="relative">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-green-600 rounded-full" />
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="absolute top-10 left-5 w-0.5 h-full bg-gray-300 dark:bg-gray-600" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {event.status}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.timestamp).toLocaleString('en-IN')}
                      </p>
                      {event.note && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {event.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.customerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.customerEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.customerPhone || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Shipping Address
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p>{tracking?.shippingAddress?.line1 || 'N/A'}</p>
              {tracking?.shippingAddress?.line2 && <p>{tracking.shippingAddress.line2}</p>}
              <p>
                {tracking?.shippingAddress?.city || '-'}, {tracking?.shippingAddress?.state || '-'}
              </p>
              <p>{tracking?.shippingAddress?.postalCode || '-'}</p>
              <p>{tracking?.shippingAddress?.country || '-'}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Method</span>
                <span className="font-medium text-gray-900 dark:text-white">{order.paymentMethod || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Tax</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-900 dark:text-white">
                    {order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Discount</span>
                    <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {(tracking?.trackingNumber || tracking?.carrier) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Shipment
              </h3>
              <div className="space-y-2 text-sm">
                {tracking?.carrier && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Carrier</span>
                    <span className="font-medium text-gray-900 dark:text-white">{tracking.carrier}</span>
                  </div>
                )}
                {tracking?.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Tracking</span>
                    <span className="font-medium text-gray-900 dark:text-white">{tracking.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
