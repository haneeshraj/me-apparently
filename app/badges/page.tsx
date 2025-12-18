"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CORE_PERSONALITY_BADGES,
  MUSIC_PERSONALITY_BADGES,
  DATING_ENERGY_BADGES,
  Badge,
} from "@/lib/badges";

async function downloadBadgeImage(
  badge: Badge,
  imagePath: string,
  category: string
) {
  // Create canvas with 3:4 aspect ratio
  const canvas = document.createElement("canvas");
  const width = 600;
  const height = 650;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  // Background with gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f3e8ff");
  gradient.addColorStop(1, "#fce7f3");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Border container
  const borderPadding = 30;
  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 2;
  ctx.strokeRect(
    borderPadding,
    borderPadding,
    width - borderPadding * 2,
    height - borderPadding * 2
  );

  // Category label at the top
  ctx.fillStyle = "#9333ea";
  ctx.font = 'bold 18px "Pixelify Sans", system-ui, sans-serif';
  ctx.textAlign = "center";
  ctx.fillText(category.toUpperCase(), width / 2, 85);

  // Load and draw badge image
  const img = new window.Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imagePath;
  });

  // Draw circular badge image
  const badgeSize = 280;
  const badgeCenterX = width / 2;
  const badgeCenterY = 260;

  ctx.save();
  ctx.beginPath();
  ctx.arc(badgeCenterX, badgeCenterY, badgeSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(
    img,
    badgeCenterX - badgeSize / 2,
    badgeCenterY - badgeSize / 2,
    badgeSize,
    badgeSize
  );
  ctx.restore();

  // Draw border around the circle
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(badgeCenterX, badgeCenterY, badgeSize / 2 + 4, 0, Math.PI * 2);
  ctx.stroke();

  // Badge name
  ctx.fillStyle = "#000000";
  ctx.font = 'bold 32px "Pixelify Sans", system-ui, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(badge.name, badgeCenterX, 440);

  // Description with word wrapping
  ctx.fillStyle = "#4b5563";
  ctx.font = '20px "Pixelify Sans", system-ui, sans-serif';
  const maxWidth = width - 80;
  const words = badge.description.split(" ");
  let line = "";
  let y = 490;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), badgeCenterX, y);
      line = words[i] + " ";
      y += 28;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), badgeCenterX, y);

  // Username
  const username = localStorage.getItem("username");
  if (username) {
    ctx.fillStyle = "#6b7280";
    ctx.font = '16px "Pixelify Sans", system-ui, sans-serif';
    ctx.fillText(`@${username}`, badgeCenterX, height - 90);
  }

  // Download
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${badge.name.replace(/\s+/g, "-")}-badge.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
}

export default function BadgesPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full opacity-15 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full opacity-15 blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
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
            className="text-6xl mb-6"
          >
            🏆
          </motion.div>
          <h1
            className="text-6xl md:text-7xl font-black mb-6 text-gradient-rainbow"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            All Badges
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 font-medium">
            Discover all the personality badges available
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold text-lg underline underline-offset-4 transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>

        {/* Core Personality Badges */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
            <h2
              className="text-4xl font-black text-slate-900"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Core Personality
            </h2>
            <div className="flex-1 h-1 bg-gradient-to-l from-violet-500 to-purple-500 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CORE_PERSONALITY_BADGES.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="relative"
              >
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-white/20">
                  <div className="relative w-full aspect-square mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full opacity-10 blur-2xl" />
                    <Image
                      src={`/personality/${badge.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}.png`}
                      alt={badge.name}
                      fill
                      className="object-contain drop-shadow-xl"
                    />
                  </div>
                  <h3 className="text-base font-black text-center mb-2 text-slate-900">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-slate-600 text-center mb-4 line-clamp-3">
                    {badge.description}
                  </p>
                  <button
                    onClick={() =>
                      downloadBadgeImage(
                        badge,
                        `/personality/${badge.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.png`,
                        "Core Personality"
                      )
                    }
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-lg"
                  >
                    Download
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Music Personality Badges */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
            <h2
              className="text-4xl font-black text-slate-900"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Music Personality
            </h2>
            <div className="flex-1 h-1 bg-gradient-to-l from-emerald-500 to-cyan-500 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {MUSIC_PERSONALITY_BADGES.map((badge, index) => {
              // Handle special cases with extra spaces in filenames
              let filename = badge.name.toLowerCase().replace(/\s+/g, "-");
              if (badge.name === "Late-Night Thinker") {
                filename = "night-thinker";
              } else if (badge.name === "Nostalgia Trapped") {
                filename = "nostalgia-trapped ";
              } else if (badge.name === "Adrenaline Listener") {
                filename = "adrenaline-listener ";
              }

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-white/20">
                    <div className="relative w-full aspect-square mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-10 blur-2xl" />
                      <Image
                        src={`/music/${filename}.png`}
                        alt={badge.name}
                        fill
                        className="object-contain drop-shadow-xl"
                      />
                    </div>
                    <h3 className="text-base font-black text-center mb-2 text-slate-900">
                      {badge.name}
                    </h3>
                    <p className="text-xs text-slate-600 text-center mb-4 line-clamp-3">
                      {badge.description}
                    </p>
                    <button
                      onClick={() =>
                        downloadBadgeImage(
                          badge,
                          `/music/${filename}.png`,
                          "Music Personality"
                        )
                      }
                      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      Download
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Dating Energy Badges */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" />
            <h2
              className="text-4xl font-black text-slate-900"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Dating Energy
            </h2>
            <div className="flex-1 h-1 bg-gradient-to-l from-rose-500 to-pink-500 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {DATING_ENERGY_BADGES.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-white/20">
                  <div className="relative w-full aspect-square mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full opacity-10 blur-2xl" />
                    <Image
                      src={`/dating/${badge.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}.png`}
                      alt={badge.name}
                      fill
                      className="object-contain drop-shadow-xl"
                    />
                  </div>
                  <h3 className="text-base font-black text-center mb-2 text-slate-900">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-slate-600 text-center mb-4 line-clamp-3">
                    {badge.description}
                  </p>
                  <button
                    onClick={() =>
                      downloadBadgeImage(
                        badge,
                        `/dating/${badge.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.png`,
                        "Dating Energy"
                      )
                    }
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    Download
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-royal rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-6xl mb-6"
              >
                🎯
              </motion.div>
              <h2
                className="text-4xl md:text-5xl font-black mb-4 text-slate-900"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Want to discover your badges?
              </h2>
              <p className="text-xl text-slate-600 mb-8 font-medium max-w-2xl mx-auto">
                Take our personality quizzes to find out which badges match your
                personality!
              </p>
              <Link href="/">
                <button className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-cosmic text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                  Start Your Quiz Journey
                  <span className="text-2xl">→</span>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
