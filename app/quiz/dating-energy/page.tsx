"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const QUESTIONS = [
  {
    id: 1,
    question: "Your dating style is best described as:",
    options: [
      "Slow burn, I need to know you're not a psycho first",
      "Love at first sight, I catch feelings fast af",
      "Casual and chill, no pressure bullshit",
      "Independent, I need my fucking space",
      "Unconventional, the rulebook can go to hell",
    ],
  },
  {
    id: 2,
    question: "Red flags you can't ignore:",
    options: [
      "Being shady or secretive",
      "Not matching my emotional energy",
      "Getting too clingy too fast",
      "Poor communication skills",
      "Being boring or basic as fuck",
    ],
  },
  {
    id: 3,
    question: "First date vibes:",
    options: [
      "Deep convo, I wanna know your childhood trauma",
      "Romantic af, give me butterflies or gtfo",
      "Casual hangout, let's just vibe",
      "Something unique and memorable",
      "Netflix and chill, I'm lazy",
    ],
  },
  {
    id: 4,
    question: "When you catch feelings, you:",
    options: [
      "Overthink everything and spiral hard",
      "Dive in headfirst like an idiot",
      "Play it cool on the outside, dying inside",
      "Take it slow and assess the situation",
      "Panic and question everything",
    ],
  },
  {
    id: 5,
    question: "Your love language is probably:",
    options: [
      "Quality time, be present or fuck off",
      "Words of affirmation, tell me you love me",
      "Physical touch, I'm touchy as hell",
      "Acts of service, show don't tell",
      "Gifts, I like shiny things okay",
    ],
  },
  {
    id: 6,
    question: "Dealing with relationship drama:",
    options: [
      "Talk it out immediately, no ghosting",
      "Get emotional and need reassurance",
      "Need space to process my feelings",
      "Stay calm and rational about it",
      "Avoid it until it explodes honestly",
    ],
  },
  {
    id: 7,
    question: "Your ideal relationship looks like:",
    options: [
      "Deep connection, we finish each other's sentences",
      "Passionate and intense, ride or die",
      "Comfortable and easy, no drama",
      "Partnership with independence, healthy balance",
      "Weird and unique, fuck the norms",
    ],
  },
  {
    id: 8,
    question: "Biggest turn-off in dating:",
    options: [
      "Playing games or being fake",
      "Lack of effort or enthusiasm",
      "Being too available, where's the chase?",
      "Bad texting, learn to communicate",
      "No sense of humor, be fun damn",
    ],
  },
  {
    id: 9,
    question: "Your exes would probably say you:",
    options: [
      "Were hard to read sometimes",
      "Loved too hard too fast",
      "Were emotionally unavailable af",
      "Were actually pretty great (humble)",
      "Were a beautiful disaster",
    ],
  },
  {
    id: 10,
    question: "Love, to you, is:",
    options: [
      "Something you build with trust and time",
      "A beautiful chaotic mess worth it all",
      "Overrated but also kinda nice",
      "A partnership of equals who communicate",
      "Something you define your own damn way",
    ],
  },
];

export default function DatingEnergyQuiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleAnswer = async (answer: string) => {
    if (submitting) return;

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      try {
        setSubmitting(true);
        localStorage.setItem("datingEnergyAnswers", JSON.stringify(newAnswers));

        // Ask Gemini for Dating Energy badge now and cache result
        const response = await fetch("/api/gemini/assign-badge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "dating", answers: newAnswers }),
        });
        const data = await response.json();
        localStorage.setItem("datingBadgeResult", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to assign dating badge:", error);
      } finally {
        setSubmitting(false);
        // Move to results
        router.push("/results");
      }
    }
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-rose-300 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [45, 0, 45],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-300 rounded-full opacity-20 blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <div className="max-w-3xl w-full">
          {/* Progress section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="relative h-3 bg-white/50 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-sunset rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm font-bold text-rose-700 uppercase tracking-wider">
                Section 3: Dating Energy
              </p>
              <p className="text-sm font-semibold text-slate-600">
                {currentQuestion + 1} / {QUESTIONS.length}
              </p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative"
            >
              {/* Glass card effect */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl" />

              <div className="relative bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 space-y-12">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-4xl font-black text-slate-900 leading-tight"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  {QUESTIONS[currentQuestion].question}
                </motion.h2>

                <div className="space-y-5">
                  {QUESTIONS[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="group relative w-full text-left px-8 py-6 bg-white/80 hover:bg-white border-2 border-rose-200/50 hover:border-rose-400 rounded-2xl transition-all duration-200 font-semibold text-slate-700 hover:text-rose-700 shadow-lg hover:shadow-xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="relative z-10 flex items-center gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 group-hover:bg-rose-200 flex items-center justify-center text-sm font-bold text-rose-600 transition-colors">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
