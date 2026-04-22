"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StatementInputProps {
  onSubmit: (text: string) => void;
}


function FileIcon({ name, onRemove }: { name: string; onRemove: () => void }) {
  const label = name.replace(/\.docx$/i, "");
  return (
    <motion.div
      className="relative group flex flex-col items-center gap-2 cursor-default"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {/* Remove button — appears on hover */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${name}`}
        className="absolute -top-1.5 -right-1.5 z-10 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold"
        style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
      >
        ✕
      </button>

      {/* Document icon */}
      <div
        className="w-24 h-24 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <img src="/file-icon.png" alt="docx file" className="w-12 h-12 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
      </div>

      {/* Filename */}
      <p
        className="text-[10px] text-center leading-tight max-w-[96px] truncate"
        style={{ color: "rgba(255,255,255,0.55)" }}
        title={name}
      >
        {label}
      </p>
    </motion.div>
  );
}

export function StatementInput({ onSubmit }: StatementInputProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const docx = Array.from(incoming).filter((f) => f.name.endsWith(".docx"));
    if (!docx.length) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...docx.filter((f) => !existing.has(f.name))];
    });
  }, []);

  const removeFile = useCallback((name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length || isProcessing) return;

    setIsProcessing(true);
    try {
      const mammoth = (await import("mammoth")).default;
      const chunks = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          return result.value;
        })
      );
      onSubmit(chunks.join("\n\n"));
    } catch {
      setIsProcessing(false);
    }
  };

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
            <span style={{ color: "rgba(255,255,255,0.55)" }}>Unwrapped.</span>
          </motion.h1>
          <motion.p
            className="text-lg"
            style={{ color: "var(--ws-text-secondary)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Upload your credit card statement and get a Wrapped-style breakdown of your spending.
          </motion.p>
        </div>

        {/* Input card */}
        <motion.form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 shadow-2xl"
          style={{ background: "var(--ws-surface)", border: "1px solid var(--ws-border)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label
            className="block text-[10px] font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--ws-text-muted)" }}
          >
            Upload Statements
          </label>

          {/* Drop zone */}
          <div
            className="relative w-full h-72 rounded-xl cursor-pointer transition-all"
            style={{
              border: `1.5px dashed ${isDragging ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.18)"}`,
              background: isDragging ? "rgba(255,255,255,0.04)" : "transparent",
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => files.length === 0 && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />

            {files.length === 0 ? (
              /* Empty state */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none">
                <img src="/file-icon.png" alt="document" className="w-12 h-12 object-contain opacity-50" style={{ filter: "brightness(0) invert(1)" }} />
                <div className="text-center">
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Drop <span style={{ color: "rgba(255,255,255,0.7)" }}>.docx</span> files here
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                    or click to browse — multiple files supported
                  </p>
                </div>
              </div>
            ) : (
              /* Files loaded — icon grid */
              <div
                className="absolute inset-0 p-5 flex flex-wrap gap-5 content-start overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence initial={false}>
                  {files.map((f) => (
                    <FileIcon key={f.name} name={f.name} onRemove={() => removeFile(f.name)} />
                  ))}
                </AnimatePresence>

                {/* Add more — ghost icon */}
                <motion.button
                  type="button"
                  className="flex flex-col items-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div
                    className="w-24 h-24 rounded-xl flex items-center justify-center transition-colors"
                    style={{ border: "1.5px dashed rgba(255,255,255,0.15)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.35)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 22, lineHeight: 1 }}>+</span>
                  </div>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>Add more</p>
                </motion.button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs" style={{ color: "var(--ws-text-muted)" }}>
              {files.length > 0
                ? `${files.length} file${files.length !== 1 ? "s" : ""} selected`
                : "Multiple .docx files supported"}
            </p>
            <motion.button
              type="submit"
              disabled={!files.length || isProcessing}
              className="px-6 py-3 font-bold rounded-xl text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#FFFFFF",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {isProcessing ? "Reading files..." : "Unwrap My Spending →"}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
