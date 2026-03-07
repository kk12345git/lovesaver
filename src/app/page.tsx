"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Shield, TrendingUp, ChevronDown, CheckCircle2, Star, Zap } from "lucide-react";

export default function LandingPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Design Tokens - Hyper-Aesthetic Pink Palette
    const colors = {
        primary: "#FF85B2", // Silk Pink
        secondary: "#FFD1E3", // Creamy Blush
        accent: "#8A2BE2", // Electric Amethyst
        bg: "#FFF5F8", // Soft Lace
        text: "#4A2C38", // Deep Cocoa Pink
    };

    return (
        <div ref={containerRef} className="bg-[#FFF5F8] text-[#4A2C38] selection:bg-[#FFD1E3] overflow-x-hidden font-sans">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-br from-[#FFD1E3] to-transparent blur-[120px] opacity-40 rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -45, 0],
                        x: [0, -80, 0],
                        y: [0, 150, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[40%] -right-[15%] w-[70%] h-[70%] bg-gradient-to-bl from-[#FFB6C1] to-transparent blur-[150px] opacity-30 rounded-full"
                />
            </div>

            {/* Premium Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-8 backdrop-blur-2xl bg-white/30 border-b border-white/40">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF85B2] to-[#FFB6C1] rounded-2xl flex items-center justify-center shadow-xl shadow-pink-200 rotation-12">
                        <span className="text-2xl drop-shadow-md">💎</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic">LoveSaver</span>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <Link href="/login" className="hidden md:block text-[11px] font-black uppercase tracking-[0.3em] hover:text-[#FF85B2] transition-colors">Sign In</Link>
                    <Link href="/signup" className="px-8 py-3.5 bg-[#4A2C38] text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-pink-200">
                        Join Club
                    </Link>
                </div>
            </nav>

            {/* Hero Section: The Luxe Intro */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center max-w-5xl"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/60 border border-white/80 backdrop-blur-xl rounded-full mb-12 shadow-sm">
                        <Sparkles size={16} className="text-[#FF85B2]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">The 2026 Aesthetic Standard</span>
                    </div>

                    <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-12 uppercase italic">
                        Luxury <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF85B2] via-[#FFB6C1] to-[#8A2BE2]">Wealth.</span>
                    </h1>

                    <p className="text-lg md:text-2xl font-semibold text-[#6D4C5A]/80 max-w-2xl mx-auto leading-tight mb-16 px-4">
                        Ditch the spreadsheets. Track your glow-up, save with your person, and build your empire in pure pink luxury. 💖
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <Link href="/signup" className="group relative">
                            <div className="absolute inset-0 bg-[#FF85B2] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
                            <div className="relative px-16 py-8 bg-[#FF85B2] text-white rounded-[2.5rem] text-xl font-black uppercase tracking-widest hover:translate-y-[-4px] active:translate-y-[0px] transition-all flex items-center gap-4 shadow-2xl shadow-pink-300">
                                Start Your Legacy
                                <ArrowRight size={26} className="group-hover:translate-x-2 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </motion.div>

                {/* Floating Aesthetic Cards Preview */}
                <div className="absolute top-[60%] -z-10 w-full max-w-screen-xl opacity-20 pointer-events-none">
                    <div className="grid grid-cols-3 gap-8">
                        <div className="h-64 bg-white/40 rounded-[3rem] blur-sm rotate-12" />
                        <div className="h-80 bg-pink-100/40 rounded-[3rem] blur-md -rotate-6" />
                        <div className="h-64 bg-white/40 rounded-[3rem] blur-sm rotate-3" />
                    </div>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-12 opacity-30"
                >
                    <ChevronDown size={32} />
                </motion.div>
            </section>

            {/* Storytelling: Phase 01 - The Daily Chaos */}
            <section className="relative px-6 py-40 z-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="text-[11px] font-black text-[#FF85B2] uppercase tracking-[0.5em] mb-6">Phase 01: The Daily Routine</h2>
                        <h3 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] tracking-tighter uppercase italic">
                            Stop <br /> Wondering. 💸
                        </h3>
                        <p className="text-xl md:text-2xl font-medium text-[#6D4C5A]/70 leading-relaxed mb-12">
                            Swiggy at 2 AM? Quick coffee run? New sneakers?
                            The small details add up. LoveSaver turns your messy spending into a curated visual heartbeat. ✨
                        </p>

                        <div className="flex gap-6">
                            <div className="p-4 bg-white/60 backdrop-blur-xl rounded-3xl border border-white flex flex-col items-center gap-2 shadow-sm">
                                <span className="text-2xl">🍕</span>
                                <span className="text-[10px] font-black uppercase text-red-400">Order</span>
                            </div>
                            <div className="p-4 bg-white/60 backdrop-blur-xl rounded-3xl border border-white flex flex-col items-center gap-2 shadow-sm">
                                <span className="text-2xl">☕</span>
                                <span className="text-[10px] font-black uppercase text-amber-500">Brews</span>
                            </div>
                            <div className="p-4 bg-white/60 backdrop-blur-xl rounded-3xl border border-white flex flex-col items-center gap-2 shadow-sm">
                                <span className="text-2xl">👟</span>
                                <span className="text-[10px] font-black uppercase text-blue-400">Drops</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="relative">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                            whileInView={{ scale: 1, opacity: 1, rotate: 2 }}
                            viewport={{ once: true }}
                            className="bg-white/40 backdrop-blur-[100px] border border-white/60 p-12 rounded-[5rem] shadow-2xl space-y-8"
                        >
                            <div className="h-4 w-3/4 bg-[#4A2C38]/10 rounded-full animate-pulse" />
                            <div className="h-4 w-1/2 bg-[#4A2C38]/10 rounded-full animate-pulse delay-100" />
                            <div className="h-4 w-full bg-[#4A2C38]/10 rounded-full animate-pulse delay-200" />
                            <div className="pt-10 flex justify-between items-end">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Aesthetic Score</p>
                                    <p className="text-4xl font-black italic uppercase">9.8/10</p>
                                </div>
                                <Star className="text-[#FF85B2]" size={40} fill="#FF85B2" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Storytelling: Phase 02 - The Manifestation */}
            <section className="relative px-6 py-40 z-10 bg-white/30 backdrop-blur-3xl border-y border-white/40 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <TrendingUp size={48} className="text-[#FF85B2] mx-auto mb-10" />
                        <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter uppercase italic leading-none">
                            BUILD <br /> TOGETHER. 💍
                        </h2>
                        <p className="text-xl md:text-3xl font-medium text-[#6D4C5A]/70 max-w-3xl mx-auto leading-relaxed mb-16">
                            Sync with your partner and build your bank balance like a high-end brand.
                            No more money stress, just more goals—that trip to Tokyo or a luxury home setup. 🇯🇵✨
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Couple Sync", icon: "💘", desc: "Real-time shared balances" },
                                { title: "Luxe Goals", icon: "✨", desc: "Save for what actually matters" },
                                { title: "Pro Insights", icon: "📈", desc: "Smart AI financial coach" },
                            ].map((item, i) => (
                                <div key={i} className="p-10 bg-white/60 rounded-[3rem] border border-white text-left hover:scale-105 transition-transform">
                                    <span className="text-4xl mb-6 block">{item.icon}</span>
                                    <h4 className="text-xl font-black uppercase italic mb-3">{item.title}</h4>
                                    <p className="text-sm font-semibold text-[#6D4C5A]/60">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA: The Join Section */}
            <section className="relative px-6 py-60 z-10 text-center">
                <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1.5 }}
                        className="w-[100vw] h-[100vw] bg-[#FF85B2]/10 rounded-full blur-[100px]"
                    />
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <Zap size={64} className="text-[#FF85B2] mb-12 mx-auto fill-[#FF85B2]/20" />
                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none uppercase italic mb-16">
                        Manifest <br /> Wealth.
                    </h2>

                    <Link href="/signup" className="inline-flex items-center gap-6 px-16 py-8 bg-[#4A2C38] text-white rounded-full text-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_-15px_rgba(74,44,56,0.3)]">
                        Enter Entrance 👑
                        <ArrowRight size={32} />
                    </Link>

                    <p className="mt-12 text-[10px] font-black uppercase tracking-[0.6em] text-[#6D4C5A]/50">
                        Join 10k+ Elite Humans Saving in Style
                    </p>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-8 py-24 border-t border-white/40 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-10 opacity-60">
                    <div className="w-10 h-10 bg-[#FF85B2] rounded-xl flex items-center justify-center text-white shadow-lg">💎</div>
                    <span className="text-xl font-black uppercase tracking-tighter italic">LoveSaver</span>
                </div>

                <div className="flex flex-wrap justify-center gap-10 md:gap-20 text-[9px] font-black uppercase tracking-[0.4em] text-[#6D4C5A]/40 mb-16">
                    <span className="hover:text-[#FF85B2] cursor-pointer transition-colors">Safety First</span>
                    <span className="hover:text-[#FF85B2] cursor-pointer transition-colors">Privacy Shield</span>
                    <span className="hover:text-[#FF85B2] cursor-pointer transition-colors">Contact Press</span>
                </div>

                <p className="text-[8px] font-black uppercase tracking-[0.8em] text-[#6D4C5A]/20">
                    © 2026 LoveSaver OS 4.0 • Built for the modern empire
                </p>
            </footer>
        </div>
    );
}
