"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { Target, Save, Sparkles, AlertCircle, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BudgetPage() {
    const [amount, setAmount] = useState<string>("");
    const [currentBudget, setCurrentBudget] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    useEffect(() => {
        fetchBudget();
    }, []);

    const fetchBudget = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/budgets?month=${month}&year=${year}`);
            const data = await res.json();
            setCurrentBudget(data.amount || 0);
            setAmount(data.amount?.toString() || "");
        } catch (error) {
            console.error("Error fetching budget:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveBudget = async () => {
        if (!amount || isNaN(Number(amount))) return;
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/budgets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount), month, year }),
            });
            if (res.ok) {
                setCurrentBudget(Number(amount));
                setMessage({ text: "Budget Goal Updated! 💖", type: 'success' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ text: "Failed to save budget.", type: 'error' });
            }
        } catch (error) {
            setMessage({ text: "Something went wrong.", type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout title="Saving Goal">
            <div className="flex flex-col gap-8 pt-4">
                {/* Header */}
                <div className="flex flex-col gap-2 px-1">
                    <h2 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">Financial Target</h2>
                    <h3 className="text-3xl font-black text-gray-800 tracking-tight">Budget Goal</h3>
                </div>

                {/* Current Budget Display */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="card relative overflow-hidden !p-10 text-center bg-gradient-to-br from-purple-500 to-pink-500 text-white border-none shadow-2xl shadow-purple-100"
                >
                    <div className="absolute top-0 left-0 p-4 opacity-10">
                        <Target size={120} />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Current Limit for {getMonthName(month)}</span>
                        <h4 className="text-5xl font-black mt-2 tabular-nums">{formatCurrency(currentBudget)}</h4>
                        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-bold text-white/50">
                            <Sparkles size={12} />
                            <span>Focus on saving this month, Love!</span>
                        </div>
                    </div>
                </motion.div>

                {/* Settings Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="card !p-8 flex flex-col gap-8 shadow-lg border border-pink-50/50"
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 block">Adjust Budget</label>
                        <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300 group-focus-within:text-pink-400 transition-colors">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="input !pl-12 !text-5xl font-black !py-8 text-gray-800 focus:scale-[1.01] transition-transform border-none shadow-inner bg-gray-50/50"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="bg-pink-50/50 p-4 rounded-3xl border border-pink-100/50 flex items-start gap-4">
                            <div className="p-2.5 rounded-2xl bg-white text-pink-500 shadow-sm border border-pink-50">
                                <Heart size={20} fill="#FF6FAE" />
                            </div>
                            <p className="text-xs font-black text-gray-600 leading-relaxed uppercase tracking-tight">
                                By setting a goal, we're building our future together. Let's stay mindful of our spending!
                            </p>
                        </div>

                        <button
                            onClick={saveBudget}
                            disabled={saving || !amount}
                            className="btn-primary w-full !py-6 flex items-center justify-center gap-3 shadow-xl shadow-pink-200 disabled:opacity-50"
                        >
                            <Save size={24} />
                            <span className="font-black uppercase tracking-widest text-sm">{saving ? "Updating..." : "Set Budget Goal"}</span>
                        </button>
                    </div>
                </motion.div>

                {/* Status Message */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`p-5 rounded-[2rem] flex items-center gap-4 border-2 ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}
                        >
                            {message.type === 'success' ? <Sparkles size={24} /> : <AlertCircle size={24} />}
                            <span className="font-black uppercase tracking-tight text-sm">{message.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
}
