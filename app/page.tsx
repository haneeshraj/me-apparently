"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    // Check if user has cached results
    const cachedResults = localStorage.getItem("cachedResults");
    queueMicrotask(() => setHasResults(!!cachedResults));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 -left-20 w-96 h-96 bg-purple-300 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 -right-20 w-96 h-96 bg-pink-300 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-300 rounded-full opacity-10 blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl w-full text-center space-y-10"
        >
          {/* Badge icons decoration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-center gap-4 mb-8"
          >
            {["✨", "🎵", "💫"].map((emoji, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="text-4xl md:text-5xl"
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 150,
              damping: 12,
            }}
          >
            <h1
              className="text-7xl md:text-8xl font-black mb-6 text-gradient-rainbow"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Me, Apparently
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-5"
          >
            <h2
              className="text-4xl md:text-5xl font-bold text-slate-900"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Find Your 3-Badge
              <br />
              <span className="text-gradient-cosmic">Personality Stack</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 font-medium">
              Takes 2 minutes. No login required.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6"
          >
            {hasResults && (
              <button
                onClick={() => router.push("/results")}
                className="px-10 py-5 bg-white text-purple-700 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-purple-400"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🏆</span> My Results
                </span>
              </button>
            )}

            <button
              onClick={() => router.push("/username")}
              className="px-12 py-5 block bg-gradient-cosmic text-white text-lg font-bold rounded-2xltransition-shadow duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                {hasResults ? "Retake Quiz" : "Start Your Journey"}
                <span>→</span>
              </span>
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-base text-slate-500 italic pt-4 px-4"
          >
            ✨ Emotionally accurate. Scientifically questionable. Very
            shareable.
          </motion.p>

          <motion.a
            href="https://twitter.com/mistartworks"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="inline-block text-sm text-slate-400 hover:text-purple-600 transition-colors pt-2"
          >
            made with 💜 by @mistartworks
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
