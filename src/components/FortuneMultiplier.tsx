"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Flame, Zap, Award } from 'lucide-react'

interface FortuneMultiplierProps {
    streak: number
    multiplier: number
    savingsTarget: number
}

export default function FortuneMultiplier({ streak = 5, multiplier = 1.2, savingsTarget = 5000 }: FortuneMultiplierProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card !bg-white/40 backdrop-blur-2xl border-white/60 p-6 flex flex-col gap-6 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={80} className="text-pink-500" />
            </div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fortune Multiplier</span>
                    <h3 className="text-2xl font-black text-gray-800 tracking-tight">Active Streak</h3>
                </div>
                <div className="bg-gradient-to-tr from-pink-500 to-rose-400 p-3 rounded-2xl shadow-lg shadow-pink-200">
                    <Flame size={20} className="text-white animate-pulse" />
                </div>
            </div>

            <div className="flex items-end gap-3 relative z-10">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-800 to-gray-500 tracking-tighter">
                    {streak}
                </span>
                <div className="flex flex-col pb-2">
                    <span className="text-xs font-black text-pink-500 uppercase tracking-tight">Days Saved</span>
                    <span className="text-[10px] font-bold text-gray-400">Level 4: Wealth Builder</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Power Multiplier</span>
                    <span className="text-pink-500">x{multiplier.toFixed(1)} Boosting</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-white">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.4)]"
                    />
                </div>
                <p className="text-[10px] font-bold text-gray-400 mt-1 italic">
                    "Consistent savings unlock the 1.5x interest accelerator."
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2 relative z-10">
                <div className="bg-pink-50/50 p-3 rounded-2xl border border-pink-100/50 flex items-center gap-3 group hover:bg-pink-50 transition-colors cursor-pointer">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                        <TrendingUp size={14} className="text-pink-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Velocity</span>
                        <span className="text-xs font-black text-gray-800">+12%</span>
                    </div>
                </div>
                <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100/50 flex items-center gap-3 group hover:bg-purple-50 transition-colors cursor-pointer">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                        <Award size={14} className="text-purple-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Badges</span>
                        <span className="text-xs font-black text-gray-800">Elite</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
