"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

interface Reward {
  type: "discount" | "freebie" | "points";
  value: string;
  code: string;
  message: string;
}

const rewards: Reward[] = [
  { type: "discount", value: "10% OFF", code: "SCRATCH10", message: "Save 10% on your order!" },
  { type: "discount", value: "15% OFF", code: "SCRATCH15", message: "Enjoy 15% discount!" },
  { type: "discount", value: "20% OFF", code: "SCRATCH20", message: "Amazing 20% off!" },
  { type: "freebie", value: "FREE Sample", code: "FREESAMPLE", message: "Get a free product sample!" },
  { type: "points", value: "100 Points", code: "POINTS100", message: "Earn 100 loyalty points!" },
];

export default function ScratchCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [hasScratched, setHasScratched] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Check if user already scratched
    if (typeof window !== "undefined") {
      const used = localStorage.getItem("scratchCardUsed");
      if (used === "true") {
        setHasScratched(true);
      }
    }

    // Select random reward when opened
    if (isOpen && !reward) {
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
      setReward(randomReward);
    }

    // Initialize canvas
    if (canvasRef.current && isOpen) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Set canvas size
        canvas.width = 300;
        canvas.height = 200;

        // Draw scratch-off layer
        ctx.fillStyle = "#C9A66B"; // Gold color
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add pattern
        ctx.strokeStyle = "#A0885E";
        ctx.lineWidth = 2;
        for (let i = 0; i < canvas.width; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }

        // Add text
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Scratch Here!", canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = "16px Arial";
        ctx.fillText("🌿 Reveal Your Prize 🌿", canvas.width / 2, canvas.height / 2 + 20);
      }
    }
  }, [isOpen]);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || isRevealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // Scale for canvas resolution
    x = (x / rect.width) * canvas.width;
    y = (y / rect.height) * canvas.height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);
    setIsScratching(true);

    // Reveal when 60% scratched
    if (percentage > 60 && !isRevealed) {
      setIsRevealed(true);
      setHasScratched(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("scratchCardUsed", "true");
        if (reward) {
          localStorage.setItem(
            "scratchReward",
            JSON.stringify({ code: reward.code, value: reward.value })
          );
        }
      }
    }
  };

  const handleMouseDown = () => setIsDrawing(true);
  const handleMouseUp = () => setIsDrawing(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) scratch(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    scratch(e);
  };

  const copyCode = () => {
    if (reward) {
      navigator.clipboard.writeText(reward.code);
      alert("Coupon code copied!");
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && !hasScratched && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-44 right-6 z-40 w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-yellow-500/50 transition-all"
            aria-label="Scratch Card"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-7 h-7" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scratch Card Modal */}
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
              initial={{ scale: 0.8, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 90 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
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
                <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <h2 className="text-3xl font-serif font-bold text-foreground">
                  Scratch & Win!
                </h2>
                <p className="text-text-secondary mt-2">
                  Scratch the card to reveal your prize
                </p>
              </div>

              {/* Scratch Card */}
              <div className="relative mb-6">
                {/* Revealed Prize (Behind Canvas) */}
                {reward && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border-4 border-dashed border-accent">
                    <div className="text-center p-6">
                      <div className="text-6xl mb-3">
                        {reward.type === "discount" && "🎉"}
                        {reward.type === "freebie" && "🎁"}
                        {reward.type === "points" && "⭐"}
                      </div>
                      <h3 className="text-3xl font-bold text-primary mb-2">
                        {reward.value}
                      </h3>
                      <p className="text-sm text-text-secondary">{reward.message}</p>
                    </div>
                  </div>
                )}

                {/* Scratch Canvas */}
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onTouchStart={() => setIsDrawing(true)}
                  onTouchEnd={() => setIsDrawing(false)}
                  onTouchMove={handleTouchMove}
                  className="w-full h-50 cursor-pointer touch-none rounded-2xl"
                  style={{
                    opacity: isRevealed ? 0 : 1,
                    transition: "opacity 0.5s",
                  }}
                />

                {/* Progress Indicator */}
                {isScratching && !isRevealed && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-1 rounded-full text-xs font-semibold text-primary">
                    {Math.round(scratchPercentage)}% Revealed
                  </div>
                )}
              </div>

              {/* Result Actions */}
              {isRevealed && reward && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="bg-white rounded-lg p-3 border-2 border-dashed border-accent">
                    <p className="text-sm text-text-secondary mb-1 text-center">
                      Your Coupon Code:
                    </p>
                    <p className="text-2xl font-bold text-accent font-mono text-center">
                      {reward.code}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyCode}
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Copy Code & Start Shopping
                  </motion.button>
                </motion.div>
              )}

              {!isRevealed && (
                <p className="text-center text-sm text-text-secondary">
                  👆 Use your mouse or finger to scratch
                </p>
              )}

              <p className="text-xs text-text-secondary text-center mt-4">
                * One scratch card per customer. Valid for 7 days.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
