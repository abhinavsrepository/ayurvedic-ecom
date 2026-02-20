'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi } from '@/lib/api/orders';
import { Order, OrderStatus, PaymentStatus } from '@/lib/api/types';
import { Loader2, ArrowLeft, Package, XCircle, Truck, CheckCircle, Clock, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders/' + orderId);
      return;
    }

    if (isAuthenticated && orderId) {
      fetchOrder();
    }
  }, [isAuthenticated, authLoading, orderId, router]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const orderData = await ordersApi.getById(orderId);
      setOrder(orderData);
    } catch (error: any) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order details');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      await ordersApi.cancel(orderId, 'Cancelled by customer');
      toast.success('Order cancelled successfully');
      fetchOrder();
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      toast.error('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case OrderStatus.CONFIRMED:
        return <CheckCircle className="w-6 h-6 text-blue-600" />;
      case OrderStatus.PROCESSING:
        return <Package className="w-6 h-6 text-purple-600" />;
      case OrderStatus.SHIPPED:
        return <Truck className="w-6 h-6 text-indigo-600" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case OrderStatus.CANCELLED:
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.PROCESSING:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.SHIPPED:
        return 'bg-indigo-100 text-indigo-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.PAID:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case PaymentStatus.REFUNDED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancel = (status: string) => {
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(status as OrderStatus);
  };

  const getOrderTimeline = (status: string) => {
    const steps = [
      { key: OrderStatus.PENDING, label: 'Order Placed', icon: Clock },
      { key: OrderStatus.CONFIRMED, label: 'Confirmed', icon: CheckCircle },
      { key: OrderStatus.PROCESSING, label: 'Processing', icon: Package },
      { key: OrderStatus.SHIPPED, label: 'Shipped', icon: Truck },
      { key: OrderStatus.DELIVERED, label: 'Delivered', icon: CheckCircle },
    ];

    const currentIndex = steps.findIndex(s => s.key === status);
    
    return (
      <div className="flex items-center justify-between mb-8 overflow-x-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.key} className="flex flex-col items-center min-w-[80px]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
              } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs mt-2 ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-16 mt-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-green-600" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-16 mt-20">
          <div className="text-center">
            <p className="text-gray-600">Order not found</p>
            <Link href="/orders" className="text-green-600 hover:underline mt-4 inline-block">
              Back to Orders
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 mt-20">
        <Link href="/orders" className="inline-flex items-center text-green-600 mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                  <p className="text-gray-600 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {order.status !== OrderStatus.CANCELLED && getOrderTimeline(order.status)}

              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-4 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Rs.{item.unitPrice.toLocaleString()} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">Rs.{item.lineTotal.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Tracking Information
                </h2>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Carrier:</span> {order.carrier}</p>
                  <p><span className="text-gray-600">Tracking Number:</span> {order.trackingNumber}</p>
                  <a
                    href={`https://tracking.example.com/${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Track Package
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs.{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Rs.{order.shippingAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Rs.{order.taxAmount.toLocaleString()}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-Rs.{order.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                  <span>Total</span>
                  <span>Rs.{order.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusBadgeColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h2>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.customerName}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {canCancel(order.status) && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="w-full py-3 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {cancelling ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 mr-2" />
                )}
                Cancel Order
              </button>
            )}

            {order.cancelledAt && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Order Cancelled</p>
                <p className="text-red-600 text-sm mt-1">
                  Cancelled on {new Date(order.cancelledAt).toLocaleDateString()}
                </p>
                {order.cancelledReason && (
                  <p className="text-red-600 text-sm mt-1">Reason: {order.cancelledReason}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
