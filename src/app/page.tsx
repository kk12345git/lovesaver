"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, Text, Environment, ContactShadows } from "@react-three/drei";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import * as THREE from "three";
import { ArrowRight, Sparkles, Zap, Heart, Shield, TrendingUp, ChevronDown } from "lucide-react";

// --- 3D Components ---

function FloatingGems() {
    return (
        <group>
            {[...Array(15)].map((_, i) => (
                <Float
                    key={i}
                    speed={1.5}
                    rotationIntensity={2}
                    floatIntensity={2}
                    position={[
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 10 - 5
                    ]}
                >
                    <mesh rotation={[Math.random(), Math.random(), Math.random()]}>
                        <octahedronGeometry args={[0.3, 0]} />
                        <MeshDistortMaterial
                            color={i % 2 === 0 ? "#FF6FAE" : "#DDA0DD"}
                            speed={2}
                            distort={0.4}
                            radius={1}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

function HeroGem() {
    const mesh = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.x = Math.cos(t / 4) / 4;
        mesh.current.rotation.y = Math.sin(t / 4) / 4;
        mesh.current.position.y = Math.sin(t / 1.5) / 10;
    });

    return (
        <group>
            <mesh ref={mesh}>
                <octahedronGeometry args={[2, 0]} />
                <MeshDistortMaterial
                    color="#FF6FAE"
                    speed={3}
                    distort={0.3}
                    metalness={0.8}
                    roughness={0.1}
                />
            </mesh>
            <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </group>
    );
}

// --- UI Components ---

export default function LandingPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

    return (
        <div ref={containerRef} className="bg-[#FFF5F7] text-gray-800 selection:bg-pink-200">
            {/* 3D Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Canvas shadows>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                    <ambientLight intensity={1.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#FF6FAE" />

                    <Suspense fallback={null}>
                        <FloatingGems />
                        <Environment preset="city" />
                    </Suspense>
                </Canvas>
            </div>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-white/20 border-b border-white/40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-400 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-100">
                        <span className="text-xl">💎</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase">LoveSaver</span>
                </div>
                <Link href="/login" className="px-6 py-2.5 bg-white/80 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm border border-white/50">
                    Login
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 z-10">
                <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl rounded-full border border-white/80 mb-8 shadow-xl shadow-pink-50">
                        <Sparkles size={14} className="text-pink-400" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">The 2026 Wealth Experience</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-10">
                        Your Bank, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">But Aesthetic.</span>
                    </h1>

                    <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-2xl mx-auto mb-12">
                        Ditch the boring spreadsheets. Track your daily glow-up, save with your soulmate, and manifest your financial freedom. ✨
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/signup" className="btn-primary !px-14 !py-7 !text-base group flex items-center gap-3 shadow-2xl shadow-pink-200">
                            Join the Club 🚀
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-500 transition-colors uppercase tracking-widest">
                            Watch the Story <Zap size={16} />
                        </button>
                    </div>
                </motion.div>

                {/* 3D Decorative Scene (Central) */}
                <div className="absolute inset-0 -z-10 opacity-60">
                    <Canvas>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <Suspense fallback={null}>
                            <HeroGem />
                        </Suspense>
                    </Canvas>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
                    <ChevronDown size={32} />
                </div>
            </section>

            {/* Storytelling Section 1: The Chaos */}
            <section className="relative px-6 py-40 z-10 bg-white/40 backdrop-blur-3xl border-y border-white/50">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.4em] mb-4">Phase 01: The Chaos</h2>
                        <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Stop wondering <br /> where it went. 💸</h3>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            Late night Swiggy orders? Quick Starbucks runs? That "essential" sneaker drop?
                            The small things add up fast. LoveSaver turns the chaos of daily spending into a work of art.
                        </p>
                    </motion.div>
                    <div className="glass rounded-[3rem] p-4 shadow-2xl rotate-3">
                        <div className="bg-red-50 rounded-[2.5rem] p-10 h-80 flex flex-col justify-center gap-4">
                            <div className="h-4 w-3/4 bg-red-100 rounded-full animate-pulse" />
                            <div className="h-4 w-full bg-red-100 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                            <div className="h-4 w-1/2 bg-red-100 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                            <p className="text-red-400 font-black text-center mt-6 uppercase tracking-widest text-xs">Anxiety detected 📉</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Storytelling Section 2: The Glow Up */}
            <section className="relative px-6 py-40 z-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1 glass rounded-[3rem] p-4 shadow-2xl -rotate-3">
                        <div className="bg-pink-50 rounded-[2.5rem] p-10 h-80 flex flex-col items-center justify-center gap-6">
                            <TrendingUp size={64} className="text-pink-400" />
                            <div className="flex gap-2">
                                <div className="w-4 h-12 bg-pink-100 rounded-full animate-bounce" />
                                <div className="w-4 h-24 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                <div className="w-4 h-16 bg-pink-200 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                            </div>
                            <p className="text-pink-500 font-black uppercase tracking-widest text-xs">manifesting wealth ✨</p>
                        </div>
                    </div>
                    <motion.div
                        className="order-1 md:order-2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] mb-4">Phase 02: Total Glow Up</h2>
                        <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Rich life <br /> is a vibe. 🧘‍♀️</h3>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            It's not about restriction, it's about curation. Set goals that matter—that next trip to Bali or a premium setup.
                            Our smart insights give you that gentle nudge to stay on track.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Couple Feature Section */}
            <section className="relative px-6 py-40 z-10 bg-white/60 backdrop-blur-3xl border-t border-white/50">
                <div className="max-w-4xl mx-auto text-center">
                    <Heart size={48} className="text-pink-400 mx-auto mb-8 animate-pulse" />
                    <h2 className="text-5xl font-black mb-8">Better Together.</h2>
                    <p className="text-xl text-gray-500 font-medium mb-12">
                        LoveSaver wasn't just built for individuals. Sync with your partner, manage shared goals,
                        and build your future empire together. No more money arguments, just more love. ❤️
                    </p>
                </div>
            </section>

            {/* CTA Final */}
            <section className="relative px-6 py-40 z-10 text-center overflow-hidden">
                <div className="absolute inset-0 bg-pink-400 -z-20 scale-y-110 -rotate-3" />
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight">Ready for your <br /> financial glow up?</h2>
                    <Link href="/signup" className="px-16 py-8 bg-white text-pink-500 rounded-[3rem] text-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl inline-flex items-center gap-4">
                        Secure Your Spot 💎
                        <ArrowRight size={28} />
                    </Link>
                    <p className="text-pink-100 font-bold mt-10 opacity-80">Join 5,000+ stylish savers keeping it real.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-8 py-20 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center gap-3 mb-8 grayscale opacity-50">
                    <div className="w-8 h-8 bg-pink-400 rounded-xl flex items-center justify-center text-white">💎</div>
                    <span className="text-lg font-black uppercase tracking-tighter">LoveSaver</span>
                </div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
                    Privacy First • Built for Humans • 2026
                </p>
            </footer>
        </div>
    );
}
