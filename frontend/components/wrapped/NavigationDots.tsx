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
          className="h-2 rounded-full bg-white/40 hover:bg-white/70 transition-colors"
          animate={{
            width: i === current ? 24 : 8,
            opacity: i === current ? 1 : 0.4,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}
