'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = () => {
    const validCodes: Record<string, number> = {
      'AYUR10': subtotal * 0.1,
      'WELCOME20': subtotal * 0.2,
      'SAVE50': 50,
    };

    if (validCodes[promoCode.toUpperCase()]) {
      setDiscount(validCodes[promoCode.toUpperCase()]);
    } else {
      setDiscount(0);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main id="main-content" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 mt-16 sm:mt-20">
          <div className="max-w-md mx-auto text-center px-4">
            <ShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors tap-target"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
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

      <main id="main-content" className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-16 sm:mt-20">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemTotal = item.price * item.quantity;
              const itemDiscount = item.originalPrice
                ? (item.originalPrice - item.price) * item.quantity
                : 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
                >
                  {/* Product Image */}
                  <Link href={`/product/${item.slug}`} className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="relative w-32 h-40 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Product';
                        }}
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0 flex-1 pr-2">
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-base sm:text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        {item.variant && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Variant: {item.variant}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors tap-target flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-3 sm:mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-xs sm:text-sm text-gray-600">Qty:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-2 sm:px-3 hover:bg-gray-100 transition-colors tap-target"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 sm:px-4 py-2 font-semibold min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-2 sm:px-3 hover:bg-gray-100 transition-colors tap-target"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </div>
                        {item.originalPrice && (
                          <div className="text-xs sm:text-sm text-gray-500">
                            <span className="line-through">
                              ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <span className="text-green-600 ml-2">
                              Save ₹{itemDiscount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full py-3 border-2 border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors tap-target text-sm sm:text-base"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 sticky top-24">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-5 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 sm:px-5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors tap-target text-sm sm:text-base whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Promo applied: -₹{discount.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Tax (GST 18%)</span>
                  <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm sm:text-base">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-3.5 sm:py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center tap-target text-sm sm:text-base"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <Link
                href="/shop"
                className="block text-center mt-3 sm:mt-4 text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200 space-y-2">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>100% Authentic Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
