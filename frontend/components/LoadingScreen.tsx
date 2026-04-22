"use client";

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--ws-bg)" }}>
      <div className="text-center">
        {/* Breathing card animation */}
        <motion.div
          className="w-48 h-32 mx-auto mb-10 rounded-2xl flex items-center justify-center"
          style={{
            background: "var(--ws-surface)",
            border: "1px solid var(--ws-green-border)",
          }}
          animate={{
            scale: [1, 1.04, 1],
            opacity: [0.7, 1, 0.7],
            boxShadow: [
              "0 0 0px rgba(0,200,130,0)",
              "0 0 40px rgba(0,200,130,0.2)",
              "0 0 0px rgba(0,200,130,0)",
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

        <motion.p
          className="text-xl font-bold mb-2"
          style={{ color: "var(--ws-text-primary)" }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, times: [0, 0.2, 0.8, 1] }}
        >
          Analyzing your statement...
        </motion.p>

        <p className="text-sm" style={{ color: "var(--ws-text-muted)" }}>
          Gemini is crunching the numbers
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--ws-green)" }}
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
