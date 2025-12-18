"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UsernamePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleContinue = () => {
    if (username.trim()) {
      localStorage.setItem("username", username.trim());
    }
    // Clear all cached results when starting a new quiz
    localStorage.removeItem("cachedResults");
    localStorage.removeItem("coreBadgeResult");
    localStorage.removeItem("musicBadgeResult");
    localStorage.removeItem("datingBadgeResult");

    router.push("/quiz/core-personality");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 left-10 w-96 h-96 bg-pink-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl w-full space-y-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center space-y-4"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-6xl mb-4"
            >
              👤
            </motion.div>
            <h1
              className="text-5xl md:text-6xl font-black text-slate-900 mb-2"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Who Are You?
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Enter your username to get started
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <motion.div
              animate={{
                boxShadow: isFocused
                  ? "0 0 40px rgba(147, 51, 234, 0.3)"
                  : "0 10px 40px rgba(0, 0, 0, 0.1)",
              }}
              className="relative bg-white rounded-3xl overflow-hidden border-2 border-transparent transition-all duration-300"
              style={{
                borderColor: isFocused ? "#a855f7" : "transparent",
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 transition-opacity duration-300"
                style={{ opacity: isFocused ? 0.5 : 0 }}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="@username"
                className="relative z-10 w-full px-8 py-6 text-xl md:text-2xl bg-transparent focus:outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-400"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && username.trim()) {
                    handleContinue();
                  }
                }}
                autoFocus
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={handleContinue}
              disabled={!username.trim()}
              className="w-full px-12 py-7 bg-gradient-cosmic text-white text-xl font-bold rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-3">
                Continue
                <span>→</span>
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
