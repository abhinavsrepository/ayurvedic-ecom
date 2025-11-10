"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Copy, Gift, Share2, Facebook, Twitter, Mail, CheckCircle2 } from "lucide-react";

interface ReferralStats {
  code: string;
  referrals: number;
  earnings: number;
  pendingRewards: number;
}

export default function ReferralSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState<ReferralStats>({
    code: "",
    referrals: 0,
    earnings: 0,
    pendingRewards: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Generate or load referral code
      let code = localStorage.getItem("referralCode");
      if (!code) {
        code = `AYUR${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        localStorage.setItem("referralCode", code);
      }
      setReferralCode(code);

      // Load stats from localStorage
      const savedStats = localStorage.getItem("referralStats");
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        setStats({
          code,
          referrals: 0,
          earnings: 0,
          pendingRewards: 0,
        });
      }
    }
  }, []);

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}?ref=${referralCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  const shareVia = (platform: string) => {
    const message = `Get 20% OFF on premium Ayurvedic products! Use my referral code: ${referralCode} or click: ${referralLink}`;

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      email: `mailto:?subject=Get 20% OFF on Ayurvedic Products&body=${encodeURIComponent(message)}`,
    };

    window.open(urls[platform as keyof typeof urls], "_blank");
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-64 right-6 z-40 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-green-500/50 transition-all"
        aria-label="Referral Program"
      >
        <Users className="w-7 h-7" />
        {stats.referrals > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
          >
            {stats.referrals}
          </motion.div>
        )}
      </motion.button>

      {/* Referral Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-foreground">
                  Refer & Earn
                </h2>
                <p className="text-text-secondary mt-2">
                  Give ₹200, Get ₹200 on every referral!
                </p>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-br from-primary/5 to-emerald-500/5 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-4 text-foreground">How it Works:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <p className="text-sm text-text-secondary">
                      Share your unique referral code or link with friends
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <p className="text-sm text-text-secondary">
                      Your friend gets ₹200 OFF on their first order (min ₹1000)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <p className="text-sm text-text-secondary">
                      You earn ₹200 credit when they complete their purchase!
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Dashboard */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white rounded-xl p-4 border-2 border-primary/20 text-center">
                  <div className="text-2xl font-bold text-primary">{stats.referrals}</div>
                  <div className="text-xs text-text-secondary mt-1">Referrals</div>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-emerald-500/20 text-center">
                  <div className="text-2xl font-bold text-emerald-600">₹{stats.earnings}</div>
                  <div className="text-xs text-text-secondary mt-1">Earned</div>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-accent/20 text-center">
                  <div className="text-2xl font-bold text-accent">₹{stats.pendingRewards}</div>
                  <div className="text-xs text-text-secondary mt-1">Pending</div>
                </div>
              </div>

              {/* Referral Code */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Your Referral Code:
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 border-2 border-dashed border-primary/30 font-mono text-lg font-bold text-primary text-center">
                    {referralCode}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyCode}
                    className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>

              {/* Referral Link */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Share Your Link:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-text-secondary"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyLink}
                    className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Share Via:</p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareVia("facebook")}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    <span className="font-semibold">Facebook</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareVia("twitter")}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="font-semibold">Twitter</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareVia("whatsapp")}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="font-semibold">WhatsApp</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareVia("email")}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-semibold">Email</span>
                  </motion.button>
                </div>
              </div>

              <p className="text-xs text-text-secondary text-center mt-6">
                * Credits can be used on future purchases. Min order ₹500.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
