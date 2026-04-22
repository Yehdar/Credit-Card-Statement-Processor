"use client";

import { motion } from "framer-motion";

interface NavigationDotsProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}

export function NavigationDots({
  total,
  current,
  onDotClick,
}: NavigationDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: total }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onDotClick(i)}
          className="h-2 rounded-full transition-colors"
          style={{
            background: i === current ? "var(--ws-green)" : "rgba(255,255,255,0.2)",
          }}
          animate={{
            width: i === current ? 24 : 8,
            opacity: i === current ? 1 : 0.5,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}
