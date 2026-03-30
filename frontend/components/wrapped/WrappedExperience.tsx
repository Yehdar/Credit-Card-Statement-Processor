"use client";

import { motion } from "framer-motion";
import type { WrappedResponse } from "@/types/wrapped";
import { SlideContainer } from "./SlideContainer";

interface WrappedExperienceProps {
  data: WrappedResponse;
  onRestart: () => void;
}

export function WrappedExperience({ data, onRestart }: WrappedExperienceProps) {
  return (
    <motion.div
      className="min-h-screen bg-gray-950 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-gray-950/80 backdrop-blur-sm z-20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-white text-sm font-bold tracking-tight">
            Spending Wrapped
          </span>
        </div>
        <button
          onClick={onRestart}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          New Statement
        </button>
      </div>

      {/* Slides fill remaining space */}
      <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
        <SlideContainer data={data} onRestart={onRestart} />
      </div>
    </motion.div>
  );
}
