"use client";

/**
 * Quick Action FAB Menu
 * 
 * A floating action button that expands into multiple quick actions
 * like AI Consult, Community, Rewards, and Health Tracking.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/contexts/UIContext";
import {
    Plus,
    Users,
    Sparkles,
    Gift,
    Stethoscope,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
const actions = [
    {
        id: "consult",
        icon: Stethoscope,
        label: "Ask a Doctor",
        color: "bg-[#2D6A4F]", // Dark green
        href: "/consult",
    },
    {
        id: "rewards",
        icon: Gift,
        label: "My Rewards",
        color: "bg-[#C9A66B]", // Tan/Gold
        href: "/rewards",
    },
    {
        id: "ai",
        icon: Sparkles,
        label: "AI Dosha Analysis",
        color: "bg-[#FF9F1C]", // Orange
        href: "/dosha-quiz",
    },
    {
        id: "community",
        icon: Users,
        label: "Community",
        color: "bg-[#20BF55]", // Bright green
        href: "/community",
    },
];

export default function FloatingMenu() {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const {
        setIsDoctorChatOpen,
        setIsSpinWheelOpen,
        setIsReferralOpen
    } = useUI();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    const handleAction = (action: typeof actions[0]) => {
        setIsOpen(false); // Close menu first

        switch (action.id) {
            case "consult":
                setIsDoctorChatOpen(true);
                break;
            case "rewards":
                setIsSpinWheelOpen(true);
                break;
            case "ai":
                router.push("/dosha-quiz");
                break;
            case "community":
                setIsReferralOpen(true);
                break;
            default:
                if (action.href) router.push(action.href);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-center gap-4">
            {/* Action Buttons */}
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col items-center gap-3">
                        {actions.map((action, index) => (
                            <motion.button
                                key={action.id}
                                initial={{ opacity: 0, scale: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                    transition: { delay: index * 0.05 }
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0,
                                    y: 20,
                                    transition: { delay: (actions.length - 1 - index) * 0.05 }
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAction(action)}
                                className={cn(
                                    "relative group p-4 rounded-full text-white shadow-lg transition-transform",
                                    action.color
                                )}
                                aria-label={action.label}
                            >
                                <action.icon className="w-6 h-6" />

                                {/* Tooltip */}
                                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                                    {action.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "p-5 rounded-full shadow-2xl transition-colors z-50",
                    isOpen ? "bg-red-500 text-white" : "bg-primary text-white"
                )}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    {isOpen ? <X className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                </motion.div>
            </motion.button>
        </div>
    );
}
