import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generatePageMetadata } from '@/lib/seo/config';
import StructuredData, { generateArticleSchema } from '@/components/seo/StructuredData';
import { Award, Leaf, Globe, Heart, Users, Target, Sparkles } from 'lucide-react';

// Generate metadata for About page
export const metadata: Metadata = generatePageMetadata({
  title: 'About Us | Our Ayurvedic Journey & Mission',
  description: 'Discover Ayurveda Haven\'s story - bringing ancient Ayurvedic wisdom to modern wellness. Learn about our mission, values, and commitment to authentic, organic Ayurvedic products.',
  path: '/about',
  keywords: [
    'about ayurveda haven',
    'ayurvedic mission',
    'natural wellness company',
    'organic ayurvedic products',
    'ayurvedic brand story',
    'sustainable wellness',
    'authentic ayurveda',
    'holistic health company',
  ],
});

// Enable ISR for better SEO performance
export const revalidate = 86400; // 24 hours

// Article schema for About page (helps with content discovery)
const aboutSchema = generateArticleSchema({
  title: 'About Ayurveda Haven - Our Mission & Story',
  description: 'Learn about Ayurveda Haven\'s commitment to authentic Ayurvedic wellness products and holistic health.',
  image: '/logo.png',
  datePublished: '2020-01-01',
  dateModified: new Date().toISOString(),
  author: 'Ayurveda Haven Team',
  url: 'https://ayurvedahaven.com/about',
});

// Organization schema enhancement
const organizationEnhancedSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ayurveda Haven',
  url: 'https://ayurvedahaven.com',
  logo: 'https://ayurvedahaven.com/logo.png',
  description: 'Premium Ayurvedic wellness products connecting ancient wisdom with modern health needs.',
  foundingDate: '2020-01-01',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Wellness Street',
    addressLocality: 'Mumbai',
    addressRegion: 'MH',
    postalCode: '400001',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91 123 456 7890',
    contactType: 'customer service',
    email: 'info@kosmicowellness.com',
  },
  sameAs: [
    'https://facebook.com/a',
    'https://instagram.com/',
    'https://twitter.com/',
    'https://linkedin.com/company/',
    'https://youtube.com/',
  ],
  slogan: 'Ancient Wisdom, Modern Wellness',
  knowsAbout: [
    'Ayurveda',
    'Herbal Medicine',
    'Natural Wellness',
    'Holistic Health',
    'Organic Products',
    'Traditional Medicine',
    'Plant-based Nutrition',
    'Natural Skincare',
  ],
};

// WebPage schema with about information
const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'About Ayurveda Haven',
  description: 'Learn about our mission, values, and commitment to authentic Ayurvedic wellness.',
  url: 'https://kosmicowellness.com/about',
  about: {
    '@type': 'Thing',
    name: 'Ayurveda Haven Company',
    description: 'A company dedicated to providing authentic, organic Ayurvedic products for modern wellness.',
  },
  mainEntity: {
    '@type': 'Organization',
    name: 'Ayurveda Haven',
  },
};

const values = [
  {
    icon: Leaf,
    title: '100% Natural Ingredients',
    description: 'We source the finest organic herbs and botanicals from trusted farms across India, ensuring purity and authenticity in every product.',
  },
  {
    icon: Award,
    title: 'Quality Assurance',
    description: 'Every product undergoes rigorous testing and quality checks to meet international standards and AYUSH certification requirements.',
  },
  {
    icon: Heart,
    title: 'Customer Wellness First',
    description: 'Your health and satisfaction are our top priority. We provide detailed product information, dosha guidance, and expert support.',
  },
  {
    icon: Globe,
    title: 'Sustainable Practices',
    description: 'We\'re committed to eco-friendly packaging, ethical sourcing, and supporting sustainable farming communities.',
  },
  {
    icon: Users,
    title: 'Community Impact',
    description: 'We empower local farmers and artisans, creating fair trade opportunities while preserving traditional Ayurvedic knowledge.',
  },
  {
    icon: Target,
    title: 'Transparent Sourcing',
    description: 'Complete transparency about our ingredients, processes, and sourcing. No hidden chemicals, no artificial additives.',
  },
];

const timeline = [
  {
    year: '2020',
    title: 'Our Beginning',
    description: 'Founded with a vision to bring authentic Ayurvedic wisdom to modern wellness seekers worldwide.',
  },
  {
    year: '2021',
    title: 'Expansion',
    description: 'Launched our complete product line with 50+ authentic Ayurvedic formulations.',
  },
  {
    year: '2022',
    title: 'Quality First',
    description: 'Achieved AYUSH certification and ISO 9001:2015 for our manufacturing processes.',
  },
  {
    year: '2023',
    title: 'Growing Community',
    description: 'Served over 100,000 customers and expanded our sustainable sourcing network.',
  },
  {
    year: '2024',
    title: 'Innovation',
    description: 'Launched AI-powered dosha analysis and personalized wellness recommendations.',
  },
  {
    year: '2025',
    title: 'Global Reach',
    description: 'Expanded to international markets while maintaining our commitment to authentic Ayurveda.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      <StructuredData data={aboutSchema} />
      <StructuredData data={organizationEnhancedSchema} />
      <StructuredData data={webPageSchema} />

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(34, 197, 94, 0.5) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Our Story</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                Ancient Wisdom,<br />Modern Wellness
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Born from a passion for authentic Ayurveda, Ayurveda Haven bridges the gap between ancient healing traditions and modern health needs. We believe everyone deserves access to pure, natural wellness solutions that have stood the test of 5,000 years.
              </p>
              
              <div className="flex flex-wrap gap-6 justify-center text-center">
                <div className="bg-white rounded-2xl shadow-lg p-6 min-w-[150px]">
                  <div className="text-3xl font-bold text-green-600 mb-1">100K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 min-w-[150px]">
                  <div className="text-3xl font-bold text-green-600 mb-1">500+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 min-w-[150px]">
                  <div className="text-3xl font-bold text-green-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600">Partner Farms</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="story" className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To empower individuals to achieve optimal health and wellness through authentic Ayurvedic products, education, and personalized guidance, while honoring the ancient traditions and supporting sustainable practices.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">
                    Our Vision
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To be the most trusted name in Ayurvedic wellness globally, making authentic, effective Ayurvedic solutions accessible to everyone while preserving and advancing traditional knowledge for future generations.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">
                    Our Promise
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Every product we offer is crafted with care, tested for quality, and backed by centuries of Ayurvedic wisdom. We never compromise on authenticity, purity, or your wellbeing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do, from sourcing to serving you
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A timeline of growth, innovation, and unwavering commitment
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200 hidden md:block"></div>

                {timeline.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative mb-12 md:mb-16 md:pl-20 ${
                      index % 2 === 0 ? 'md:pr-0' : 'md:pr-0'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-8 top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg hidden md:block transform -translate-x-2"></div>

                    <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                      <div className="text-green-600 font-bold text-sm mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Meet Our Experts
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Guided by experienced Ayurvedic practitioners and wellness experts
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: 'Dr. Priya Sharma',
                  role: 'Chief Ayurvedic Expert',
                  image: 'https://i.pravatar.cc/300?img=32',
                  description: '15+ years of experience in Ayurvedic medicine and holistic wellness.',
                },
                {
                  name: 'Dr. Rajesh Kumar',
                  role: 'Research & Development',
                  image: 'https://i.pravatar.cc/300?img=11',
                  description: 'PhD in Pharmacology, specializing in herbal formulations.',
                },
                {
                  name: 'Anjali Mehta',
                  role: 'Wellness Coach',
                  image: 'https://i.pravatar.cc/300?img=5',
                  description: 'Certified nutritionist and Ayurvedic lifestyle consultant.',
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-green-200"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-medium text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Quality Certifications
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Verified by trusted organizations for your peace of mind
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: 'AYUSH Certified',
                  description: 'Ministry of AYUSH approval for authentic Ayurvedic products',
                  icon: '🏛️',
                },
                {
                  name: 'ISO 9001:2015',
                  description: 'Quality management system certified',
                  icon: '✓',
                },
                {
                  name: 'GMP Certified',
                  description: 'Good Manufacturing Practices compliance',
                  icon: '⚙️',
                },
                {
                  name: '100% Vegan',
                  description: 'Certified plant-based, cruelty-free products',
                  icon: '🌱',
                },
              ].map((cert, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="text-5xl mb-4">{cert.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {cert.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Join Our Wellness Journey
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Explore our complete range of authentic Ayurvedic products and start your path to holistic wellness today.
            </p>
            <a
              href="/shop"
              className="inline-block bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-colors"
            >
              Shop Our Products
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
