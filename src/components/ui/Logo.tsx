"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Logo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" | "xl", className?: string }) {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-20 h-20",
        xl: "w-32 h-32"
    };

    const iconSizes = {
        sm: 16,
        md: 24,
        lg: 40,
        xl: 64
    };

    return (
        <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
            {/* Outer Glow Halo */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 bg-pink-400/30 rounded-full blur-xl"
            />

            {/* Pulsing Rings */}
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
                className="absolute inset-0 border-2 border-pink-400/50 rounded-full"
            />

            {/* Main Heart Container */}
            <motion.div
                whileHover={{ scale: 1.1, rotate: [-5, 5, -5] }}
                className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-3 rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                >
                    <Heart size={iconSizes[size]} fill="white" className="text-white drop-shadow-md" />
                </motion.div>

                {/* Floating Sparkles */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [-10, -30],
                            x: [0, (i - 1) * 10],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeOut"
                        }}
                        className="absolute text-[8px] sm:text-[10px]"
                    >
                        ✨
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
