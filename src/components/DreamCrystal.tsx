"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Float, Environment, Text, Sparkles, Center } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function CrystalGoal({ title, value, color = "#ff72b6" }: { title: string, value: string, color?: string }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    
    useFrame((state) => {
        meshRef.current.rotation.y += 0.01
        meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1
    })

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Center top>
                <mesh ref={meshRef}>
                    <octahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial 
                        backside
                        samples={16}
                        resolution={256}
                        thickness={1.5}
                        anisotropy={0.5}
                        chromaticAberration={0.06}
                        distortion={0.5}
                        distortionScale={0.5}
                        temporalDistortion={0.5}
                        clearcoat={1}
                        attenuationDistance={0.5}
                        attenuationColor={color}
                        color={color}
                    />
                </mesh>
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.2}
                    color="white"
                    font="/fonts/Outfit-Black.ttf" // Fallback if font doesn't load
                    anchorX="center"
                    anchorY="middle"
                >
                    {title}
                </Text>
                <Text
                    position={[0, -1.8, 0]}
                    fontSize={0.15}
                    color={color}
                    opacity={0.8}
                    font="/fonts/Outfit-Bold.ttf"
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
    return (
        <div className="w-full h-[400px] bg-gradient-to-b from-gray-900 via-gray-800 to-black rounded-[2.5rem] overflow-hidden relative shadow-2xl group border border-white/10">
            <div className="absolute top-8 left-8 z-10">
                <h3 className="text-white text-lg font-black tracking-tighter">Your Shared Dreams</h3>
                <p className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] mt-1">Live 3D Vision Board</p>
            </div>

            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#fff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color={goals[0]?.color || "#ff72b6"} />
                
                <Environment preset="city" />
                
                <Sparkles count={50} scale={5} size={2} speed={0.4} opacity={0.3} color="#fff" />

                {goals.map((goal, i) => (
                    <group key={i} position={[(i - (goals.length - 1) / 2) * 3, 0, 0]}>
                        <CrystalGoal {...goal} />
                    </group>
                ))}
            </Canvas>

            <div className="absolute bottom-8 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    Share Dream ✨
                </button>
            </div>
        </div>
    )
}
