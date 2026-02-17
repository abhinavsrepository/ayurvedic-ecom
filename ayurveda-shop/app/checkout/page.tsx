'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, CheckCircle, CreditCard, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { ordersApi } from '@/lib/api/orders';
import { paymentsApi, loadRazorpayScript, initializeRazorpay } from '@/lib/api/payments';
import { PaymentProvider } from '@/lib/api/types';
import { Spinner, ButtonSpinner } from '@/components/shared/Spinner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  // Load Razorpay script
  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
    });
  }, []);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        firstName: user.fullName?.split(' ')[0] || '',
        lastName: user.fullName?.split(' ').slice(1).join(' ') || '',
      }));
    }
  }, [user]);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push('/cart');
    }
  }, [items.length, router, isProcessing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createOrder = async (): Promise<string | null> => {
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddressLine1: formData.address,
        shippingAddressLine2: '',
        shippingCity: formData.city,
        shippingState: formData.state,
        shippingPostalCode: formData.pincode,
        shippingCountry: 'India',
        notes: '',
      };

      const order = await ordersApi.create(orderData);
      return order.id;
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error('Failed to create order', {
        description: error.response?.data?.message || 'Please try again',
      });
      return null;
    }
  };

  const handleRazorpayPayment = async (orderId: string) => {
    if (!razorpayLoaded) {
      toast.error('Payment system not loaded');
      return;
    }

    try {
      const paymentOrder = await paymentsApi.create({
        orderId,
        amount: total * 100,
        currency: 'INR',
        provider: PaymentProvider.RAZORPAY,
      });

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_KEY';
      
      const rzp = initializeRazorpay(
        {
          key: razorpayKey,
          amount: total * 100,
          currency: 'INR',
          orderId: paymentOrder.id,
          name: 'AyurHerb',
          description: `Order for ${items.length} items`,
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: '#2E7D32' },
        },
        async (response) => {
          try {
            await paymentsApi.verifyRazorpay({
              orderId: paymentOrder.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              internalOrderId: orderId,
            });
            await clearCart();
            toast.success('Payment successful!');
            router.push(`/order-success?orderId=${orderId}`);
          } catch (verifyError) {
            toast.error('Payment verification failed');
          }
        },
        (error) => {
          toast.error('Payment failed');
        }
      );

      if (rzp) rzp.open();
    } catch (error: any) {
      toast.error('Failed to initialize payment');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      router.push('/login?redirect=/checkout');
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = await createOrder();
      if (!orderId) {
        setIsProcessing(false);
        return;
      }

      if (formData.paymentMethod === 'online') {
        await handleRazorpayPayment(orderId);
        setIsProcessing(false);
      } else {
        await clearCart();
        toast.success('Order placed successfully!');
        router.push(`/order-success?orderId=${orderId}`);
      }
    } catch (error: any) {
      toast.error('Failed to place order');
      setIsProcessing(false);
    }
  };

  // Show loading state while redirecting if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" text="Redirecting to cart..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        <Link href="/cart" className="inline-flex items-center text-green-600 mb-6 hover:underline">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Please <Link href="/login?redirect=/checkout" className="font-semibold underline">login</Link> to place an order.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                <textarea
                  name="address"
                  placeholder="Street Address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 mb-4"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <select
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <Wallet className="w-6 h-6 ml-4 mr-3" />
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive</p>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <CreditCard className="w-6 h-6 ml-4 mr-3" />
                    <div>
                      <p className="font-semibold">Online Payment</p>
                      <p className="text-sm text-gray-600">UPI, Cards, Net Banking</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-medium">Rs.{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6 pb-6 border-t border-b pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs.{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `Rs.${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>Rs.{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold mb-6">
                  <span>Total</span>
                  <span>Rs.{total.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !isAuthenticated}
                  className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <ButtonSpinner size="md" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Place Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
