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
      className="h-screen flex flex-col"
      style={{ background: "var(--ws-bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4 z-20 backdrop-blur-sm"
        style={{
          background: "rgba(13,13,13,0.85)",
          borderBottom: "1px solid var(--ws-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--ws-green)" }}
          />
          <span className="text-sm font-bold tracking-tight" style={{ color: "var(--ws-text-primary)" }}>
            Spending Wrapped
          </span>
        </div>
        <button
          onClick={onRestart}
          className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
          style={{
            background: "var(--ws-surface)",
            border: "1px solid var(--ws-border)",
            color: "var(--ws-text-secondary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--ws-text-primary)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--ws-text-secondary)";
            e.currentTarget.style.borderColor = "var(--ws-border)";
          }}
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
