"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";

const FALLBACK_QUESTIONS = [
  {
    id: 1,
    question: "When do you blast music?",
    options: [
      "At 2 AM having an existential crisis",
      "Literally all day, I'm a walking soundtrack",
      "When I find a new artist to obsess over",
      "When I need my comfort songs to survive",
      "Whenever the vibe hits, no schedule",
    ],
  },
  {
    id: 2,
    question: "Your playlists are:",
    options: [
      "Organized by mood like a psycho",
      "Complete chaos, I just vibe",
      "Nostalgic as hell, still playing 2016 hits",
      "One song on repeat for 3 days straight",
      "Constantly updated with new shit",
    ],
  },
  {
    id: 3,
    question: "Music is basically your:",
    options: [
      "Therapy (cheaper than the real thing)",
      "Main character moment generator",
      "Way to discover weird new artists",
      "Comfort blanket when life sucks",
      "Pre-workout hype fuel",
    ],
  },
  {
    id: 4,
    question: "When you're sad, you listen to:",
    options: [
      "The saddest shit to feel even worse",
      "Nothing, I sit in silence like a weirdo",
      "Upbeat music to fake happiness",
      "My comfort songs on repeat",
      "Angry music to channel the feels",
    ],
  },
  {
    id: 5,
    question: "Your music taste is:",
    options: [
      "All over the place, genre who?",
      "Stuck in one era and proud of it",
      "Whatever matches my current mental state",
      "Curated and refined like fine wine",
      "Straight up weird, you wouldn't get it",
    ],
  },
  {
    id: 6,
    question: "How do you discover new music?",
    options: [
      "Spotify algorithm knows me too well",
      "Friends force their taste on me",
      "I actively hunt for underground artists",
      "I don't, I'm loyal to my old favorites",
      "Random TikTok sounds tbh",
    ],
  },
  {
    id: 7,
    question: "Concert/festival vibes:",
    options: [
      "Front row screaming every lyric",
      "Chilling in the back observing",
      "There for the experience and aesthetic",
      "Too anxious, I'll stream it instead",
      "Going absolutely feral in the pit",
    ],
  },
  {
    id: 8,
    question: "Your car playlist energy is:",
    options: [
      "Crying and driving, a combo",
      "Screaming lyrics like I'm on stage",
      "Chill vibes, don't want road rage",
      "Whatever Spotify recommends",
      "The same 10 songs for 6 months",
    ],
  },
  {
    id: 9,
    question: "Lyrics or beat?",
    options: [
      "Lyrics, I analyze that shit",
      "Beat, I just wanna vibe",
      "Both or it's trash",
      "Don't care, it's background noise",
      "Depends on my mood honestly",
    ],
  },
  {
    id: 10,
    question: "Music helps you:",
    options: [
      "Process emotions like therapy",
      "Escape reality for a bit",
      "Feel like the main character",
      "Stay grounded and calm",
      "Get hyped for literally anything",
    ],
  },
];

function MusicPersonalityQuizContent() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleAnswer = async (answer: string) => {
    if (submitting) return;

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < FALLBACK_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      try {
        setSubmitting(true);
        localStorage.setItem(
          "musicPersonalityAnswers",
          JSON.stringify(newAnswers)
        );
        localStorage.setItem("musicPersonalityMethod", "questions");

        // Ask Gemini for Music Personality badge based on vibe answers and cache result
        const response = await fetch("/api/gemini/assign-badge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "music",
            answers: newAnswers,
          }),
        });
        const data = await response.json();
        localStorage.setItem("musicBadgeResult", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to assign music badge:", error);
      } finally {
        setSubmitting(false);
        router.push("/quiz/dating-energy");
      }
    }
  };

  const progress = ((currentQuestion + 1) / FALLBACK_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300 rounded-full opacity-20 blur-3xl"
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
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                Section 2: Music Personality
              </p>
              <p className="text-sm font-semibold text-slate-600">
                {currentQuestion + 1} / {FALLBACK_QUESTIONS.length}
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
                  {FALLBACK_QUESTIONS[currentQuestion].question}
                </motion.h2>

                <div className="space-y-5">
                  {FALLBACK_QUESTIONS[currentQuestion].options.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="group relative w-full text-left px-8 py-6 bg-white/80 hover:bg-white border-2 border-emerald-200/50 hover:border-emerald-400 rounded-2xl transition-all duration-200 font-semibold text-slate-700 hover:text-emerald-700 shadow-lg hover:shadow-xl overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <span className="relative z-10 flex items-center gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center text-sm font-bold text-emerald-600 transition-colors">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1">{option}</span>
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function MusicPersonalityQuiz() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="text-6xl mb-4"
            >
              🎵
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-900">Loading...</h2>
          </div>
        </div>
      }
    >
      <MusicPersonalityQuizContent />
    </Suspense>
  );
}
