"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CORE_PERSONALITY_BADGES,
  MUSIC_PERSONALITY_BADGES,
  DATING_ENERGY_BADGES,
} from "@/lib/badges";
import { PersonalitySummary } from "@/lib/gemini";
import { exportBadge, exportAllBadges } from "@/lib/badge-export";

interface BadgeResult {
  badge: (typeof CORE_PERSONALITY_BADGES)[0];
  type: "core" | "music" | "dating";
  analytics?: Array<{ trait: string; percentage: number }>;
}

export default function ResultsPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [badges, setBadges] = useState<BadgeResult[]>([]);
  const [summary, setSummary] = useState<PersonalitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUsername, setShowUsername] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent duplicate runs in React StrictMode
    if (hasRun.current) return;
    hasRun.current = true;

    const processResults = async () => {
      try {
        // Check for cached results first
        const cachedData = localStorage.getItem("cachedResults");
        if (cachedData) {
          const cached = JSON.parse(cachedData);
          setUsername(cached.username || "");
          setBadges(cached.badges || []);
          setSummary(cached.summary || null);
          setLoading(false);
          return;
        }

        // Get username
        const storedUsername = localStorage.getItem("username") || "";
        setUsername(storedUsername);

        // Try to read cached badge assignments from previous steps
        const storedCoreBadge = localStorage.getItem("coreBadgeResult");
        const storedMusicBadge = localStorage.getItem("musicBadgeResult");
        const storedDatingBadge = localStorage.getItem("datingBadgeResult");

        let coreResult = storedCoreBadge ? JSON.parse(storedCoreBadge) : null;
        let musicResult = storedMusicBadge
          ? JSON.parse(storedMusicBadge)
          : null;
        let datingResult = storedDatingBadge
          ? JSON.parse(storedDatingBadge)
          : null;

        // Fallback: if something is missing, recompute via API using stored answers
        if (!coreResult) {
          const coreAnswers = JSON.parse(
            localStorage.getItem("corePersonalityAnswers") || "[]"
          );
          coreResult = await fetch("/api/gemini/assign-badge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "core", answers: coreAnswers }),
          }).then((r) => r.json());
        }

        if (!musicResult) {
          const musicMethod = localStorage.getItem("musicPersonalityMethod");
          const spotifyTracks = JSON.parse(
            localStorage.getItem("spotifyTracks") || "null"
          );
          const musicAnswers = JSON.parse(
            localStorage.getItem("musicPersonalityAnswers") || "[]"
          );

          musicResult = await fetch("/api/gemini/assign-badge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "music",
              answers: musicMethod === "spotify" ? null : musicAnswers,
              spotifyData:
                musicMethod === "spotify" ? { tracks: spotifyTracks } : null,
            }),
          }).then((r) => r.json());
        }

        if (!datingResult) {
          const datingAnswers = JSON.parse(
            localStorage.getItem("datingEnergyAnswers") || "[]"
          );
          datingResult = await fetch("/api/gemini/assign-badge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "dating", answers: datingAnswers }),
          }).then((r) => r.json());
        }

        const badge1 =
          CORE_PERSONALITY_BADGES.find(
            (b: (typeof CORE_PERSONALITY_BADGES)[0]) =>
              b.id === coreResult.badgeId
          ) || CORE_PERSONALITY_BADGES[0];
        const badge2 =
          MUSIC_PERSONALITY_BADGES.find(
            (b: (typeof MUSIC_PERSONALITY_BADGES)[0]) =>
              b.id === musicResult.badgeId
          ) || MUSIC_PERSONALITY_BADGES[0];
        const badge3 =
          DATING_ENERGY_BADGES.find(
            (b: (typeof DATING_ENERGY_BADGES)[0]) =>
              b.id === datingResult.badgeId
          ) || DATING_ENERGY_BADGES[0];

        setBadges([
          { badge: badge1, type: "core", analytics: coreResult.analytics },
          { badge: badge2, type: "music", analytics: musicResult.analytics },
          { badge: badge3, type: "dating", analytics: datingResult.analytics },
        ]);

        // Generate summary
        const summaryResult = await fetch("/api/gemini/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            badge1: { name: badge1.name, description: badge1.description },
            badge2: { name: badge2.name, description: badge2.description },
            badge3: { name: badge3.name, description: badge3.description },
          }),
        }).then((r) => r.json());

        setSummary(summaryResult);
        setLoading(false);

        // Cache the complete results in localStorage
        localStorage.setItem(
          "cachedResults",
          JSON.stringify({
            username: storedUsername,
            badges: [
              { badge: badge1, type: "core", analytics: coreResult.analytics },
              {
                badge: badge2,
                type: "music",
                analytics: musicResult.analytics,
              },
              {
                badge: badge3,
                type: "dating",
                analytics: datingResult.analytics,
              },
            ],
            summary: summaryResult,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error("Error processing results:", error);
        setLoading(false);
      }
    };

    processResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-10 left-10 w-96 h-96 bg-purple-300 rounded-full opacity-20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full opacity-20 blur-3xl"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-center space-y-6"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="text-8xl mb-4"
          >
            ✨
          </motion.div>
          <h2
            className="text-4xl md:text-5xl font-black text-slate-900"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Generating your personality stack...
          </h2>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-4 h-4 bg-gradient-cosmic rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full opacity-15 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full opacity-15 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 rounded-full opacity-10 blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-16 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h1
            className="text-5xl md:text-7xl font-black text-gradient-rainbow mb-4"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Your Personality Stack
          </h1>
          {username && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-slate-700"
            >
              @{username}
            </motion.p>
          )}
        </motion.div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {badges.map((badgeResult: BadgeResult, index: number) => {
            // Determine the badge image path
            let imagePath = "";
            const badgeName = badgeResult.badge.name
              .toLowerCase()
              .replace(/\s+/g, "-");

            if (badgeResult.type === "core") {
              imagePath = `/personality/${badgeName}.png`;
            } else if (badgeResult.type === "music") {
              // Handle special cases with extra spaces in filenames
              if (badgeResult.badge.name === "Late-Night Thinker") {
                imagePath = "/music/night-thinker.png";
              } else if (badgeResult.badge.name === "Nostalgia Trapped") {
                imagePath = "/music/nostalgia-trapped .png";
              } else if (badgeResult.badge.name === "Adrenaline Listener") {
                imagePath = "/music/adrenaline-listener .png";
              } else {
                imagePath = `/music/${badgeName}.png`;
              }
            } else {
              imagePath = `/dating/${badgeName}.png`;
            }

            const gradientClass =
              badgeResult.type === "core"
                ? "from-violet-500 to-purple-500"
                : badgeResult.type === "music"
                ? "from-emerald-500 to-cyan-500"
                : "from-rose-500 to-pink-500";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative"
              >
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 text-center space-y-8 border border-white/20">
                  {/* Badge type label */}
                  <div
                    className={`inline-block px-4 py-1.5 bg-gradient-to-r ${gradientClass} text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg`}
                  >
                    {badgeResult.type === "core" && "Core Personality"}
                    {badgeResult.type === "music" && "Music Personality"}
                    {badgeResult.type === "dating" && "Dating Energy"}
                  </div>

                  {/* Badge image */}
                  <div className="relative w-40 h-40 mx-auto">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${gradientClass} rounded-full opacity-20 blur-2xl`}
                    />
                    <div className="relative w-full h-full">
                      <Image
                        src={imagePath}
                        alt={badgeResult.badge.name}
                        fill
                        className="object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>

                  {/* Badge name */}
                  <h3
                    className="text-2xl font-black text-slate-900"
                    style={{ fontFamily: "var(--font-family-display)" }}
                  >
                    {badgeResult.badge.name}
                  </h3>

                  {/* Badge description */}
                  <p className="text-base text-slate-600 leading-relaxed font-medium">
                    {badgeResult.badge.description}
                  </p>

                  {/* Analytics */}
                  {badgeResult.analytics &&
                    badgeResult.analytics.length > 0 && (
                      <div className="space-y-4 pt-6 border-t border-slate-200">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Your Stats
                        </h4>
                        {badgeResult.analytics.map((stat, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-semibold text-slate-700">
                                {stat.trait}
                              </span>
                              <span
                                className={`font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
                              >
                                {stat.percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.percentage}%` }}
                                transition={{
                                  duration: 1,
                                  delay: index * 0.15 + idx * 0.1,
                                  ease: "easeOut",
                                }}
                                className={`h-full bg-gradient-to-r ${gradientClass} rounded-full shadow-lg`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Save badge button */}
                  <button
                    onClick={() =>
                      exportBadge(badgeResult.badge, username, showUsername)
                    }
                    className={`w-full px-8 py-4 bg-gradient-to-r ${gradientClass} text-white rounded-2xl text-base font-bold shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  >
                    Save Badge
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative group"
          >
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-royal rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 md:p-14 space-y-10 border border-white/20">
              <div className="text-center">
                <h2
                  className="text-4xl font-black text-gradient-cosmic mb-2"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  Your Summary
                </h2>
                <div className="w-24 h-1 bg-gradient-cosmic rounded-full mx-auto" />
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  {summary.summary.map((line: string, i: number) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="text-lg text-slate-700 leading-relaxed font-medium"
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border-l-4 border-violet-500">
                  <h3 className="font-bold text-slate-900 mb-3 text-lg flex items-center gap-2">
                    <span className="text-xl">✨</span> Key Traits
                  </h3>
                  <ul className="space-y-2">
                    {summary.traits.map((trait: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        className="flex items-start gap-3 text-slate-700"
                      >
                        <span className="text-violet-500 mt-1">•</span>
                        <span className="font-medium">{trait}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
                >
                  <p className="text-sm text-amber-800 italic flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <span className="font-medium leading-relaxed">
                      {summary.warning}
                    </span>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          {/* Username toggle */}
          <div className="flex items-center justify-center">
            <label className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg cursor-pointer border border-white/20 hover:shadow-xl transition-all">
              <input
                type="checkbox"
                checked={showUsername}
                onChange={(e) => setShowUsername(e.target.checked)}
                className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">
                Include username on badges
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() =>
                exportAllBadges(
                  badges.map((b: BadgeResult) => b.badge),
                  username,
                  showUsername,
                  badges,
                  summary || undefined
                )
              }
              className="px-12 py-6 bg-gradient-cosmic text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <span className="flex items-center justify-center gap-3">
                <span className="text-xl">📥</span>
                Save All Badges
              </span>
            </button>

            <button
              onClick={() => router.push("/")}
              className="px-12 py-6 bg-white/80 backdrop-blur-sm text-purple-700 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-purple-300 hover:border-purple-400"
            >
              <span className="flex items-center justify-center gap-2">
                ← Back to Home
              </span>
            </button>
          </div>

          {/* Browse all badges link */}
          <div className="text-center">
            <a
              href="/badges"
              className="inline-block text-purple-600 hover:text-purple-700 font-semibold underline underline-offset-4"
            >
              Browse all available badges →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
