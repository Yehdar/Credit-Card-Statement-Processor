"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import type { StatsSummary } from "@/types/wrapped";

interface StatsSummarySlideProps {
  data: StatsSummary;
}

function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
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
          ref.current.textContent =
            prefix + v.toFixed(decimals) + suffix;
        }
      },
    });
    return controls.stop;
  }, [to, prefix, suffix, decimals, motionVal]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

export function StatsSummarySlide({ data }: StatsSummarySlideProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-12 bg-gradient-to-br from-blue-950 via-indigo-950 to-gray-950">
      <motion.p
        className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        By the numbers
      </motion.p>

      <div className="w-full max-w-sm space-y-6">
        {/* Total spent */}
        <motion.div
          className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-2">
            Total Spent
          </p>
          <div className="text-5xl font-black text-white">
            <CountUp
              to={data.total_spent}
              prefix="$"
              decimals={2}
            />
          </div>
        </motion.div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Transactions */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-2">
              Transactions
            </p>
            <div className="text-4xl font-black text-white">
              <CountUp to={data.transaction_count} />
            </div>
          </motion.div>

          {/* Top category */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-2">
              Top Category
            </p>
            <motion.div
              className="inline-flex items-center justify-center bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1.5"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <span className="text-blue-300 text-sm font-bold">
                {data.top_category}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
