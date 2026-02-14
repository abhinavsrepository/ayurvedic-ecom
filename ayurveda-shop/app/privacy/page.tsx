import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generatePageMetadata } from '@/lib/seo/config';
import { Shield, Eye, Lock, Cookie, UserCheck, Mail } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Learn how we collect, use, and protect your personal information. Your privacy is important to us at Kosmico Wellness.',
  path: '/privacy',
  keywords: [
    'privacy policy',
    'data protection',
    'personal information',
    'cookie policy',
    'GDPR compliance',
    'privacy rights',
  ],
});

const privacySections = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content: [
      {
        heading: 'Personal Information',
        text: 'We collect information you provide directly to us, including your name, email address, phone number, shipping address, billing address, and payment information when you create an account or make a purchase.',
      },
      {
        heading: 'Usage Information',
        text: 'We automatically collect information about your interactions with our website, including IP address, browser type, device information, pages visited, time spent on pages, and referring URLs.',
      },
      {
        heading: 'Health Information',
        text: 'If you use our dosha quiz or consultation services, we may collect health-related information such as your body type, wellness goals, and health concerns to provide personalized recommendations.',
      },
    ],
  },
  {
    icon: Shield,
    title: 'How We Use Your Information',
    content: [
      {
        heading: 'Order Processing',
        text: 'We use your information to process and fulfill your orders, send order confirmations, shipping notifications, and provide customer support related to your purchases.',
      },
      {
        heading: 'Personalization',
        text: 'Your information helps us personalize your experience, recommend products based on your preferences, dosha type, and purchase history.',
      },
      {
        heading: 'Communication',
        text: 'We may send you marketing communications, promotional offers, and wellness tips if you have opted in. You can unsubscribe from these communications at any time.',
      },
      {
        heading: 'Improvement',
        text: 'We analyze usage data to improve our website functionality, product offerings, and overall customer experience.',
      },
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      {
        heading: 'Security Measures',
        text: 'We implement industry-standard security measures including SSL encryption, firewalls, and secure server infrastructure to protect your personal information from unauthorized access.',
      },
      {
        heading: 'Payment Security',
        text: 'All payment transactions are processed through secure, PCI DSS compliant payment gateways. We do not store your complete credit card details on our servers.',
      },
      {
        heading: 'Data Retention',
        text: 'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.',
      },
    ],
  },
  {
    icon: Cookie,
    title: 'Cookies & Tracking',
    content: [
      {
        heading: 'Types of Cookies',
        text: 'We use essential cookies for website functionality, analytics cookies to understand user behavior, and marketing cookies to deliver relevant advertisements.',
      },
      {
        heading: 'Cookie Management',
        text: 'You can manage your cookie preferences through your browser settings. Note that disabling certain cookies may affect website functionality.',
      },
      {
        heading: 'Third-Party Analytics',
        text: 'We use third-party analytics tools like Google Analytics to understand website traffic and usage patterns. These services may use cookies and similar technologies.',
      },
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      {
        heading: 'Access & Correction',
        text: 'You have the right to access, update, or correct your personal information at any time through your account settings or by contacting us.',
      },
      {
        heading: 'Data Portability',
        text: 'You can request a copy of your personal data in a structured, commonly used format for transfer to another service.',
      },
      {
        heading: 'Deletion Rights',
        text: 'You may request the deletion of your personal information, subject to legal obligations that may require us to retain certain data.',
      },
      {
        heading: 'Opt-Out Options',
        text: 'You can opt out of marketing communications, personalized advertising, and certain data processing activities at any time.',
      },
    ],
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content: [
      {
        heading: 'Privacy Inquiries',
        text: 'If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at privacy@kosmicowellness.com.',
      },
      {
        heading: 'Response Time',
        text: 'We aim to respond to all privacy-related inquiries within 48 hours. For complex requests, we may need additional time and will keep you informed of our progress.',
      },
      {
        heading: 'Policy Updates',
        text: 'We may update this Privacy Policy periodically. Significant changes will be notified via email or prominent notice on our website.',
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main id="main-content" className="mt-16 sm:mt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
                <Shield className="w-4 h-4" />
                <span>Your Privacy Matters</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 sm:mb-6">
                Privacy Policy
              </h1>
              
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                At Kosmico Wellness, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This policy explains how we collect, use, and safeguard your data.
              </p>
              
              <p className="text-sm text-gray-500 mt-6">
                Last Updated: February 2025
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
              {privacySections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-3 sm:gap-4 mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900">
                          {section.title}
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {section.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="border-l-4 border-indigo-200 pl-4 sm:pl-6">
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

        {/* Key Highlights */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-4">
                  Our Privacy Commitment
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  We adhere to the highest standards of data protection
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    title: 'No Data Selling',
                    desc: 'We never sell your personal information to third parties.',
                  },
                  {
                    title: 'Secure Encryption',
                    desc: 'All data is encrypted using industry-standard protocols.',
                  },
                  {
                    title: 'Transparent Practices',
                    desc: 'We are clear about what data we collect and why.',
                  },
                  {
                    title: 'Your Control',
                    desc: 'You have full control over your data and preferences.',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 sm:p-6"
                  >
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
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center text-white">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                  Questions About Your Privacy?
                </h2>
                <p className="text-white/90 mb-5 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base">
                  If you have any concerns about how we handle your data or would like to exercise your privacy rights, we are here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition-colors tap-target text-sm sm:text-base"
                  >
                    Contact Us
                  </a>
                  <a
                    href="mailto:privacy@kosmicowellness.com"
                    className="inline-block px-6 py-3 bg-indigo-700 text-white font-semibold rounded-full hover:bg-indigo-800 transition-colors tap-target text-sm sm:text-base"
                  >
                    Email Privacy Team
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
