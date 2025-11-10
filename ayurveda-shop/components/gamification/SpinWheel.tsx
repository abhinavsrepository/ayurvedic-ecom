"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles } from "lucide-react";

interface Prize {
  id: string;
  label: string;
  discount: string;
  color: string;
  probability: number; // 0-1
}

const prizes: Prize[] = [
  { id: "1", label: "5% OFF", discount: "5", color: "#FFC107", probability: 0.3 },
  { id: "2", label: "10% OFF", discount: "10", color: "#FF9800", probability: 0.25 },
  { id: "3", label: "15% OFF", discount: "15", color: "#FF5722", probability: 0.2 },
  { id: "4", label: "20% OFF", discount: "20", color: "#F44336", probability: 0.15 },
  { id: "5", label: "FREE SHIPPING", discount: "FREESHIP", color: "#4CAF50", probability: 0.08 },
  { id: "6", label: "25% OFF", discount: "25", color: "#9C27B0", probability: 0.02 },
];

export default function SpinWheel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [rotation, setRotation] = useState(0);
  const [mounted, setMounted] = useState(false);

  const selectPrize = (): Prize => {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const prize of prizes) {
      cumulativeProbability += prize.probability;
      if (random <= cumulativeProbability) {
        return prize;
      }
    }

    return prizes[0]; // Fallback
  };

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    const prize = selectPrize();
    const prizeIndex = prizes.findIndex((p) => p.id === prize.id);
    const segmentAngle = 360 / prizes.length;
    const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);
    const spins = 5; // Number of full rotations
    const finalRotation = rotation + spins * 360 + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(prize);
      setHasSpun(true);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("spinWheelUsed", "true");
        localStorage.setItem(
          "wonDiscount",
          JSON.stringify({ code: `SPIN${prize.discount}`, discount: prize.label })
        );
      }
    }, 4000);
  };

  const copyCode = () => {
    if (wonPrize) {
      navigator.clipboard.writeText(`SPIN${wonPrize.discount}`);
      alert("Coupon code copied!");
    }
  };

  // Check if user already spun
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const used = localStorage.getItem("spinWheelUsed");
      console.log("SpinWheel - localStorage check:", used);
      console.log("SpinWheel - hasSpun state:", hasSpun);
      if (used === "true") {
        setHasSpun(true);
      }
    }
  }, []);

  console.log("SpinWheel render - isOpen:", isOpen, "hasSpun:", hasSpun, "mounted:", mounted);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && !hasSpun && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-40 w-16 h-16 bg-gradient-to-br from-accent to-yellow-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-accent/50 transition-all"
            aria-label="Spin to Win"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Gift className="w-7 h-7" />
            </motion.div>

            {/* Pulse indicator */}
            <motion.div
              className="absolute inset-0 bg-accent rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Spin Wheel Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => !isSpinning && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isSpinning}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="inline-block mb-2"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-12 h-12 text-accent mx-auto" />
                </motion.div>
                <h2 className="text-3xl font-serif font-bold text-foreground">
                  Spin to Win!
                </h2>
                <p className="text-text-secondary mt-2">
                  Get a discount on your Ayurveda products
                </p>
              </div>

              {/* Wheel Container */}
              <div className="relative w-72 h-72 mx-auto mb-6">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                  <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-red-600 drop-shadow-lg" />
                </div>

                {/* Wheel */}
                <motion.div
                  className="relative w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden"
                  style={{
                    rotate: rotation,
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeOut",
                  }}
                >
                  {/* Wheel Segments */}
                  {prizes.map((prize, index) => {
                    const segmentAngle = 360 / prizes.length;
                    const rotation = index * segmentAngle;

                    return (
                      <div
                        key={prize.id}
                        className="absolute w-full h-full"
                        style={{
                          transform: `rotate(${rotation}deg)`,
                        }}
                      >
                        <div
                          className="absolute top-0 left-1/2 origin-bottom w-36 h-36 -translate-x-1/2 flex items-start justify-center pt-4"
                          style={{
                            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                            backgroundColor: prize.color,
                          }}
                        >
                          <span
                            className="text-white font-bold text-sm transform rotate-0"
                            style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                          >
                            {prize.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-accent shadow-lg flex items-center justify-center">
                    <span className="text-accent font-bold text-xs">SPIN</span>
                  </div>
                </motion.div>
              </div>

              {/* Spin Button or Result */}
              {!wonPrize ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="w-full px-8 py-4 bg-gradient-to-r from-accent to-yellow-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isSpinning ? "SPINNING..." : "SPIN NOW!"}
                </motion.button>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 mb-4">
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      🎉 Congratulations!
                    </h3>
                    <p className="text-lg font-semibold text-foreground mb-3">
                      You won: {wonPrize.label}
                    </p>
                    <div className="bg-white rounded-lg p-3 border-2 border-dashed border-accent">
                      <p className="text-sm text-text-secondary mb-1">Your Coupon Code:</p>
                      <p className="text-2xl font-bold text-accent font-mono">
                        SPIN{wonPrize.discount}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyCode}
                    className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-primary-dark transition-all"
                  >
                    Copy Code & Shop Now
                  </motion.button>
                </motion.div>
              )}

              <p className="text-xs text-text-secondary text-center mt-4">
                * One spin per customer. Valid for 7 days.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
