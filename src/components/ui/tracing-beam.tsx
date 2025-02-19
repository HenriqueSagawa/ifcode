"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    {
      stiffness: 500,
      damping: 90,
    }
  );

  return (
    <motion.div
      ref={ref}
      className={cn("relative w-full", className)}
    >
      <div className="absolute -left-20 top-3">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          animate={{
            height: svgHeight,
          }}
          className="relative h-full w-40"
        >
          <svg
            viewBox={`0 0 20 ${svgHeight}`}
            width="20"
            height={svgHeight}
            className="absolute left-8 top-0 h-full w-20 overflow-visible"
          >
            <motion.path
              d={`M 1 0 V ${svgHeight}`}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              className="stroke-foreground"
              transition={{
                duration: 0.2,
                delay: 0.5,
              }}
            />
            <motion.circle
              cx="1"
              cy={y1}
              r="4"
              fill="currentColor"
              className="fill-foreground"
            />
            <defs>
              <linearGradient
                id="gradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2={svgHeight}
              >
                <stop stopColor="#18181B" offset="0%" />
                <stop stopColor="#18181B" offset="100%" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
      <div ref={contentRef} className="ml-16">
        {children}
      </div>
    </motion.div>
  );
}; 