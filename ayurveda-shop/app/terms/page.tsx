import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generatePageMetadata } from '@/lib/seo/config';
import { FileText, Globe, Package, CreditCard, Truck, RefreshCw, Lightbulb, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms & Conditions',
  description: 'Read our terms and conditions for using Kosmico Wellness website and services. Understand your rights and responsibilities.',
  path: '/terms',
  keywords: [
    'terms and conditions',
    'terms of service',
    'user agreement',
    'website terms',
    'legal terms',
    'conditions of use',
  ],
});

const termsSections = [
  {
    icon: FileText,
    title: 'Agreement to Terms',
    content: [
      {
        heading: 'Acceptance of Terms',
        text: 'By accessing or using the Kosmico Wellness website, mobile applications, or any of our services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.',
      },
      {
        heading: 'Changes to Terms',
        text: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services after changes constitutes acceptance of the updated terms.',
      },
      {
        heading: 'Eligibility',
        text: 'By using our services, you represent that you are at least 18 years old or have the consent of a parent or guardian. You must have the legal capacity to enter into binding contracts.',
      },
    ],
  },
  {
    icon: Globe,
    title: 'Use of Website',
    content: [
      {
        heading: 'Permitted Use',
        text: 'You may use our website for personal, non-commercial purposes. This includes browsing products, making purchases, and accessing wellness content and resources.',
      },
      {
        heading: 'Prohibited Activities',
        text: 'You agree not to: (a) use the website for any illegal purpose; (b) attempt to gain unauthorized access to our systems; (c) interfere with the proper working of the website; (d) use automated systems to access the website; (e) copy or reproduce website content without permission.',
      },
      {
        heading: 'Account Security',
        text: 'You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized access or security breach.',
      },
    ],
  },
  {
    icon: Package,
    title: 'Product Information',
    content: [
      {
        heading: 'Product Descriptions',
        text: 'We strive to provide accurate product descriptions, images, and information. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.',
      },
      {
        heading: 'Ayurvedic Products Disclaimer',
        text: 'Our products are based on traditional Ayurvedic principles. They are not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare professional before using any new wellness product.',
      },
      {
        heading: 'Allergies and Sensitivities',
        text: 'Customers are responsible for reading product labels and ingredient lists. We are not liable for allergic reactions or sensitivities to product ingredients.',
      },
    ],
  },
  {
    icon: CreditCard,
    title: 'Pricing & Payment',
    content: [
      {
        heading: 'Pricing',
        text: 'All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Prices are subject to change without notice.',
      },
      {
        heading: 'Payment Methods',
        text: 'We accept credit/debit cards, UPI, net banking, digital wallets, and Cash on Delivery (COD) for eligible orders. All payments are processed securely through authorized payment gateways.',
      },
      {
        heading: 'Order Acceptance',
        text: 'Your receipt of an order confirmation does not constitute our acceptance of your order. We reserve the right to refuse or cancel any order for any reason, including product availability or pricing errors.',
      },
    ],
  },
  {
    icon: Truck,
    title: 'Shipping',
    content: [
      {
        heading: 'Delivery Timeline',
        text: 'We strive to deliver orders within the estimated timeframes. However, delivery times are estimates and not guaranteed. Delays may occur due to circumstances beyond our control.',
      },
      {
        heading: 'Shipping Costs',
        text: 'Shipping costs are calculated based on delivery location, order weight, and shipping method. Free shipping may be available for orders above specified amounts.',
      },
      {
        heading: 'Risk of Loss',
        text: 'Risk of loss and title for items pass to you upon delivery to the carrier. We are not responsible for lost or stolen packages after confirmed delivery.',
      },
    ],
  },
  {
    icon: RefreshCw,
    title: 'Returns & Refunds',
    content: [
      {
        heading: 'Return Policy',
        text: 'Our return and refund policy is detailed on our Return Policy page. By making a purchase, you agree to the terms outlined in that policy.',
      },
      {
        heading: 'Refund Processing',
        text: 'Refunds will be processed according to the method of original payment. Processing times may vary depending on your payment provider.',
      },
      {
        heading: 'Damaged Items',
        text: 'Claims for damaged or defective items must be reported within 48 hours of delivery. We may require photographic evidence before processing a claim.',
      },
    ],
  },
  {
    icon: Lightbulb,
    title: 'Intellectual Property',
    content: [
      {
        heading: 'Ownership',
        text: 'All content on this website, including text, graphics, logos, images, audio clips, digital downloads, and software, is the property of Kosmico Wellness or its content suppliers and is protected by copyright laws.',
      },
      {
        heading: 'Trademarks',
        text: 'Kosmico Wellness and associated logos, product names, and taglines are trademarks of Kosmico Wellness. Unauthorized use is strictly prohibited.',
      },
      {
        heading: 'User Content',
        text: 'By submitting reviews, comments, or other content to our website, you grant us a non-exclusive, royalty-free license to use, reproduce, and publish such content.',
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content: [
      {
        heading: 'Disclaimer',
        text: 'Our website and products are provided "as is" without warranties of any kind, either express or implied. We do not guarantee that our website will be uninterrupted or error-free.',
      },
      {
        heading: 'Liability Limit',
        text: 'To the fullest extent permitted by law, Kosmico Wellness shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or products.',
      },
      {
        heading: 'Indemnification',
        text: 'You agree to indemnify and hold harmless Kosmico Wellness, its officers, directors, employees, and agents from any claims arising from your use of our services or violation of these terms.',
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main id="main-content" className="mt-16 sm:mt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
                <FileText className="w-4 h-4" />
                <span>Legal Agreement</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 sm:mb-6">
                Terms & Conditions
              </h1>
              
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                These Terms and Conditions govern your use of the Kosmico Wellness website and services. 
                Please read them carefully before using our platform.
              </p>
              
              <p className="text-sm text-gray-500 mt-6">
                Last Updated: February 2025
              </p>
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
              {termsSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-3 sm:gap-4 mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900">
                          {section.title}
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {section.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="border-l-4 border-amber-200 pl-4 sm:pl-6">
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

        {/* Governing Law */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-4">
                  Governing Law & Dispute Resolution
                </h2>
                <div className="space-y-4 text-gray-600 text-sm sm:text-base">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of India. 
                    Any disputes arising under these terms shall be subject to the exclusive jurisdiction 
                    of the courts in Mumbai, Maharashtra.
                  </p>
                  <p>
                    We encourage you to contact us first if you have any concerns or disputes. 
                    We will make reasonable efforts to resolve any issues amicably before pursuing formal legal action.
                  </p>
                  <p>
                    For any legal notices, please contact us at:
                    <br />
                    <strong>Kosmico Wellness</strong>
                    <br />
                    123 Wellness Street, Mumbai 400001, Maharashtra, India
                    <br />
                    Email: legal@kosmicowellness.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center text-white">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                  Questions About Our Terms?
                </h2>
                <p className="text-white/90 mb-5 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base">
                  If you have any questions about these Terms and Conditions or need clarification on any point, please do not hesitate to contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-block px-6 py-3 bg-white text-amber-600 font-semibold rounded-full hover:bg-amber-50 transition-colors tap-target text-sm sm:text-base"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/faq"
                    className="inline-block px-6 py-3 bg-amber-700 text-white font-semibold rounded-full hover:bg-amber-800 transition-colors tap-target text-sm sm:text-base"
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
