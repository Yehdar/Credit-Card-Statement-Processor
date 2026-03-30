"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WrappedResponse } from "@/types/wrapped";
import { IntroSlide } from "./slides/IntroSlide";
import { StatsSummarySlide } from "./slides/StatsSummarySlide";
import { GenericSlide } from "./slides/GenericSlide";
import { RewardsSlide } from "./slides/RewardsSlide";
import { NavigationDots } from "./NavigationDots";

interface SlideContainerProps {
  data: WrappedResponse;
  onRestart: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] as const },
  }),
};

// Build the ordered slide list from the response
function buildSlides(data: WrappedResponse) {
  return [
    { id: "intro" },
    { id: "stats" },
    ...data.wrapped_slides.map((s) => ({ id: s.slide_type })),
    { id: "rewards" },
  ];
}

export function SlideContainer({ data, onRestart }: SlideContainerProps) {
  const slides = buildSlides(data);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= slides.length) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex, slides.length]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Swipe handling
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      if (info.offset.x < -80) goNext();
      else if (info.offset.x > 80) goPrev();
    },
    [goNext, goPrev]
  );

  const currentSlide = slides[currentIndex];
  const isLast = currentIndex === slides.length - 1;

  function renderSlide(slideId: string) {
    if (slideId === "intro") return <IntroSlide data={data.meta_data} />;
    if (slideId === "stats") return <StatsSummarySlide data={data.stats_summary} />;
    if (slideId === "rewards") return <RewardsSlide data={data.rewards_engine} />;

    const slide = data.wrapped_slides.find((s) => s.slide_type === slideId);
    if (!slide) return null;
    return (
      <GenericSlide
        slideType={slide.slide_type}
        headline={slide.headline}
        mainStat={slide.main_stat}
        context={slide.context}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Slide area */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            dragDirectionLock
            onDragEnd={handleDragEnd}
          >
            {renderSlide(currentSlide.id)}
          </motion.div>
        </AnimatePresence>

        {/* Click zones for desktop */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-0 top-0 h-full w-16 z-10 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
            aria-label="Previous slide"
          >
            <div className="bg-black/40 rounded-full p-2">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
        )}
        {!isLast && (
          <button
            onClick={goNext}
            className="absolute right-0 top-0 h-full w-16 z-10 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
            aria-label="Next slide"
          >
            <div className="bg-black/40 rounded-full p-2">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-950 border-t border-white/5 flex items-center justify-between px-4">
        <NavigationDots
          total={slides.length}
          current={currentIndex}
          onDotClick={goTo}
        />
        {isLast && (
          <motion.button
            onClick={onRestart}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Start Over →
          </motion.button>
        )}
      </div>
    </div>
  );
}
