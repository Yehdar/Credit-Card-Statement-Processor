"use client";

import { motion } from "framer-motion";
import type { SlideType } from "@/types/wrapped";

interface GenericSlideProps {
  slideType: SlideType;
  headline: string;
  mainStat: string;
  context: string;
}

const SLIDE_CONFIG: Record<
  SlideType,
  {
    gradient: string;
    accentColor: string;
    borderColor: string;
    textColor: string;
    badgeColor: string;
    emoji: string;
    label: string;
  }
> = {
  top_merchant: {
    gradient: "from-amber-950 via-orange-950 to-gray-950",
    accentColor: "text-amber-400",
    borderColor: "border-amber-500/20",
    textColor: "text-amber-300",
    badgeColor: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    emoji: "🏆",
    label: "Main Character Moment",
  },
  night_owl: {
    gradient: "from-indigo-950 via-purple-950 to-gray-950",
    accentColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    textColor: "text-purple-300",
    badgeColor: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    emoji: "🦉",
    label: "Night Owl",
  },
  big_flex: {
    gradient: "from-emerald-950 via-teal-950 to-gray-950",
    accentColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    textColor: "text-emerald-300",
    badgeColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    emoji: "💸",
    label: "The Big Flex",
  },
};

export function GenericSlide({
  slideType,
  headline,
  mainStat,
  context,
}: GenericSlideProps) {
  const config = SLIDE_CONFIG[slideType];

  return (
    <div
      className={`flex flex-col items-center justify-center h-full px-8 py-12 bg-gradient-to-br ${config.gradient}`}
    >
      {/* Badge */}
      <motion.div
        className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8 ${config.badgeColor}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
      >
        <span>{config.emoji}</span>
        <span className="text-xs font-semibold tracking-widest uppercase">
          {config.label}
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        className="text-3xl md:text-4xl font-black text-white text-center leading-tight mb-8 max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {headline}
      </motion.h2>

      {/* Main stat */}
      <motion.div
        className={`text-2xl md:text-3xl font-black ${config.accentColor} text-center mb-6 bg-white/5 border ${config.borderColor} rounded-2xl px-6 py-5 w-full max-w-sm`}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      >
        {mainStat}
      </motion.div>

      {/* Context */}
      <motion.p
        className={`${config.textColor} text-base text-center max-w-xs leading-relaxed opacity-80`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {context}
      </motion.p>
    </div>
  );
}
