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
    <div
      className="flex flex-col items-center justify-center h-full px-8 py-12"
      style={{ background: "var(--ws-bg)" }}
    >
      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
        style={{
          background: "var(--ws-green-dim)",
          border: "1px solid var(--ws-green-border)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
      >
        <span>⭐</span>
        <span
          className="text-[10px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: "var(--ws-green)" }}
        >
          Rewards Breakdown
        </span>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        {/* Points earned */}
        <motion.div
          className="rounded-2xl p-5 text-center"
          style={{
            background: "var(--ws-surface)",
            border: "1px solid var(--ws-green-border)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p
            className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2"
            style={{ color: "var(--ws-text-muted)" }}
          >
            Points Earned
          </p>
          <div className="text-5xl font-black tabular-nums" style={{ color: "var(--ws-green)" }}>
            <CountUp to={data.points_earned} />
          </div>
        </motion.div>

        {/* Missed bag */}
        <motion.div
          className="rounded-2xl p-5 text-center"
          style={{
            background: "var(--ws-surface)",
            border: "1px solid var(--ws-border)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p
            className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2"
            style={{ color: "var(--ws-text-muted)" }}
          >
            Points Left on the Table
          </p>
          <div className="text-4xl font-black tabular-nums" style={{ color: "var(--ws-text-secondary)" }}>
            <CountUp to={data.missed_bag} />
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--ws-text-muted)" }}>
            You could have earned this much more.
          </p>
        </motion.div>

        {/* Optimization tip */}
        <motion.div
          className="rounded-2xl p-5"
          style={{
            background: "var(--ws-surface-raised)",
            border: "1px solid var(--ws-green-border)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">💡</span>
            <div>
              <p
                className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1"
                style={{ color: "var(--ws-green)" }}
              >
                Pro Tip
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ws-text-primary)" }}>
                {data.optimization_tip}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
