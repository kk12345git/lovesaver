"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Heart, Shield, TrendingUp, ArrowRight, Zap } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#FFF5F7] overflow-x-hidden selection:bg-pink-200 selection:text-pink-600">
            {/* Background Decorations */}
            <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] bg-pink-200 rounded-full blur-[120px] opacity-40 animate-pulse-slow" />
            <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-200 rounded-full blur-[120px] opacity-40 animate-pulse-slow" style={{ animationDelay: "2s" }} />

            {/* Header / Nav */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-pink-400 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-100">
                        <span className="text-xl">💖</span>
                    </div>
                    <span className="text-xl font-black text-gray-800 tracking-tighter uppercase">LoveSaver</span>
                </div>
                <Link
                    href="/login"
                    className="px-6 py-2.5 bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl text-[11px] font-black text-gray-700 uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-sm"
                >
                    Login
                </Link>
            </nav>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="px-6 pt-12 pb-24 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full border border-pink-100 mb-8"
                    >
                        <Sparkles size={14} className="text-pink-400" />
                        <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">The Premium Finance Suite</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-gray-800 tracking-tight leading-[1.1] mb-8"
                    >
                        Manage wealth with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">Pure Love.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 font-medium text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        The only finance app designed for modern individuals and couples who value aesthetic perfection and financial clarity. Track, save, and grow together.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/signup"
                            className="btn-primary !px-12 !py-6 !text-sm group flex items-center gap-3 shadow-2xl shadow-pink-200"
                        >
                            Get Started Free 🚀
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/login"
                            className="px-10 py-5 bg-white text-gray-700 font-black uppercase text-[11px] tracking-widest rounded-[2rem] border-2 border-gray-100 hover:border-pink-200 transition-all shadow-xl"
                        >
                            Sign In
                        </Link>
                    </motion.div>
                </section>

                {/* Features Grid */}
                <section className="px-6 py-24 bg-white/40 backdrop-blur-3xl border-y border-white/50">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="text-pink-400" />}
                            title="Instant Tracking"
                            desc="Log expenses in milliseconds with our ultra-optimized glass interfaces."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="text-purple-400" />}
                            title="Smart Insights"
                            desc="Receive personalized reminders about your spending and saving milestones."
                        />
                        <FeatureCard
                            icon={<Shield className="text-blue-400" />}
                            title="Privacy First"
                            desc="Bank-grade security powered by Supabase. Your data belongs only to you."
                        />
                    </div>
                </section>

                {/* App Showcase Preview */}
                <section className="px-6 py-32 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-pink-100/50 rounded-[4rem] blur-3xl -z-10" />
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto glass rounded-[3.5rem] border-white/60 p-4 shadow-2xl"
                    >
                        <div className="bg-white rounded-[2.5rem] p-8 aspect-video flex flex-col items-center justify-center gap-6">
                            <Heart size={48} className="text-pink-400 animate-bounce" />
                            <h3 className="text-2xl font-black text-gray-800">Your Dashboard Awaits</h3>
                            <div className="flex gap-2">
                                <div className="w-12 h-2 bg-gray-100 rounded-full" />
                                <div className="w-24 h-2 bg-pink-200 rounded-full" />
                                <div className="w-12 h-2 bg-gray-100 rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="px-6 py-12 text-center border-t border-gray-100">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                        LoveSaver • Premium FinTech Experince • 2026
                    </p>
                </footer>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-8 glass rounded-[2.5rem] border-white/60 shadow-xl"
        >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}
