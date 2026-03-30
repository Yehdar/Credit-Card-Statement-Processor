"use client";

import { motion } from "framer-motion";

const loadingMessages = [
  "Crunching your receipts...",
  "Judging your life choices...",
  "Calculating the damage...",
  "Finding your inner shopaholic...",
  "Tallying the Tim Hortons runs...",
];

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="text-center">
        {/* Breathing card animation */}
        <motion.div
          className="w-48 h-32 mx-auto mb-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.6, 1, 0.6],
            boxShadow: [
              "0 0 0px rgba(52,211,153,0)",
              "0 0 40px rgba(52,211,153,0.3)",
              "0 0 0px rgba(52,211,153,0)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <motion.div
            className="text-4xl"
            animate={{ rotateY: [0, 360] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            💳
          </motion.div>
        </motion.div>

        {/* Cycling messages */}
        <motion.p
          key="loading-text"
          className="text-white text-xl font-bold mb-2"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, times: [0, 0.2, 0.8, 1] }}
        >
          {loadingMessages[0]}
        </motion.p>

        <p className="text-gray-500 text-sm">
          Gemini is analyzing your statement...
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
