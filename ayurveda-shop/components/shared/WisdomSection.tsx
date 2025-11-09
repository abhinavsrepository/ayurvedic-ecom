"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { scrollReveal, staggerContainer, staggerItem } from "@/lib/motion-variants";
import { useInView } from "react-intersection-observer";

interface WisdomPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  slug: string;
}

interface WisdomSectionProps {
  posts: WisdomPost[];
}

export default function WisdomSection({ posts }: WisdomSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gradient-to-b from-white to-secondary">
      <div className="container mx-auto px-4 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          variants={scrollReveal}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
              Ancient Wisdom, Modern Wellness
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Ayurvedic Wisdom
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Explore time-tested knowledge and holistic practices for a balanced life
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {posts.map((post, index) => (
            <motion.div key={post.id} variants={staggerItem}>
              <Link href={`/blog/${post.slug}`}>
                <motion.article
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
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
                  <div className="p-6">
                    <h3 className="font-serif font-bold text-xl text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-text-secondary text-sm line-clamp-3 mb-4 leading-relaxed">
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

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/blog">
            <motion.button
              className="px-8 py-4 bg-white text-primary font-semibold rounded-full border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore All Articles
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
