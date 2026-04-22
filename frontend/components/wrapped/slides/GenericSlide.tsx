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
    emoji: string;
    label: string;
  }
> = {
  top_merchant: {
    emoji: "🏆",
    label: "Main Character Moment",
  },
  night_owl: {
    emoji: "🦉",
    label: "Night Owl",
  },
  big_flex: {
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
      className="flex flex-col items-center justify-center h-full px-8 py-12"
      style={{ background: "var(--ws-bg)" }}
    >
      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
        style={{
          background: "var(--ws-green-dim)",
          border: "1px solid var(--ws-green-border)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
      >
        <span>{config.emoji}</span>
        <span
          className="text-[10px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: "var(--ws-green)" }}
        >
          {config.label}
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        className="text-3xl md:text-4xl font-black text-center leading-tight mb-8 max-w-sm tracking-tight"
        style={{ color: "var(--ws-text-primary)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {headline}
      </motion.h2>

      {/* Main stat */}
      <motion.div
        className="text-2xl md:text-3xl font-black text-center mb-6 rounded-2xl px-6 py-5 w-full max-w-sm tabular-nums"
        style={{
          color: "var(--ws-green)",
          background: "var(--ws-surface)",
          border: "1px solid var(--ws-green-border)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      >
        {mainStat}
      </motion.div>

      {/* Context */}
      <motion.p
        className="text-base text-center max-w-xs leading-relaxed"
        style={{ color: "var(--ws-text-secondary)" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {context}
      </motion.p>
    </div>
  );
}
