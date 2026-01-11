"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export const BackgroundBeamsWithCollision = ({
                                               children,
                                               style,
                                             }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const beams = [
    { initialX: 10, translateY: 1200, duration: 7, delay: 0, width: 2, height: 120 },
    { initialX: 200, translateY: 1000, duration: 5, delay: 2, width: 3, height: 150 },
    { initialX: 400, translateY: 1400, duration: 8, delay: 1, width: 1.5, height: 100 },
    { initialX: 600, translateY: 1100, duration: 6, delay: 3, width: 2.5, height: 180 },
    { initialX: 800, translateY: 1200, duration: 7, delay: 0, width: 2, height: 120 },
    { initialX: 1000, translateY: 1000, duration: 5, delay: 2, width: 3, height: 150 },
  ];

  return (
      <div
          ref={parentRef}
          style={{
            position: "relative",
            width: "100%",
            minHeight: "100vh",
            overflow: "hidden",
            background: "linear-gradient(to bottom, #f9fafb, #e5e7eb)",
            ...style,
          }}
      >
        {beams.map((beam, index) => (
            <Beam
                key={index}
                beam={beam}
                containerRef={containerRef}
                parentRef={parentRef}
            />
        ))}
        {children}
        <div
            ref={containerRef}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "50px",
              boxShadow:
                  "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0,0,0,0.05) inset",
              pointerEvents: "none",
            }}
        />
      </div>
  );
};

const Beam = ({
                beam,
                containerRef,
                parentRef,
              }: {
  beam: { initialX: number; translateY: number; duration: number; delay: number; width: number; height: number };
  containerRef: React.RefObject<HTMLDivElement>;
  parentRef: React.RefObject<HTMLDivElement>;
}) => {
  const [key, setKey] = useState(0);

  return (
      <AnimatePresence>
        <motion.div
            key={key}
            style={{
              position: "absolute",
              top: -beam.height,
              left: beam.initialX,
              width: beam.width,
              height: beam.height,
              borderRadius: "2px",
              background: "linear-gradient(to top, rgba(99,102,241,0.6), rgba(168,85,247,0.4), transparent)",
            }}
            animate={{ y: beam.translateY }}
            initial={{ y: 0 }}
            transition={{
              duration: beam.duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: beam.delay,
            }}
        />
      </AnimatePresence>
  );
};
