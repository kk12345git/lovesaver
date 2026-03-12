"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import DreamCrystal from "@/components/DreamCrystal";
import { motion } from "framer-motion";
import { Sparkles, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SavingsGoal {
    id: string;
    name: string;
    target_amount: number;
    current_amount: number;
}

export default function VisionPage() {
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGoals() {
            setLoading(true);
            try {
                const res = await fetch("/api/goals");
                const data = await res.json();
                setGoals(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        }
        fetchGoals();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <AppLayout title="Vision Board" showBack>
            <div className="space-y-6 pb-20">
                <div className="text-center space-y-2">
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">Your Future, Rendered</p>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">Dream in 3D</h2>
                    <p className="text-xs text-gray-400 max-w-[200px] mx-auto">Interact with your goals and manifest your collective wealth.</p>
                </div>

                <div className="relative aspect-square w-full max-w-sm mx-auto">
                    {!loading && goals.length > 0 ? (
                        <DreamCrystal goals={goals.slice(0, 5).map((g, i) => ({
                            title: g.name,
                            value: formatCurrency(g.target_amount),
                            color: ["#ff72b6", "#fbbf24", "#60a5fa", "#818cf8", "#f472b6"][i % 5]
                        }))} />
                    ) : loading ? (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-[3rem] border-2 border-dashed border-pink-100">
                             <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs font-black text-pink-300 uppercase tracking-widest">Warping Space...</span>
                             </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-[3rem] p-8 text-center space-y-4 border border-pink-50">
                            <div className="text-5xl">🌌</div>
                            <h3 className="font-black text-gray-800">Your Vision is Empty</h3>
                            <p className="text-xs text-gray-400">Add goals to populate your 3D manifestion chamber.</p>
                            <Link href="/goals" className="btn-primary flex items-center gap-2">
                                <Target size={16} /> Set a Goal
                            </Link>
                        </div>
                    )}
                </div>

                {goals.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                        <div className="card bg-white/40 backdrop-blur-md border border-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-pink-100 rounded-xl text-pink-500">
                                    <Sparkles size={20} />
                                </div>
                                <h3 className="font-black text-gray-800 tracking-tight">Manifestation Guide</h3>
                            </div>
                            <div className="space-y-3">
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    The <span className="font-bold text-pink-500">Luxe Vision Board</span> uses WebGL to render your dreams as floating data crystals. 
                                    By visualizing your savings everyday, you condition your mind for abundance.
                                </p>
                                <div className="pt-2">
                                   <Link href="/goals" className="text-[10px] font-black text-pink-400 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                       Manage goals <ArrowRight size={14} />
                                   </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
