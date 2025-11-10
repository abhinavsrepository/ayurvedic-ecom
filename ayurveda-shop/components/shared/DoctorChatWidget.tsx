"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  AlertCircle,
  Stethoscope,
  Minimize2,
  RotateCcw,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  label: string;
  prompt: string;
}

const quickActions: QuickAction[] = [
  { label: "Common symptoms", prompt: "What are common symptoms I should be aware of?" },
  { label: "Home remedies", prompt: "Can you suggest some Ayurvedic home remedies?" },
  { label: "When to see doctor", prompt: "When should I consult a real doctor?" },
  { label: "Preventive care", prompt: "What preventive care should I follow?" },
];

export default function DoctorChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUrgentWarning, setShowUrgentWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("doctorChatMessages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      } catch (e) {
        console.error("Failed to parse saved messages");
      }
    } else {
      // Welcome message
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "👋 Namaste! I'm Dr. AI, your Ayurvedic health assistant. I'm here to help you understand symptoms, suggest natural remedies, and guide you on your wellness journey. How can I assist you today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("doctorChatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (customPrompt?: string) => {
    const messageText = customPrompt || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setShowUrgentWarning(false);

    try {
      const response = await fetch("/api/doctor-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          history: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Check for urgent keywords in user message
      const urgentKeywords = [
        "chest pain",
        "unconscious",
        "severe bleeding",
        "can't breathe",
        "suicide",
        "heart attack",
        "stroke",
        "emergency",
      ];
      if (urgentKeywords.some((keyword) => messageText.toLowerCase().includes(keyword))) {
        setShowUrgentWarning(true);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment. If this is urgent, please consult a healthcare professional immediately.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear your chat history?")) {
      localStorage.removeItem("doctorChatMessages");
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "👋 Namaste! I'm Dr. AI, your Ayurvedic health assistant. How can I assist you today?",
          timestamp: new Date(),
        },
      ]);
      setShowUrgentWarning(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-primary/50 transition-all"
            aria-label="Open Doctor Chat"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Stethoscope className="w-7 h-7" />
            </motion.div>

            {/* Notification Dot */}
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "600px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-primary/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Dr. AI</h3>
                  <p className="text-xs text-white/80">Ayurvedic Health Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClearChat}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Clear chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Urgent Warning Banner */}
                <AnimatePresence>
                  {showUrgentWarning && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-red-50 border-b border-red-200 p-3 flex items-start gap-2"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-red-900">
                          This may require immediate medical attention
                        </p>
                        <p className="text-red-700 text-xs mt-1">
                          Please call emergency services or visit the nearest hospital if you're
                          experiencing a medical emergency.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/20">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                          message.role === "user"
                            ? "bg-primary text-white rounded-br-sm"
                            : "bg-white text-foreground rounded-bl-sm shadow-sm border border-primary/10"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === "user" ? "text-white/70" : "text-text-secondary"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-primary/10">
                        <div className="flex gap-1.5">
                          <motion.div
                            className="w-2 h-2 bg-primary/40 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-primary/40 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-primary/40 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length <= 2 && (
                  <div className="px-4 py-3 bg-white border-t border-primary/10">
                    <p className="text-xs text-text-secondary mb-2 font-medium">
                      Quick suggestions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickAction(action.prompt)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                        >
                          {action.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-primary/10">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Describe your symptoms..."
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 border border-primary/20 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!inputValue.trim() || isLoading}
                      className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
                      aria-label="Send message"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </motion.button>
                  </form>
                  <p className="text-xs text-text-secondary mt-2 text-center">
                    Not a substitute for professional medical advice
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
