"use client";

import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    Float,
    MeshDistortMaterial,
    PerspectiveCamera,
    Environment,
    ContactShadows,
    Text,
    MeshTransmissionMaterial,
    Center
} from "@react-three/drei";
import {
    Bloom,
    EffectComposer,
    Noise,
    Vignette,
    DepthOfField,
    ChromaticAberration
} from "@react-three/postprocessing";
import { motion as motion3d } from "framer-motion-3d";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import * as THREE from "three";
import { ArrowRight, Sparkles, Zap, Heart, Shield, TrendingUp, ChevronDown, MousePointer2 } from "lucide-react";

// --- 3D Components ---

function CrystalHeart() {
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.x = Math.cos(t / 4) / 4;
        mesh.current.rotation.y = Math.sin(t / 4) / 4;
        mesh.current.position.y = Math.sin(t / 1.5) / 8;
    });

    return (
        <group>
            <mesh ref={mesh} scale={1.5}>
                <octahedronGeometry args={[2, 2]} />
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={5}
                    thickness={2}
                    chromaticAberration={0.05}
                    anisotropicBlur={1}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    envMapIntensity={2}
                    color="#FFB6C1"
                    ior={1.5}
                />
            </mesh>
            {/* Core Glow */}
            <mesh scale={0.8}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color="#FF6FAE"
                    emissive="#FF1493"
                    emissiveIntensity={10}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
}

function FinancialShards() {
    const count = 40;
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 10;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -20 + Math.random() * 40;
            const yFactor = -20 + Math.random() * 40;
            const zFactor = -20 + Math.random() * 40;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const mesh = useRef<THREE.InstancedMesh>(null!);
    useFrame((state) => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t = t + speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]} castShadow>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#FF6FAE" roughness={0.1} metalness={0.8} />
        </instancedMesh>
    );
}

// --- UI Components ---

export default function LandingPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Smooth transitions
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
    const crystalScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.5, 3]);
    const crystalOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0.2, 1, 1, 0]);

    return (
        <div ref={containerRef} className="bg-black text-white selection:bg-pink-500 overflow-x-hidden">
            {/* Cinematic 3D Canvas */}
            <div className="fixed inset-0 z-0">
                <Canvas shadows dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={40} />

                    {/* Lighting */}
                    <ambientLight intensity={0.2} />
                    <spotLight position={[20, 20, 10]} angle={0.15} penumbra={1} intensity={5} color="#FF6FAE" castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={2} color="#8A2BE2" />
                    <directionalLight position={[0, 5, 5]} intensity={1} />

                    <Suspense fallback={null}>
                        <motion3d.group>
                            <motion3d.mesh scale={crystalScale as any}>
                                <CrystalHeart />
                            </motion3d.mesh>
                        </motion3d.group>
                        <FinancialShards />

                        <Environment preset="night" />

                        {/* Post-Processing - THE MAGIC */}
                        <EffectComposer enableNormalPass={false}>
                            <Bloom
                                luminanceThreshold={1}
                                mipmapBlur
                                intensity={1.5}
                                radius={0.4}
                            />
                            <ChromaticAberration
                                offset={new THREE.Vector2(0.002, 0.002)}
                                radialModulation={false}
                                modulationOffset={0}
                            />
                            <Noise opacity={0.05} />
                            <Vignette eskil={false} offset={0.1} darkness={1.1} />
                        </EffectComposer>
                    </Suspense>
                    <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
                </Canvas>
            </div>

            {/* Premium Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-8 mix-blend-difference">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/20">
                        <span className="text-2xl">💍</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic">LoveSaver</span>
                </motion.div>

                <div className="flex items-center gap-8">
                    <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-pink-400 transition-colors">Client Log</Link>
                    <Link href="/signup" className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-pink-500 hover:text-white transition-all">Join Club</Link>
                </div>
            </nav>

            {/* Section 1: The Infinite Abyss */}
            <section className="relative h-[200vh] flex flex-col items-center justify-start pt-[30vh] px-6 z-10 pointer-events-none">
                <motion.div style={{ opacity: heroOpacity, y: heroY }} className="text-center max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-full mb-10"
                    >
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-pink-400">Establish Your Empire</span>
                    </motion.div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-12 italic">
                        LUXURY <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">SAVINGS.</span>
                    </h1>

                    <p className="text-lg md:text-xl font-medium text-gray-400 max-w-xl mx-auto leading-relaxed pointer-events-auto">
                        Stop counting pennies. Start building a legacy. The world's first cinematic finance companion for the next generation of wealthy couples.
                    </p>
                </motion.div>
            </section>

            {/* Section 2: The Manifestation */}
            <section className="relative h-screen flex items-center justify-center z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="max-w-4xl text-center px-6"
                >
                    <h2 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.5em] mb-6">01. The Daily Standard</h2>
                    <h3 className="text-5xl md:text-7xl font-black mb-10 tracking-tight">Pure Visual <br /> Clarity. 🧘‍♀️</h3>
                    <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                        Every Swiggy order, every sneaker drop, every date night—transformed into a high-fidelity visual heartbeat. Manifest wealth through curation, not restriction.
                    </p>
                </motion.div>
            </section>

            {/* Section 3: The Sanctuary (Couple Focus) */}
            <section className="relative h-screen flex items-center justify-end pr-20 z-10">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="max-w-xl glass p-16 rounded-[4rem] border-white/10 shadow-2xl"
                >
                    <Heart size={48} className="text-pink-500 mb-8" />
                    <h3 className="text-4xl font-black mb-6">Build Together.</h3>
                    <p className="text-gray-400 font-medium text-lg leading-relaxed mb-10">
                        Designed for partners who save in sync. Share goals, celebrate milestones, and eliminate the "where did it go" anxiety.
                    </p>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">🤝</div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">✨</div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">💎</div>
                    </div>
                </motion.div>
            </section>

            {/* Final CTA: The Glow Up */}
            <section className="relative h-screen flex flex-col items-center justify-center z-10 text-center px-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="space-y-12"
                >
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
                        Ready for <br /> THE GLOW UP?
                    </h2>

                    <div className="flex flex-col items-center gap-8">
                        <Link href="/signup" className="group relative">
                            <div className="absolute inset-0 bg-pink-500 blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" />
                            <div className="relative px-16 py-8 bg-white text-black rounded-full text-xl font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-4">
                                Secure Entrance 💎
                                <ArrowRight size={24} />
                            </div>
                        </Link>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">Join 10k+ elite savers</p>
                    </div>
                </motion.div>

                {/* Footer Credits */}
                <footer className="absolute bottom-12 left-0 right-0 px-8 flex justify-between items-center opacity-30">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em]">LoveSaver • OS 3.1</p>
                    <p className="text-[8px] font-black uppercase tracking-[0.4em]">Built for the modern empire</p>
                </footer>
            </section>

            {/* Scroll Indicator */}
            <div className="fixed bottom-10 right-10 z-50 flex flex-col items-center gap-2 opacity-40">
                <div className="w-[1px] h-20 bg-gradient-to-b from-transparent to-white" />
                <span className="text-[8px] font-black uppercase tracking-widest [writing-mode:vertical-lr]">Scroll to Manifest</span>
            </div>
        </div>
    );
}
