"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion-variants";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!", {
          description: "We'll get back to you as soon as possible.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message", {
          description: data.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Visit Us",
      details: ["Gomti Nagar", "Lucknow 226021", "Uttar Pradesh, India"],
    },
    {
      icon: <Phone className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Call Us",
      details: [ "+91  84000 28000", "Mon-Sat: 10:30AM - 6PM"],
    },
    {
      icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Email Us",
      details: [ "support@kosmicowellness.com"],
    },
    {
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Business Hours",
      details: ["Monday - Saturday: 9AM - 6PM", "Sunday: 10AM - 4PM"],
    },
  ];

  const subjects = [
    "General Inquiry",
    "Product Question",
    "Order Support",
    "Consultation Request",
    "Partnership Opportunity",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <Navbar />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Get in Touch
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 px-2 sm:px-0">
                Have questions about our Ayurvedic products or need personalized guidance?
                We&apos;re here to help you on your wellness journey.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 sm:py-16 -mt-8 sm:-mt-12 relative z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="bg-white rounded-xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 text-primary rounded-full mb-3 sm:mb-4 mx-auto sm:mx-0">
                    {info.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 text-center sm:text-left">
                    {info.title}
                  </h3>
                  <div className="space-y-1 text-center sm:text-left">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-xs sm:text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Form */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base tap-target"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base tap-target"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base tap-target"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base tap-target bg-white"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full px-6 sm:px-8 py-3.5 sm:py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-sm sm:text-base tap-target"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6 sm:space-y-8"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
                    Why Choose Us?
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        num: "1",
                        title: "100% Natural Products",
                        desc: "All our products are made from pure, authentic Ayurvedic herbs without any chemicals.",
                      },
                      {
                        num: "2",
                        title: "Expert Consultation",
                        desc: "Get personalized advice from certified Ayurvedic practitioners for your wellness needs.",
                      },
                      {
                        num: "3",
                        title: "Fast & Secure Delivery",
                        desc: "Safe packaging and timely delivery to ensure your products reach you in perfect condition.",
                      },
                      {
                        num: "4",
                        title: "Customer Support",
                        desc: "Our dedicated support team is always ready to assist you with any questions or concerns.",
                      },
                    ].map((item) => (
                      <div key={item.num} className="flex gap-3 sm:gap-4">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                          {item.num}
                        </div>
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg mb-0.5 sm:mb-1">{item.title}</h3>
                          <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl sm:rounded-2xl p-5 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                    Need Immediate Assistance?
                  </h3>
                  <p className="mb-4 sm:mb-6 text-white/90 text-sm sm:text-base">
                    For urgent queries or order-related issues, call us directly or send us a WhatsApp message.
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    <motion.a
                      href="tel:+919876543210"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 bg-white/20 hover:bg-white/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 transition-colors tap-target"
                    >
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-medium text-sm sm:text-base">+91 98765 43210</span>
                    </motion.a>
                    <motion.a
                      href="mailto:hello@kosmicowellness.com"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 bg-white/20 hover:bg-white/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 transition-colors tap-target"
                    >
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-medium text-sm sm:text-base">hello@kosmicowellness.com</span>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-800">
                Visit Our Store
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto px-4 text-sm sm:text-base">
                Come visit us in person to explore our complete range of Ayurvedic products
                and speak with our wellness experts.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709653!3d19.08219783954576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location Map"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-800">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 px-4 text-sm sm:text-base">
                Quick answers to common questions about our products and services
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3 sm:space-y-4"
            >
              {[
                {
                  q: "How long does delivery take?",
                  a: "We typically deliver within 3-5 business days for domestic orders. International shipping may take 7-14 days depending on the destination.",
                },
                {
                  q: "Are your products certified?",
                  a: "Yes, all our products are certified by relevant Ayurvedic authorities and undergo rigorous quality testing.",
                },
                {
                  q: "Can I get a refund if I'm not satisfied?",
                  a: "We offer a 30-day money-back guarantee on all products. Contact our support team to initiate a return.",
                },
                {
                  q: "Do you offer consultations?",
                  a: "Yes, we provide free consultations with certified Ayurvedic practitioners. Book your appointment through our website or call us directly.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-800">{faq.q}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{faq.a}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
