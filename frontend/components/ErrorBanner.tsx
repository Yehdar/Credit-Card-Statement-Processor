"use client";

import { motion } from "framer-motion";

interface ErrorBannerProps {
  message: string;
  onReset: () => void;
}

export function ErrorBanner({ message, onReset }: ErrorBannerProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="text-5xl mb-6">💀</div>
        <h2 className="text-2xl font-black text-white mb-3">
          Something went sideways.
        </h2>
        <p className="text-gray-400 text-sm mb-2">
          Gemini couldn&apos;t process your statement.
        </p>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-left">
          <p className="text-red-400 text-xs font-mono break-words">{message}</p>
        </div>
        <motion.button
          onClick={onReset}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold rounded-xl text-sm transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ← Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
