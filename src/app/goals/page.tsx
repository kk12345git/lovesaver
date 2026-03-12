"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Target, Trash2, X, Check } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

// Critical: ssr:false keeps three.js off the server during Vercel build
const DreamCrystal = dynamic(() => import("@/components/DreamCrystal"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-64 flex items-center justify-center bg-gray-950 rounded-[2.5rem] border border-white/10">
            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
});


interface SavingsGoal {
    id: string;
    name: string;
    icon: string;
    target_amount: number;
    current_amount: number;
    deadline: string | null;
}

const GOAL_ICONS = ["🏖️", "🚗", "🏠", "💍", "✈️", "🎓", "💻", "🛡️", "👶", "🎉", "🌏", "💊"];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency", currency: "INR", maximumFractionDigits: 0
    }).format(amount);
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: "", icon: "🎯", target_amount: "", deadline: "" });

    const fetchGoals = async () => {
        setLoading(true);
        const res = await fetch("/api/goals");
        const data = await res.json();
        setGoals(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchGoals(); }, []);

    const handleAdd = async () => {
        if (!form.name || !form.target_amount) return;
        await fetch("/api/goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, target_amount: Number(form.target_amount) })
        });
        setForm({ name: "", icon: "🎯", target_amount: "", deadline: "" });
        setShowAdd(false);
        fetchGoals();
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
        fetchGoals();
    };

    const getProgressColor = (percent: number) => {
        if (percent >= 100) return "from-green-400 to-emerald-500";
        if (percent >= 60) return "from-pink-400 to-rose-500";
        if (percent >= 30) return "from-amber-400 to-orange-400";
        return "from-purple-400 to-pink-400";
    };

    return (
        <AppLayout title="Savings Goals" showBack>
            <div className="space-y-4 pb-8">
                {/* Header card */}
                <div className="card bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🎯</span>
                        <div>
                            <h3 className="font-black text-lg">Dream Big!</h3>
                            <p className="text-white/80 text-sm">Set goals and watch your savings grow</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="text-white/70 text-xs uppercase tracking-widest">Active Goals</p>
                            <p className="text-3xl font-black">{goals.length}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-xs uppercase tracking-widest">Completed</p>
                            <p className="text-3xl font-black">{goals.filter(g => g.current_amount >= g.target_amount).length}</p>
                        </div>
                        <button
                            onClick={() => setShowAdd(true)}
                            className="bg-white/20 hover:bg-white/30 transition-all p-4 rounded-2xl flex items-center gap-2 font-black text-sm"
                        >
                            <Plus size={18} /> Add Goal
                        </button>
                    </div>
                </div>

                {/* 3D Vision Board */}
                {!loading && goals.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6"
                    >
                        <DreamCrystal goals={goals.slice(0, 3).map((g, i) => ({
                            title: g.name,
                            value: formatCurrency(g.target_amount),
                            color: ["#ff72b6", "#fbbf24", "#60a5fa"][i % 3]
                        }))} />
                    </motion.div>
                )}

                {/* Goals List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                                        <div className="h-2 bg-gray-100 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : goals.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card text-center py-12"
                    >
                        <div className="text-5xl mb-4">🌟</div>
                        <h3 className="font-black text-gray-700 text-lg mb-2">No Goals Yet!</h3>
                        <p className="text-gray-400 text-sm mb-6">Set your first savings goal and start your journey</p>
                        <button onClick={() => setShowAdd(true)} className="btn-primary mx-auto flex items-center gap-2">
                            <Plus size={16} /> Create First Goal
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {goals.map((goal, index) => {
                            const percent = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
                            const remaining = goal.target_amount - goal.current_amount;
                            const isComplete = percent >= 100;

                            return (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`card ${isComplete ? "border-2 border-green-200 bg-green-50/50" : ""}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                                            {goal.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-black text-gray-800 truncate">{goal.name}</h4>
                                                <div className="flex items-center gap-2 ml-2">
                                                    {isComplete && <span className="text-xs bg-green-100 text-green-600 font-black px-2 py-0.5 rounded-full">Done! 🎉</span>}
                                                    <button
                                                        onClick={() => handleDelete(goal.id)}
                                                        className="text-gray-300 hover:text-red-400 transition-colors p-1"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                                <span className="font-bold text-pink-500">{formatCurrency(goal.current_amount)}</span>
                                                <span>of {formatCurrency(goal.target_amount)}</span>
                                            </div>

                                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percent}%` }}
                                                    transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 + 0.3 }}
                                                    className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(percent)}`}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs font-black text-gray-400">{percent}% complete</span>
                                                {!isComplete && (
                                                    <span className="text-xs text-gray-400">{formatCurrency(remaining)} to go</span>
                                                )}
                                                {goal.deadline && (
                                                    <span className="text-xs text-gray-400">
                                                        📅 {new Date(goal.deadline).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Goal Bottom Sheet */}
            <AnimatePresence>
                {showAdd && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            onClick={() => setShowAdd(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-6 z-50 shadow-2xl max-w-md mx-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-gray-800">New Savings Goal</h3>
                                <button onClick={() => setShowAdd(false)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Icon Picker */}
                                <div>
                                    <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2 block">Pick an Icon</label>
                                    <div className="flex flex-wrap gap-2">
                                        {GOAL_ICONS.map(icon => (
                                            <button
                                                key={icon}
                                                onClick={() => setForm({ ...form, icon })}
                                                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${form.icon === icon ? "bg-pink-100 scale-110 shadow-md" : "bg-gray-50 hover:bg-pink-50"}`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2 block">Goal Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Dream Vacation"
                                        className="input"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2 block">Target Amount</label>
                                    <input
                                        type="number"
                                        placeholder="₹50,000"
                                        className="input"
                                        value={form.target_amount}
                                        onChange={e => setForm({ ...form, target_amount: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2 block">Target Date (Optional)</label>
                                    <input
                                        type="month"
                                        className="input"
                                        value={form.deadline}
                                        onChange={e => setForm({ ...form, deadline: e.target.value })}
                                    />
                                </div>

                                <button
                                    onClick={handleAdd}
                                    disabled={!form.name || !form.target_amount}
                                    className="btn-primary w-full !py-4 flex items-center justify-center gap-2 disabled:opacity-40"
                                >
                                    <Check size={18} /> Save Goal
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
