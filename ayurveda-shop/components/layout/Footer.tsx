"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Leaf,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion-variants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Herbal Teas", href: "/shop?category=Herbal+Teas" },
    { name: "Essential Oils", href: "/shop?category=Essential+Oils" },
    { name: "Supplements", href: "/shop?category=Supplements" },
    { name: "Skincare", href: "/shop?category=Skincare" },
  ],
  company: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/about#story" },
    { name: "Dosha Quiz", href: "/dosha-quiz" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "FAQs", href: "/faq" },
    { name: "Shipping Policy", href: "/shipping" },
    { name: "Refund Policy", href: "/refund" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/kosmicowellness", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/kosmicowellness", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/kosmicowellness", label: "Twitter" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement newsletter subscription API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-primary-dark to-[#0D4016] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div className="lg:col-span-2 sm:col-span-2" variants={staggerItem}>
            <Link href="/" className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full border-2 border-white/20 flex-shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Kosmico Wellness Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl sm:text-2xl font-serif font-bold">Kosmico Wellness</span>
            </Link>

            <p className="text-white/80 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Discover the healing power of Ayurveda. Pure, herbal, wholesome products
              for natural balance and holistic wellness.
            </p>

            {/* Newsletter */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                Join Our Wellness Community
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent text-sm tap-target"
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "px-5 py-2.5 rounded-full bg-accent text-white font-medium",
                    "hover:bg-accent/90 transition-colors disabled:opacity-50",
                    "flex items-center justify-center gap-2 tap-target whitespace-nowrap"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Subscribe to newsletter"
                >
                  {isSubmitting ? "..." : <Send className="w-4 h-4" />}
                  <span className="sm:hidden">Subscribe</span>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div variants={staggerItem}>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Shop</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-accent transition-colors inline-block text-sm sm:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={staggerItem}>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-accent transition-colors inline-block text-sm sm:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={staggerItem}>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-accent transition-colors inline-block text-sm sm:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Contact Info & Social */}
        <motion.div
          className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 text-xs sm:text-sm text-white/70 text-center sm:text-left">
              <a
                href="tel:+911234567890"
                className="flex items-center justify-center sm:justify-start gap-2 hover:text-accent transition-colors tap-target"
              >
                <Phone className="w-4 h-4" />
                +91 123 456 7890
              </a>
              <a
                href="mailto:hello@kosmicowellness.com"
                className="flex items-center justify-center sm:justify-start gap-2 hover:text-accent transition-colors tap-target"
              >
                <Mail className="w-4 h-4" />
                hello@kosmicowellness.com
              </a>
              <span className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="w-4 h-4" />
                Mumbai, India
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 sm:p-2.5 bg-white/10 hover:bg-accent rounded-full transition-colors tap-target"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>100% Organic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Cruelty-Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Sustainably Sourced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Third-Party Tested</span>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-white/50"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="px-4">
            &copy; {new Date().getFullYear()} Kosmico Wellness. All rights reserved.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> | </span>
            Crafted with care for your wellness journey.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
