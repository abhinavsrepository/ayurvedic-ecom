import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generatePageMetadata } from '@/lib/seo/config';
import { RefreshCw, Package, ShieldCheck, AlertCircle, ArrowLeftRight } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Return & Refund Policy',
  description: 'Learn about our return and refund policy for Ayurvedic products. Easy returns within 30 days, hassle-free refunds, and simple exchange process.',
  path: '/refund',
  keywords: [
    'return policy',
    'refund policy',
    'product returns',
    'money back guarantee',
    'exchange policy',
    'ayurvedic product returns',
  ],
});

const returnPolicySections = [
  {
    icon: RefreshCw,
    title: 'Return Policy',
    content: [
      {
        heading: '30-Day Return Window',
        text: 'We offer a 30-day return policy from the date of delivery. If you are not satisfied with your purchase, you can return the product for a full refund or exchange.',
      },
      {
        heading: 'Condition Requirements',
        text: 'Products must be returned in their original packaging, unused, and in the same condition as received. All tags, labels, and accessories must be intact.',
      },
      {
        heading: 'How to Initiate a Return',
        text: 'Log into your account, go to "My Orders," select the order you wish to return, and click "Return Item." Follow the instructions to generate a return label.',
      },
    ],
  },
  {
    icon: Package,
    title: 'Refund Process',
    content: [
      {
        heading: 'Inspection Period',
        text: 'Once we receive your returned item, our team will inspect it within 2-3 business days to ensure it meets our return conditions.',
      },
      {
        heading: 'Refund Timeline',
        text: 'After approval, refunds will be processed within 5-7 business days. The refund will be credited to your original payment method.',
      },
      {
        heading: 'Refund Methods',
        text: 'Refunds are issued to the original payment method used for the purchase. For COD orders, refunds will be processed via bank transfer or UPI.',
      },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Eligibility Criteria',
    content: [
      {
        heading: 'Eligible Items',
        text: 'Most unused products in original packaging are eligible for return. This includes herbal supplements, oils, skincare products, and wellness items.',
      },
      {
        heading: 'Proof of Purchase',
        text: 'A valid order number or receipt is required for all returns. Gift recipients may return items with a gift receipt.',
      },
      {
        heading: 'Damaged or Defective Items',
        text: 'If you receive a damaged or defective product, please contact us within 48 hours of delivery for immediate replacement or refund.',
      },
    ],
  },
  {
    icon: AlertCircle,
    title: 'Non-Returnable Items',
    content: [
      {
        heading: 'Personal Care Products',
        text: 'For hygiene reasons, opened or used personal care products, including skincare, haircare, and oral care items, cannot be returned.',
      },
      {
        heading: 'Consumable Products',
        text: 'Opened food items, supplements, and beverages are not eligible for return unless defective or expired.',
      },
      {
        heading: 'Gift Cards & Promotional Items',
        text: 'Gift cards, promotional items, and products marked as "Final Sale" are non-returnable and non-refundable.',
      },
    ],
  },
  {
    icon: ArrowLeftRight,
    title: 'Exchange Policy',
    content: [
      {
        heading: 'Size/Variant Exchanges',
        text: 'We offer free exchanges for different sizes or variants of the same product, subject to availability.',
      },
      {
        heading: 'Exchange Process',
        text: 'To exchange a product, initiate a return and place a new order for the desired item, or contact our customer support for assistance.',
      },
      {
        heading: 'Price Differences',
        text: 'If exchanging for a higher-priced item, you will need to pay the difference. For lower-priced exchanges, the difference will be refunded.',
      },
    ],
  },
];

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main id="main-content" className="mt-16 sm:mt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
                <RefreshCw className="w-4 h-4" />
                <span>Customer Satisfaction Guaranteed</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 sm:mb-6">
                Return & Refund Policy
              </h1>
              
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                We want you to be completely satisfied with your purchase. If you are not happy with your order, 
                we offer hassle-free returns and refunds within 30 days of delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Policy Sections */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
              {returnPolicySections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-3 sm:gap-4 mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900">
                          {section.title}
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {section.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="border-l-4 border-green-200 pl-4 sm:pl-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                              {item.heading}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Return Steps */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-4">
                  How to Return an Item
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Follow these simple steps to return your product
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  {
                    step: '1',
                    title: 'Log In',
                    desc: 'Access your account and go to "My Orders"',
                  },
                  {
                    step: '2',
                    title: 'Select Order',
                    desc: 'Choose the order you want to return',
                  },
                  {
                    step: '3',
                    title: 'Request Return',
                    desc: 'Click "Return Item" and follow instructions',
                  },
                  {
                    step: '4',
                    title: 'Ship Product',
                    desc: 'Pack and ship the item using provided label',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 sm:p-6 text-center"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3 sm:mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center text-white">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                  Need Help with a Return?
                </h2>
                <p className="text-white/90 mb-5 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base">
                  Our customer support team is here to assist you with any questions about returns, refunds, or exchanges.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-block px-6 py-3 bg-white text-green-600 font-semibold rounded-full hover:bg-green-50 transition-colors tap-target text-sm sm:text-base"
                  >
                    Contact Support
                  </a>
                  <a
                    href="/faq"
                    className="inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-full hover:bg-green-800 transition-colors tap-target text-sm sm:text-base"
                  >
                    View FAQs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
