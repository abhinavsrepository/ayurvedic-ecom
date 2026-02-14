"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import { fadeInLeft, fadeInRight, floatingHerb } from "@/lib/motion-variants";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-gradient-to-br from-secondary via-white to-primary-light/20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circles */}
        <motion.div
          className="absolute top-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl"
          variants={floatingHerb}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl"
          variants={floatingHerb}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        />

        {/* Botanical Patterns (SVG placeholders - replace with actual botanical SVGs) */}
        <motion.div
          className="absolute top-1/4 -right-10 sm:-right-20 w-40 h-40 sm:w-64 sm:h-64 opacity-10"
          animate={{
            rotate: [0, 5, -5, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full text-primary">
            <path
              fill="currentColor"
              d="M100,20 Q120,50 100,80 Q80,50 100,20 M100,80 L100,180 M80,100 Q100,110 120,100 M70,130 Q100,140 130,130"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 -left-10 sm:-left-20 w-36 h-36 sm:w-56 sm:h-56 opacity-10"
          animate={{
            rotate: [0, -5, 5, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full text-accent">
            <circle cx="100" cy="100" r="40" fill="currentColor" opacity="0.3" />
            <path
              fill="currentColor"
              d="M100,60 Q110,80 100,100 Q90,80 100,60 M100,100 Q110,120 100,140 Q90,120 100,100"
            />
          </svg>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-6 sm:space-y-8 text-center lg:text-left"
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                100% Organic & Natural
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-3 sm:space-y-4">
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Premium{" "}
                <span className="text-primary relative inline-block">
                  Ayurvedic Hair Oil
                  <svg
                    className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    fill="none"
                  >
                    <motion.path
                      d="M2 10 Q150 2, 298 10"
                      stroke="#C9A66B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1, duration: 1 }}
                    />
                  </svg>
                </span>
                <br className="hidden sm:block" />
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">for Healthy Hair</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Traditional formula with bhringraj, amla, and hibiscus for thick, lustrous hair growth. Promotes healthy scalp and prevents premature graying.
              </motion.p>

              {/* Special Offer Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-accent/10 border-2 border-accent rounded-full flex-wrap justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="text-xl sm:text-2xl font-bold text-accent">₹649</span>
                <span className="text-base sm:text-lg text-text-secondary line-through">₹799</span>
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-accent text-white text-xs sm:text-sm font-semibold rounded-full">
                  SAVE 19%
                </span>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link href="/shop">
                <motion.button
                  className="group w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 tap-target"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Buy Hair Oil Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link href="/shop">
                <motion.button
                  className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-white text-primary font-semibold rounded-full border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg tap-target"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View All Products
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap gap-4 sm:gap-6 pt-6 sm:pt-8 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[
                { icon: "🌿", text: "100% Natural" },
                { icon: "⭐", text: "4.9 Rating (345 Reviews)" },
                { icon: "🚚", text: "Free Delivery" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-xs sm:text-sm">
                    {item.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            className="relative hidden lg:block"
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              {/* Main Image Container */}
              <motion.div
                className="relative w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-light/20 to-accent/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                {/* Hair Oil Product Image */}
                <Image
                  src="/images/hair oil.png"
                  alt="Ayurvedic Hair Oil - Premium herbal formula"
                  fill
                  className="object-contain p-4 sm:p-8"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Bestseller Badge */}
                <motion.div
                  className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1 sm:px-4 sm:py-2 bg-accent text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  ⭐ Bestseller
                </motion.div>

                {/* New Product Badge */}
                <motion.div
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1 sm:px-4 sm:py-2 bg-primary text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  🎉 NEW
                </motion.div>
              </motion.div>

              {/* Floating Stats Cards */}
              <motion.div
                className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-primary">5000+</div>
                <div className="text-xs sm:text-sm text-text-muted">Happy Customers</div>
              </motion.div>

              <motion.div
                className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-accent text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-2xl sm:text-3xl font-bold">4.9★</div>
                <div className="text-xs sm:text-sm">Average Rating</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 hidden sm:flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-text-muted"
        >
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
