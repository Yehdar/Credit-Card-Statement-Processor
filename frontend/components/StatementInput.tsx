"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface StatementInputProps {
  onSubmit: (text: string) => void;
}

function DocumentIcon() {
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M28 2H8C5.8 2 4 3.8 4 6v40c0 2.2 1.8 4 4 4h28c2.2 0 4-1.8 4-4V18L28 2z"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M28 2v16h16" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="28" x2="32" y2="28" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="34" x2="32" y2="34" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="40" x2="24" y2="40" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function StatementInput({ onSubmit }: StatementInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed) onSubmit(trimmed);
  };

  const lineCount = text.trim() ? text.trim().split("\n").filter((l) => l.trim()).length : 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--ws-bg)" }}>
      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.h1
            className="text-5xl font-black mb-3 tracking-tight"
            style={{ color: "#FFFFFF" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Your Money,{" "}
            <span style={{ color: "rgba(255,255,255,0.55)" }}>
              Unwrapped.
            </span>
          </motion.h1>
          <motion.p
            className="text-lg"
            style={{ color: "var(--ws-text-secondary)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Paste your credit card statement and get a Wrapped-style breakdown of your spending.
          </motion.p>
        </div>

        {/* Input card */}
        <motion.form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 shadow-2xl"
          style={{
            background: "var(--ws-surface)",
            border: "1px solid var(--ws-border)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label
            className="block text-[10px] font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--ws-text-muted)" }}
          >
            Paste Your Statement
          </label>

          {/* Drop zone */}
          <div
            className="relative w-full h-72 rounded-xl cursor-text"
            style={{ border: "1.5px dashed rgba(255,255,255,0.18)" }}
            onClick={() => textareaRef.current?.focus()}
          >
            {/* Visual overlay — shown when empty */}
            {!text && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none select-none">
                <DocumentIcon />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Click or paste your statement here
                </p>
              </div>
            )}

            {/* "Ready" state overlay — shown when has content */}
            {text && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none select-none">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                  <path d="M10 16l4 4 8-8" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {lineCount} line{lineCount !== 1 ? "s" : ""} loaded
                </p>
              </div>
            )}

            {/* Invisible textarea — handles all input */}
            <textarea
              ref={textareaRef}
              className="absolute inset-0 w-full h-full bg-transparent rounded-xl p-4 resize-none focus:outline-none"
              style={{ color: "transparent", caretColor: "rgba(255,255,255,0.7)" }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              aria-label="Statement input"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs" style={{ color: "var(--ws-text-muted)" }}>
              Max 50KB 
            </p>
            <motion.button
              type="submit"
              disabled={!text.trim()}
              className="px-6 py-3 font-bold rounded-xl text-sm transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#FFFFFF",
              }}
              whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.18)" } as never}
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
