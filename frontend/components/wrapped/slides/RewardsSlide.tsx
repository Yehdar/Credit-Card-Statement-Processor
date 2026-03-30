"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import type { RewardsEngine } from "@/types/wrapped";

interface RewardsSlideProps {
  data: RewardsEngine;
}

function CountUp({
  to,
  className,
}: {
  to: number;
  className?: string;
}) {
  const motionVal = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionVal, to, {
      duration: 1.4,
      ease: "easeOut",
      delay: 0.3,
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent = Math.round(v).toLocaleString();
        }
      },
    });
    return controls.stop;
  }, [to, motionVal]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}

export function RewardsSlide({ data }: RewardsSlideProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-12 bg-gradient-to-br from-yellow-950 via-amber-950 to-gray-950">
      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 mb-8 text-yellow-400"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
      >
        <span>⭐</span>
        <span className="text-xs font-semibold tracking-widest uppercase">
          Rewards Breakdown
        </span>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        {/* Points earned */}
        <motion.div
          className="bg-white/5 border border-yellow-500/20 rounded-2xl p-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-yellow-400/70 text-xs font-semibold tracking-widest uppercase mb-2">
            Points Earned
          </p>
          <div className="text-5xl font-black text-yellow-300">
            <CountUp to={data.points_earned} />
          </div>
        </motion.div>

        {/* Missed bag */}
        <motion.div
          className="bg-white/5 border border-gray-700 rounded-2xl p-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase mb-2">
            Points Left on the Table
          </p>
          <div className="text-4xl font-black text-gray-400">
            <CountUp to={data.missed_bag} />
          </div>
          <p className="text-gray-600 text-xs mt-1">
            You could have earned this much more.
          </p>
        </motion.div>

        {/* Optimization tip */}
        <motion.div
          className="bg-yellow-500/10 border border-yellow-500/25 rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">💡</span>
            <div>
              <p className="text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-1">
                Pro Tip
              </p>
              <p className="text-yellow-200 text-sm leading-relaxed">
                {data.optimization_tip}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
