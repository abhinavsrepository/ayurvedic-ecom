"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import {
  doshaQuestions,
  doshaInformation,
  type DoshaType,
  type DoshaResult,
} from "@/lib/data/doshaQuiz";
import { fadeInUp } from "@/lib/motion-variants";
import Link from "next/link";

export default function DoshaQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<DoshaType[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (dosha: DoshaType) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = dosha;
    setAnswers(newAnswers);
  };

  const goToNext = () => {
    if (currentQuestion < doshaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      setShowResults(true);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = (): DoshaResult[] => {
    const counts = { vata: 0, pitta: 0, kapha: 0 };

    answers.forEach((answer) => {
      counts[answer]++;
    });

    const total = answers.length;
    const results: DoshaResult[] = [
      {
        dosha: "vata",
        score: counts.vata,
        percentage: Math.round((counts.vata / total) * 100),
      },
      {
        dosha: "pitta",
        score: counts.pitta,
        percentage: Math.round((counts.pitta / total) * 100),
      },
      {
        dosha: "kapha",
        score: counts.kapha,
        percentage: Math.round((counts.kapha / total) * 100),
      },
    ];

    return results.sort((a, b) => b.score - a.score);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    return <QuizResults results={calculateResults()} onReset={resetQuiz} />;
  }

  const progress = ((currentQuestion + 1) / doshaQuestions.length) * 100;
  const question = doshaQuestions[currentQuestion];
  const isAnswered = answers[currentQuestion] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-white to-secondary py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
            Discover Your Dosha
          </h1>
          <p className="text-lg text-text-secondary">
            Answer {doshaQuestions.length} questions to find your Ayurvedic
            body type
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-secondary">
              Question {currentQuestion + 1} of {doshaQuestions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8"
          >
            {/* Category Badge */}
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              {question.category}
            </div>

            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option.dosha)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                    answers[currentQuestion] === option.dosha
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    {option.emoji && (
                      <span className="text-4xl">{option.emoji}</span>
                    )}
                    <div className="flex-1">
                      <p className="text-lg font-medium text-foreground">
                        {option.text}
                      </p>
                    </div>
                    {answers[currentQuestion] === option.dosha && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <motion.button
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              currentQuestion === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-primary hover:bg-primary hover:text-white shadow-lg"
            }`}
            whileHover={currentQuestion > 0 ? { scale: 1.05 } : {}}
            whileTap={currentQuestion > 0 ? { scale: 0.95 } : {}}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </motion.button>

          <motion.button
            onClick={goToNext}
            disabled={!isAnswered}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              !isAnswered
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : currentQuestion === doshaQuestions.length - 1
                ? "bg-accent text-white hover:bg-accent/90 shadow-lg"
                : "bg-primary text-white hover:bg-primary-dark shadow-lg"
            }`}
            whileHover={isAnswered ? { scale: 1.05 } : {}}
            whileTap={isAnswered ? { scale: 0.95 } : {}}
          >
            {currentQuestion === doshaQuestions.length - 1
              ? "See Results"
              : "Next"}
            {currentQuestion === doshaQuestions.length - 1 ? (
              <Sparkles className="w-5 h-5" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Results Component
function QuizResults({
  results,
  onReset,
}: {
  results: DoshaResult[];
  onReset: () => void;
}) {
  const dominantDosha = results[0];
  const doshaInfo = doshaInformation[dominantDosha.dosha];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-white to-secondary py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <span className="text-7xl">{doshaInfo.icon}</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
            Your Dominant Dosha is {doshaInfo.name}!
          </h1>
          <p className="text-lg text-text-secondary">
            Element: {doshaInfo.element}
          </p>
        </motion.div>

        {/* Dosha Breakdown */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            Your Dosha Breakdown
          </h2>

          <div className="space-y-6">
            {results.map((result, index) => {
              const info = doshaInformation[result.dosha];
              return (
                <motion.div
                  key={result.dosha}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{info.icon}</span>
                      <span className="font-semibold text-lg">
                        {info.name}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {result.percentage}%
                    </span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ backgroundColor: info.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Characteristics */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            Your Characteristics
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg text-primary mb-3">
                Qualities
              </h3>
              <div className="flex flex-wrap gap-2">
                {doshaInfo.qualities.map((quality, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {quality}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary mb-3">
                Strengths
              </h3>
              <ul className="space-y-2">
                {doshaInfo.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-text-secondary">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Imbalances & Recommendations */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="font-serif font-bold text-xl text-foreground mb-4">
              Common Imbalances
            </h3>
            <ul className="space-y-2">
              {doshaInfo.imbalances.map((imbalance, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">⚠</span>
                  <span className="text-text-secondary">{imbalance}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="font-serif font-bold text-xl text-foreground mb-4">
              Recommendations
            </h3>
            <ul className="space-y-2">
              {doshaInfo.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-text-secondary">{recommendation}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Link href="/shop">
            <motion.button
              className="px-8 py-4 bg-primary text-white rounded-full font-semibold shadow-lg hover:bg-primary-dark transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Products for {doshaInfo.name}
            </motion.button>
          </Link>
          <motion.button
            onClick={onReset}
            className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-full font-semibold shadow-lg hover:bg-primary hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retake Quiz
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
