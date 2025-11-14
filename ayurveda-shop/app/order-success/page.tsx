'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle, Package, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Trigger confetti animation
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Load order details
    if (orderId && typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('ayurveda_orders') || '[]');
      const foundOrder = orders.find((o: any) => o.id === orderId);
      setOrder(foundOrder);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-16 mt-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {/* Order Details Card */}
          {order && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-left">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h2>
                <p className="text-gray-600">
                  Order ID: <span className="font-semibold text-gray-900">{order.id}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                <div className="text-gray-600">
                  <p className="font-medium text-gray-900">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p>{order.customer.address}</p>
                  <p>
                    {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                  </p>
                  <p className="mt-2">Phone: {order.customer.phone}</p>
                  <p>Email: {order.customer.email}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Items ({order.items.length})</span>
                  <span className="font-medium">
                    ₹{order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900">
                  <span>Total Paid</span>
                  <span>₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start text-left">
              <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• You'll receive an order confirmation email shortly</li>
                  <li>• We'll notify you when your order is shipped</li>
                  <li>• Track your order status in your account</li>
                  <li>• Expected delivery: 5-7 business days</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
