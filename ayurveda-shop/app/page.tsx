import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/shared/Hero";
import ProductGrid from "@/components/shared/ProductGrid";
import Testimonials from "@/components/shared/Testimonials";
import WisdomSection from "@/components/shared/WisdomSection";
import BeforeAfter from "@/components/shared/BeforeAfter";
import VideoTestimonials from "@/components/shared/VideoTestimonials";
import BannerDisplay from "@/components/frontend/BannerDisplay";
import { featuredProducts, testimonials, wisdomPosts, beforeAfterData, videoTestimonials } from "@/lib/data/products";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <Hero />

        {/* Featured Products */}
        <ProductGrid
          products={featuredProducts.slice(0, 8)}
          title="Featured Products"
          subtitle="Discover our bestselling Ayurvedic treasures crafted with care"
        />

        {/* Before/After Transformation - Acne Improvement */}
        <BeforeAfter
          beforeImage="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80"
          afterImage="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=80"
          beforeLabel="Before Treatment"
          afterLabel="After 30 Days"
          title="Real Results: Acne & Skin Improvement"
          subtitle="See how our natural Ayurvedic products help achieve clear, radiant skin. Results from consistent use of Neem Face Pack and Turmeric treatments."
        />

        {/* Video Testimonials */}
        <VideoTestimonials
          videos={videoTestimonials}
          title="What People Say About Our Products!"
          subtitle="Real customers sharing their authentic Ayurvedic journey"
        />

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                Why Choose Ayurveda Haven?
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Your trusted partner in holistic wellness
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🌿",
                  title: "100% Natural",
                  description: "Pure herbal ingredients sourced from trusted farms"
                },
                {
                  icon: "✓",
                  title: "Certified Organic",
                  description: "Third-party tested and certified for purity"
                },
                {
                  icon: "🧘",
                  title: "Traditional Recipes",
                  description: "Time-tested Ayurvedic formulations"
                },
                {
                  icon: "🌍",
                  title: "Sustainable",
                  description: "Eco-friendly packaging and ethical sourcing"
                }
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="text-center p-8 bg-secondary rounded-2xl hover:shadow-lg transition-shadow"
                  role="article"
                  aria-labelledby={`benefit-${index}`}
                >
                  <div className="text-5xl mb-4" role="img" aria-label={benefit.title}>{benefit.icon}</div>
                  <h3 id={`benefit-${index}`} className="text-xl font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-text-secondary">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Middle Banner */}
        <section className="my-12 px-4">
          <BannerDisplay position="middle" autoPlay={true} interval={6000} />
        </section>

        {/* Ayurvedic Wisdom Blog */}
        <WisdomSection posts={wisdomPosts} />

        {/* Testimonials */}
        <Testimonials testimonials={testimonials} />

        {/* Footer Banner */}
        <section className="my-12 px-4">
          <BannerDisplay position="footer" autoPlay={false} />
        </section>

        {/* Popup Banner */}
        <BannerDisplay position="popup" />
      </main>

      <Footer />
    </div>
  );
}
