"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const QUESTIONS = [
  {
    id: 1,
    question: "When shit hits the fan, how do you cope?",
    options: [
      "Overthink it until 3 AM like a maniac",
      "Laugh it off and make dark jokes",
      "Cry it out, then get over it",
      "Pretend everything's fine (narrator: it wasn't)",
      "Actually deal with it like a functioning adult",
    ],
  },
  {
    id: 2,
    question: "Your ideal Friday night is:",
    options: [
      "Deep conversations about life and shit",
      "Creating weird art/music no one will get",
      "Going absolutely feral with your favorite people",
      "Staying home and avoiding all humans",
      "Planning world domination (or just next week)",
    ],
  },
  {
    id: 3,
    question: "How do people see you?",
    options: [
      "The smart one who knows too much",
      "The chaotic creative disaster",
      "The sunshine friend who's lowkey intense",
      "The mysterious one who says 5 words per day",
      "The funny one hiding existential dread",
    ],
  },
  {
    id: 4,
    question: "When making big decisions, you:",
    options: [
      "Research for 6 hours then still feel unsure",
      "Flip a coin and embrace chaos",
      "Ask everyone you know for validation",
      "Trust your gut (even when it's wrong)",
      "Make a detailed pros/cons list like a nerd",
    ],
  },
  {
    id: 5,
    question: "Your emotions are:",
    options: [
      "Buried deep where no one can find them",
      "On full display for the world to see",
      "Confusing as hell, even to you",
      "Very stable (lol jk)",
      "Controlled until they explode randomly",
    ],
  },
  {
    id: 6,
    question: "In group settings, you're:",
    options: [
      "The observer taking mental notes",
      "The life of the party (or trying to be)",
      "The therapist friend listening to everyone",
      "Wondering why you came in the first place",
      "Leading the conversation somehow",
    ],
  },
  {
    id: 7,
    question: "Your relationship with productivity is:",
    options: [
      "Perfectionist or nothing at all",
      "Chaos incarnate with random bursts of genius",
      "Actually organized (teach me your ways)",
      "Procrastinate then panic-work at 2 AM",
      "Chill and strategic, no stress",
    ],
  },
  {
    id: 8,
    question: "When someone pisses you off, you:",
    options: [
      "Write a mental essay about why they're wrong",
      "Laugh it off but secretly plot revenge",
      "Express it immediately and move on",
      "Internalize it and bring it up 3 years later",
      "Stay calm and handle it maturely (boring)",
    ],
  },
  {
    id: 9,
    question: "Your idea of self-care is:",
    options: [
      "Learning something completely random",
      "Making art that no one understands",
      "Doing absolutely nothing and loving it",
      "Organizing your entire life at midnight",
      "Diving into your feelings like therapy",
    ],
  },
  {
    id: 10,
    question: "If you could describe yourself in one vibe:",
    options: [
      "Smart but anxious intellectual",
      "Chaotic creative energy",
      "Soft on outside, intense on inside",
      "Silent genius watching everything",
      "Strategic mastermind with a plan",
    ],
  },
];

export default function CorePersonalityQuiz() {
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
        // Store answers
        localStorage.setItem(
          "corePersonalityAnswers",
          JSON.stringify(newAnswers)
        );

        // Ask Gemini for Core Personality badge now and cache result
        const response = await fetch("/api/gemini/assign-badge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "core", answers: newAnswers }),
        });
        const data = await response.json();
        localStorage.setItem("coreBadgeResult", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to assign core badge:", error);
      } finally {
        setSubmitting(false);
        router.push("/quiz/music-personality");
      }
    }
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-violet-300 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-300 rounded-full opacity-20 blur-3xl"
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
                className="absolute inset-y-0 left-0 bg-gradient-cosmic rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm font-bold text-violet-700 uppercase tracking-wider">
                Section 1: Core Personality
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
                      className="group relative w-full text-left px-8 py-6 bg-white/80 hover:bg-white border-2 border-violet-200/50 hover:border-violet-400 rounded-2xl transition-all duration-200 font-semibold text-slate-700 hover:text-violet-700 shadow-lg hover:shadow-xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-50 to-fuchsia-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="relative z-10 flex items-center gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center text-sm font-bold text-violet-600 transition-colors">
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
