"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Text, Sparkles, Center } from '@react-three/drei'
import { useRef, useState, useEffect, Suspense } from 'react'
import * as THREE from 'three'

function CrystalGoal({ title, value, color = "#ff72b6" }: { title: string, value: string, color?: string }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    
    useFrame((state) => {
        if (!meshRef.current || !state || !state.clock) return
        meshRef.current.rotation.y += 0.015
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15
    })

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
            <Center top position={[0, 0, 0]}>
                <mesh ref={meshRef}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshPhysicalMaterial 
                        color={color}
                        metalness={0.9}
                        roughness={0.1}
                        transmission={0.6}
                        thickness={2}
                        transparent
                        opacity={0.8}
                        envMapIntensity={2}
                        clearcoat={1}
                    />
                </mesh>
                <Text
                    position={[0, -1.6, 0]}
                    fontSize={0.25}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="black"
                >
                    {title}
                </Text>
                <Text
                    position={[0, -1.95, 0]}
                    fontSize={0.18}
                    color={color}
                    fillOpacity={0.9}
                    anchorX="center"
                    anchorY="middle"
                >
                    {value}
                </Text>
            </Center>
        </Float>
    )
}

export default function DreamCrystal({ goals }: { goals: { title: string, value: string, color?: string }[] }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return (
        <div className="w-full h-[400px] bg-gray-950 rounded-[2.5rem] flex items-center justify-center border border-white/5">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Synthesizing Vision...</span>
            </div>
        </div>
    )

    return (
        <div className="w-full h-[400px] bg-gradient-to-b from-black via-gray-900 to-black rounded-[2.5rem] overflow-hidden relative shadow-2xl group border border-white/10">
            <div className="absolute top-8 left-8 z-10">
                <h3 className="text-white text-lg font-black tracking-tighter">Your Shared Dreams</h3>
                <p className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] mt-1">Live 3D Vision Board</p>
            </div>

            <Suspense fallback={null}>
                <Canvas 
                    shadows
                    dpr={[1, 2]} 
                    camera={{ position: [0, 0, 7], fov: 45 }}
                    gl={{ antialias: true, alpha: true }}
                >
                    <ambientLight intensity={0.7} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#fff" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color={goals[0]?.color || "#ff72b6"} />
                    
                    <Environment preset="night" />
                    
                    <Sparkles count={80} scale={7} size={3} speed={0.5} opacity={0.4} color="#fff" />

                    {goals.slice(0, 3).map((goal, i) => (
                        <group key={i} position={[(i - (Math.min(goals.length, 3) - 1) / 2) * 3.5, 0, 0]}>
                            <CrystalGoal {...goal} />
                        </group>
                    ))}
                </Canvas>
            </Suspense>

            <div className="absolute bottom-8 right-8 z-10">
                <button className="px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 duration-300">
                    Add Vision ✨
                </button>
            </div>
        </div>
    )
}
