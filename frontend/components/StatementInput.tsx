"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface StatementInputProps {
  onSubmit: (text: string) => void;
}

export function StatementInput({ onSubmit }: StatementInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.div
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">
              Powered by Gemini
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl font-black text-white mb-3 tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Your Money,{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Unwrapped.
            </span>
          </motion.h1>
          <motion.p
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Paste your credit card statement and get a Spotify Wrapped–style
            breakdown of your spending.
          </motion.p>
        </div>

        {/* Input card */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-semibold text-gray-400 mb-3 tracking-wide">
            PASTE YOUR STATEMENT
          </label>
          <textarea
            className="w-full h-56 bg-gray-950 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm font-mono placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            placeholder={`Jan 5  TIM HORTONS #4521 TORONTO ON  $4.50\nJan 6  SOBEYS #0215  $62.10\nJan 7  UBER *TRIP  $18.00\nJan 8  NETFLIX.COM  $17.99\n...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-600">
              Max 50KB · Data processed by Gemini 2.0 Flash
            </p>
            <motion.button
              type="submit"
              disabled={!text.trim()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 transition-shadow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Unwrap My Spending →
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
