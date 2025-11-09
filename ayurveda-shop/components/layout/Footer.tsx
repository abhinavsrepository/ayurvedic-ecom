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

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Herbal Teas", href: "/shop/teas" },
    { name: "Essential Oils", href: "/shop/oils" },
    { name: "Supplements", href: "/shop/supplements" },
    { name: "Skincare", href: "/shop/skincare" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/about#story" },
    { name: "Dosha Quiz", href: "/dosha-quiz" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "FAQs", href: "/faq" },
    { name: "Shipping Policy", href: "/shipping-policy" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 1000));

    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-gradient-to-b from-primary-dark to-[#0D4016] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 pt-16 pb-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div className="lg:col-span-2" variants={staggerItem}>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-white/10 p-2 rounded-full">
                <Leaf className="w-7 h-7 text-accent" />
              </div>
              <span className="text-2xl font-serif font-bold">Ayurveda Haven</span>
            </Link>

            <p className="text-white/80 mb-6 leading-relaxed">
              Discover the healing power of Ayurveda. Pure, herbal, wholesome products
              for natural balance and holistic wellness.
            </p>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                Join Our Wellness Community
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "px-6 py-2.5 rounded-full bg-accent text-white font-medium",
                    "hover:bg-accent/90 transition-colors disabled:opacity-50",
                    "flex items-center gap-2"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? "..." : <Send className="w-4 h-4" />}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div variants={staggerItem}>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-accent transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={staggerItem}>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-accent transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={staggerItem}>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-accent transition-colors inline-block"
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
          className="mt-12 pt-8 border-t border-white/10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-white/70">
              <a
                href="tel:+911234567890"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4" />
                +91 123 456 7890
              </a>
              <a
                href="mailto:hello@ayurvedahaven.com"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@ayurvedahaven.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Mumbai, India
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 bg-white/10 hover:bg-accent rounded-full transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-8 pt-8 border-t border-white/10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-6 text-xs text-white/60">
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
          className="mt-8 text-center text-sm text-white/50"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p>
            &copy; {new Date().getFullYear()} Ayurveda Haven. All rights reserved.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> | </span>
            Crafted with care for your wellness journey.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
