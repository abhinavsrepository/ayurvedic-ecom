"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { scrollReveal } from "@/lib/motion-variants";
import { extendedWisdomPosts } from "@/lib/data/products";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Find the post by slug
  const post = extendedWisdomPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = extendedWisdomPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary/30 to-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/blog">
              <motion.button
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Articles
              </motion.button>
            </Link>
          </motion.div>

          {/* Category Badge */}
          <motion.div
            className="mb-6"
            variants={scrollReveal}
            initial="hidden"
            animate="visible"
          >
            <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm">
              {post.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {post.title}
          </motion.h1>

          {/* Meta Information */}
          <motion.div
            className="flex flex-wrap items-center gap-6 text-text-secondary mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Updated Jan 2025</span>
            </div>
          </motion.div>

          {/* Share Buttons */}
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-text-secondary text-sm font-medium">Share:</span>
            <motion.button
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Share on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Share on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.article
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-text-primary leading-relaxed space-y-6">
              <p className="text-xl font-medium text-foreground">
                {post.excerpt}
              </p>

              <p>
                Ayurveda, the ancient Indian system of medicine, has been guiding humanity
                toward holistic wellness for over 5,000 years. This timeless wisdom offers
                profound insights into living in harmony with nature and understanding our
                unique constitution.
              </p>

              <h2 className="text-3xl font-serif font-bold text-foreground mt-12 mb-4">
                The Foundation of Knowledge
              </h2>

              <p>
                At the heart of Ayurveda lies the understanding that we are all unique
                individuals with distinct physical, mental, and emotional characteristics.
                This personalized approach to health and wellness sets Ayurveda apart from
                one-size-fits-all modern approaches.
              </p>

              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl my-8">
                <p className="italic text-foreground font-medium">
                  "When diet is wrong, medicine is of no use. When diet is correct, medicine
                  is of no need." - Ancient Ayurvedic Proverb
                </p>
              </div>

              <h2 className="text-3xl font-serif font-bold text-foreground mt-12 mb-4">
                Practical Applications
              </h2>

              <p>
                Incorporating Ayurvedic principles into your daily life doesn't require
                drastic changes. Start small with simple practices that align with your
                natural rhythms and individual needs:
              </p>

              <ul className="space-y-3 my-6">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-2xl leading-none">•</span>
                  <span>Wake up before sunrise to align with natural circadian rhythms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-2xl leading-none">•</span>
                  <span>Practice tongue scraping and oil pulling for oral health</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-2xl leading-none">•</span>
                  <span>Eat your largest meal at midday when digestive fire is strongest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-2xl leading-none">•</span>
                  <span>Choose foods that balance your dominant dosha</span>
                </li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-foreground mt-12 mb-4">
                Modern Science Meets Ancient Wisdom
              </h2>

              <p>
                Recent scientific research has begun to validate many Ayurvedic practices
                that have been used for millennia. Studies on herbs like turmeric,
                ashwagandha, and holy basil have demonstrated their powerful therapeutic
                properties, bridging the gap between traditional knowledge and modern
                medicine.
              </p>

              <p>
                The holistic approach of Ayurveda considers not just physical symptoms but
                also mental, emotional, and spiritual well-being. This comprehensive
                perspective is increasingly relevant in our modern world, where stress,
                poor diet, and disconnection from nature contribute to chronic health
                issues.
              </p>

              <h2 className="text-3xl font-serif font-bold text-foreground mt-12 mb-4">
                Taking the Next Step
              </h2>

              <p>
                Whether you're new to Ayurveda or deepening your practice, remember that
                this is a journey of self-discovery. Pay attention to how different foods,
                routines, and practices make you feel. Your body's wisdom, combined with
                Ayurvedic principles, will guide you toward optimal health and balance.
              </p>

              <p className="text-lg font-medium text-primary bg-primary/5 p-6 rounded-xl mt-8">
                Ready to explore more? Browse our collection of authentic Ayurvedic
                products and continue your wellness journey with us.
              </p>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 text-center">
              Related Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <motion.article
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full"
                      whileHover={{ y: -8 }}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                          style={{ backgroundImage: `url(${relatedPost.image})` }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-primary text-xs font-semibold">
                            {relatedPost.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-serif font-bold text-xl text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-text-secondary text-sm line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Experience Authentic Ayurveda
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Discover our curated collection of premium Ayurvedic products, carefully
              selected to support your wellness journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <motion.button
                  className="px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-accent hover:text-white transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Products
                </motion.button>
              </Link>
              <Link href="/dosha-quiz">
                <motion.button
                  className="px-8 py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white hover:bg-white hover:text-primary transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Take Dosha Quiz
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
