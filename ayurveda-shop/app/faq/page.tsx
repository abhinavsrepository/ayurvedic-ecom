import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generatePageMetadata } from '@/lib/seo/config';
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'FAQs | Frequently Asked Questions',
  description: 'Find answers to frequently asked questions about our Ayurvedic products, shipping, returns, and more.',
  path: '/faq',
});

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does delivery take?",
        a: "We typically deliver within 3-5 business days for domestic orders. International shipping may take 7-14 days depending on the destination. You can track your order status in your account dashboard."
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free shipping on all orders above ₹999. For orders below this amount, a nominal shipping fee of ₹50 is charged."
      },
      {
        q: "How can I track my order?",
        a: "Once your order is shipped, you will receive an email with a tracking link. You can also track your order by logging into your account and visiting the 'My Orders' section."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. Please check the shipping calculator at checkout for exact rates."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy for unused products in their original packaging. If you're not satisfied with your purchase, you can initiate a return through your account or by contacting our support team."
      },
      {
        q: "How do I initiate a return?",
        a: "To initiate a return, log into your account, go to 'My Orders', select the order you want to return, and click on 'Return Item'. Follow the instructions to complete the return process."
      },
      {
        q: "When will I receive my refund?",
        a: "Once we receive and inspect your returned item, we will process your refund within 5-7 business days. The refund will be credited to your original payment method."
      },
      {
        q: "Can I exchange a product?",
        a: "Yes, we offer exchanges for damaged or defective products. Please contact our support team within 48 hours of delivery to initiate an exchange."
      }
    ]
  },
  {
    category: "Products & Usage",
    questions: [
      {
        q: "Are your products 100% natural?",
        a: "Yes, all our products are made with 100% natural and organic Ayurvedic ingredients. We don't use any harmful chemicals, artificial preservatives, or synthetic fragrances."
      },
      {
        q: "How do I know which product is right for me?",
        a: "You can take our free Dosha Quiz to understand your body type and get personalized product recommendations. You can also consult with our Ayurvedic experts for guidance."
      },
      {
        q: "Are your products safe for sensitive skin?",
        a: "Our products are formulated to be gentle and suitable for most skin types. However, we recommend doing a patch test before first use, especially if you have sensitive skin."
      },
      {
        q: "What is the shelf life of your products?",
        a: "Most of our products have a shelf life of 24-36 months from the date of manufacture. The exact expiry date is mentioned on each product's packaging."
      }
    ]
  },
  {
    category: "Account & Payment",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards, UPI, net banking, wallets, and Cash on Delivery (COD) for orders up to ₹10,000."
      },
      {
        q: "Is it safe to use my credit card on your website?",
        a: "Yes, our website uses SSL encryption to protect your personal and payment information. We are PCI DSS compliant and never store your complete card details."
      },
      {
        q: "How do I reset my password?",
        a: "To reset your password, click on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a password reset link."
      },
      {
        q: "Can I modify or cancel my order?",
        a: "You can modify or cancel your order within 2 hours of placing it. After that, the order enters our processing system and cannot be modified."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main id="main-content" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-16 sm:mt-20">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
            <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Find answers to common questions about our products, shipping, returns, and more.
            Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 pb-2 border-b border-gray-200">
                {category.category}
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <details
                    key={faqIndex}
                    className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-4 sm:p-5 bg-white hover:bg-gray-50 transition-colors tap-target">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">
                        {faq.q}
                      </span>
                      <span className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-open:rotate-180 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="p-4 sm:p-5 pt-0 sm:pt-0">
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center text-white">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
              Still Have Questions?
            </h2>
            <p className="text-white/90 mb-5 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base">
              Our customer support team is here to help. Reach out to us and we&apos;ll get back to you as soon as possible.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-white text-green-600 font-semibold rounded-full hover:bg-green-50 transition-colors tap-target text-sm sm:text-base"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
