"use client";

import { motion } from "framer-motion";
import type { MetaData } from "@/types/wrapped";

interface IntroSlideProps {
  data: MetaData;
}

export function IntroSlide({ data }: IntroSlideProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center px-8 py-12"
      style={{ background: "var(--ws-bg)" }}
    >
      {/* Greeting */}
      <motion.p
        className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-6"
        style={{ color: "var(--ws-text-muted)" }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        {data.account_holder
          ? `Here's your Wrapped, ${data.account_holder}`
          : "Here's your Wrapped"}
      </motion.p>

      {/* Persona title — hero text */}
      <motion.h1
        className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight"
        style={{ color: "var(--ws-text-primary)" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {data.persona_title}
      </motion.h1>

      {/* Decorative bar */}
      <motion.div
        className="h-1 w-24 rounded-full mb-8"
        style={{ background: "var(--ws-green)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      />

      {/* Vibe check */}
      <motion.p
        className="text-xl md:text-2xl max-w-sm leading-relaxed"
        style={{ color: "var(--ws-text-secondary)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {data.vibe_check}
      </motion.p>

      {/* Swipe hint */}
      <motion.p
        className="absolute bottom-8 text-[10px] tracking-[0.2em] uppercase"
        style={{ color: "var(--ws-text-muted)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        press spacebar or arrow keys to continue
      </motion.p>
    </div>
  );
}
