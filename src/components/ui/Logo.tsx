"use client";

import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: number | "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: 24,
  md: 48,
  lg: 64,
  xl: 120,
};

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const pixelSize = typeof size === "number" ? size : sizeMap[size];
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: pixelSize, height: pixelSize }}>
      {/* Animated Glow Background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-pink-300 rounded-full blur-xl"
      />

      <div className="relative z-10">
        <svg
          viewBox="0 0 200 200"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Heart Shape with Gradient */}
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
              <feOffset dx="2" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Exterior Glow/Pulse Ring */}
          <motion.path
            d="M100 170c-40-30-70-60-70-90 0-25 20-45 45-45 15 0 25 10 25 10s10-10 25-10c25 0 45 20 45 45 0 30-30 60-70 90z"
            stroke="#f472b6"
            strokeWidth="2"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Inner Pulsing Heart */}
          <motion.path
            d="M100 160c-35-25-60-50-60-75 0-20 15-35 35-35 12 0 20 8 25 8s13-8 25-8c20 0 35 15 35 35 0 25-25 50-60 75z"
            fill="url(#heartGradient)"
            filter="url(#shadow)"
            initial={{ scale: 0.8 }}
            animate={{
              scale: [0.9, 1.05, 0.95, 1.08, 0.9],
              filter: [
                "drop-shadow(0 0 5px rgba(244, 114, 182, 0.3))",
                "drop-shadow(0 0 15px rgba(244, 114, 182, 0.6))",
                "drop-shadow(0 0 5px rgba(244, 114, 182, 0.3))"
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Sparkles */}
          <motion.circle
            cx="70"
            cy="60"
            r="4"
            fill="white"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: 0.2,
            }}
          />
          <motion.circle
            cx="130"
            cy="80"
            r="3"
            fill="white"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.8,
            }}
          />
          <motion.path
            d="M150 50l3 3m-3 0l3-3"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{
              opacity: [0, 1, 0],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </svg>
      </div>

      {/* Dynamic Text Shadow */}
      <div className="absolute -bottom-6 text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] whitespace-nowrap opacity-50 blur-[0.5px]">
        LoveSaver
      </div>
    </div>
  );
}
