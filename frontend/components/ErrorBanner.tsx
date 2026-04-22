"use client";

import { motion } from "framer-motion";

interface ErrorBannerProps {
  message: string;
  onReset: () => void;
}

export function ErrorBanner({ message, onReset }: ErrorBannerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--ws-bg)" }}>
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="text-5xl mb-6">💀</div>
        <h2 className="text-2xl font-black mb-3" style={{ color: "var(--ws-text-primary)" }}>
          Something went sideways.
        </h2>
        <p className="text-sm mb-2" style={{ color: "var(--ws-text-secondary)" }}>
          Gemini couldn&apos;t process your statement.
        </p>
        <div
          className="rounded-xl p-4 mb-8 text-left"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <p className="text-xs font-mono break-words" style={{ color: "#f87171" }}>
            {message}
          </p>
        </div>
        <motion.button
          onClick={onReset}
          className="px-6 py-3 font-semibold rounded-xl text-sm transition-colors"
          style={{
            background: "var(--ws-surface)",
            border: "1px solid var(--ws-border)",
            color: "var(--ws-text-primary)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          ← Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
