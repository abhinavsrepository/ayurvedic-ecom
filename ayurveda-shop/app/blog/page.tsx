"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Search, Filter } from "lucide-react";
import { scrollReveal, staggerContainer, staggerItem } from "@/lib/motion-variants";
import { useInView } from "react-intersection-observer";
import { useState, useMemo } from "react";
import { wisdomPosts, extendedWisdomPosts } from "@/lib/data/products";

const categories = ["All", "Ayurvedic Basics", "Lifestyle", "Herbs & Spices", "Nutrition", "Wellness", "Dosha Guide"];

export default function BlogPage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Combine all blog posts
  const allPosts = useMemo(() => {
    return extendedWisdomPosts || wisdomPosts;
  }, []);

  // Filter posts based on category and search
  const filteredPosts = useMemo(() => {
    let filtered = allPosts;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allPosts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-white to-secondary">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
            animate={{
              y: [0, -40, 0],
              x: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={scrollReveal}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <div className="px-6 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm">
                Ancient Wisdom, Modern Wellness
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Ayurvedic Wisdom
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Explore time-tested knowledge, holistic practices, and ancient remedies
              for a balanced, healthy life rooted in Ayurvedic tradition.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-primary/20 focus:border-primary focus:outline-none bg-white shadow-lg transition-all"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white/50 backdrop-blur-sm sticky top-20 z-40 border-y border-primary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-5 h-5 text-text-secondary flex-shrink-0" />
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-text-secondary hover:bg-primary/10 hover:text-primary border border-primary/20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8" ref={ref}>
          {filteredPosts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {filteredPosts.map((post) => (
                <motion.div key={post.id} variants={staggerItem}>
                  <Link href={`/blog/${post.slug}`}>
                    <motion.article
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                          style={{ backgroundImage: `url(${post.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-primary text-xs font-semibold">
                            {post.category}
                          </span>
                        </div>

                        {/* Read Time */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-serif font-bold text-xl text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-text-secondary text-sm line-clamp-3 mb-4 leading-relaxed flex-grow">
                          {post.excerpt}
                        </p>

                        {/* Read More Link */}
                        <motion.div
                          className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all"
                          whileHover={{ x: 5 }}
                        >
                          Read Article
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
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
              Get Wellness Tips in Your Inbox
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Subscribe to our newsletter for weekly Ayurvedic wisdom, seasonal guides,
              and exclusive wellness content.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-white"
              />
              <motion.button
                className="px-8 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent-dark transition-all shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>

            <p className="text-sm text-white/70 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
