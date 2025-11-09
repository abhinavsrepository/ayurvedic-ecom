"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { fadeInUp, fadeInLeft, fadeInRight, floatingHerb } from "@/lib/motion-variants";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-secondary via-white to-primary-light/20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circles */}
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          variants={floatingHerb}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          variants={floatingHerb}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        />

        {/* Botanical Patterns (SVG placeholders - replace with actual botanical SVGs) */}
        <motion.div
          className="absolute top-1/4 -right-20 w-64 h-64 opacity-10"
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
          className="absolute bottom-1/4 -left-20 w-56 h-56 opacity-10"
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

      <div className="container mx-auto px-4 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">
                100% Organic & Natural
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Discover the{" "}
                <span className="text-primary relative">
                  Healing Power
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
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
                <br />
                of Ayurveda
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Pure. Herbal. Wholesome. Bring natural balance to your life with
                our premium Ayurvedic products crafted from ancient wisdom.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link href="/shop">
                <motion.button
                  className="group px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link href="/dosha-quiz">
                <motion.button
                  className="px-8 py-4 bg-white text-primary font-semibold rounded-full border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Find Your Dosha
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap gap-6 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[
                { icon: "✓", text: "Certified Organic" },
                { icon: "✓", text: "Cruelty-Free" },
                { icon: "✓", text: "Sustainable" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-sm">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-text-secondary">
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
                className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                {/* Placeholder for hero image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-accent/30 flex items-center justify-center">
                  <svg
                    viewBox="0 0 400 400"
                    className="w-3/4 h-3/4 text-white/30"
                  >
                    <circle cx="200" cy="150" r="60" fill="currentColor" />
                    <path
                      d="M200,210 L200,350 M150,250 Q200,260 250,250 M140,290 Q200,300 260,290"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Overlay Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/60 font-serif text-2xl">
                    [Hero Product Image]
                  </p>
                </div>
              </motion.div>

              {/* Floating Stats Cards */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-bold text-primary">5000+</div>
                <div className="text-sm text-text-muted">Happy Customers</div>
              </motion.div>

              <motion.div
                className="absolute -top-6 -right-6 bg-accent text-white p-6 rounded-2xl shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-bold">4.9★</div>
                <div className="text-sm">Average Rating</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
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
