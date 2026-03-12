"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { MonthSummary, SpendingInsight } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight, Wallet, Plus, Target, Heart, Sparkles, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import FortuneMultiplier from '@/components/FortuneMultiplier'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import AddExpenseModal from "@/components/forms/AddExpenseModal";
import AddIncomeModal from "@/components/forms/AddIncomeModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
    const [data, setData] = useState<MonthSummary | null>(null);
    const [insights, setInsights] = useState<SpendingInsight[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddIncome, setShowAddIncome] = useState(false);
    const [profile, setProfile] = useState<{ display_name?: string; partner_name?: string; mode?: string } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();

            const [summaryRes, insightsRes, profileRes] = await Promise.all([
                fetch(`/api/insights?month=${month}&year=${year}`),
                fetch(`/api/insights?month=${month}&year=${year}&type=insights`),
                fetch(`/api/profile`),
            ]);

            const summaryData = await summaryRes.json();
            const insightsData = await insightsRes.json();
            const profileData = await profileRes.json();

            setData(summaryData);
            setInsights(insightsData);
            setProfile(profileData);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants: any = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    if (loading && !data) {
        return (
            <AppLayout>
                <div className="flex flex-col gap-6 animate-pulse p-4">
                    <div className="h-48 bg-pink-100/50 rounded-[2.5rem]" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 bg-pink-50/50 rounded-[2rem]" />
                        <div className="h-32 bg-pink-50/50 rounded-[2rem]" />
                    </div>
                    <div className="h-64 bg-pink-50/50 rounded-[2.5rem]" />
                </div>
            </AppLayout>
        );
    }

    const budgetProgress = data?.budget_amount
        ? Math.min((data.total_expenses / data.budget_amount) * 100, 100)
        : 0;

    return (
        <AppLayout
            headerRight={
                <button
                    onClick={() => setShowAddIncome(true)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-pink-500 hover:scale-110 active:scale-90 transition-all"
                >
                    <Plus size={20} />
                </button>
            }
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-6 pt-2"
            >
                {/* Welcome Section */}
                <motion.div variants={itemVariants} className="flex flex-col gap-1 px-1">
                    <h2 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">
                        {getMonthName(new Date().getMonth() + 1)} Overview
                    </h2>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                            {profile?.mode === "couple" ? (
                                <>
                                    <h3 className="text-3xl font-black text-gray-800 tracking-tight leading-none">
                                        Our Lifestyle
                                    </h3>
                                    <span className="text-2xl">💍</span>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-3xl font-black text-gray-800 tracking-tight leading-none">
                                        Hey, {profile?.display_name || "Love"}!
                                    </h3>
                                    <span className="text-2xl animate-bounce">💖</span>
                                </>
                            )}
                        </div>
                        {profile?.mode === "couple" && (
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-pink-100 flex items-center justify-center text-[10px] font-black">
                                    {profile?.display_name?.charAt(0) || "U"}
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-[10px] font-black">
                                    {profile?.partner_name?.charAt(0) || "P"}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Main Balance Card - The Heart of Luxe OS */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 text-white shadow-2xl shadow-pink-200/50 group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl -ml-20 -mb-20" />
                    
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-pink-50 font-black uppercase tracking-widest text-[10px] opacity-90">
                                <span className="bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Sparkles size={10} className="animate-pulse" /> Luxe Balance
                                </span>
                            </div>
                            <div className="text-[10px] font-black opacity-60 uppercase tracking-tighter">
                                Verified Safety 🔒
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h4 className="text-6xl font-black tracking-tighter tabular-nums drop-shadow-md">
                                {formatCurrency(data?.balance || 0)}
                            </h4>
                            <p className="text-xs font-bold text-pink-100/80 tracking-tight">
                                {profile?.mode === 'couple' ? 'Shared across both accounts' : 'Available in your wallet'}
                            </p>
                        </div>

                        <div className="flex gap-3 sm:gap-4 pt-6 mt-2 border-t border-white/10">
                            <div className="flex-1 flex flex-col gap-1 bg-white/10 p-3 sm:p-4 rounded-[1.25rem] sm:rounded-[1.5rem] backdrop-blur-md">
                                <span className="text-[9px] uppercase font-black text-pink-100/70 tracking-widest">Inflow</span>
                                <div className="flex items-center gap-1 font-black text-lg sm:text-xl">
                                    <ArrowUpRight size={16} className="text-pink-200" />
                                    {formatCurrency(data?.total_income || 0)}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-1 bg-white/10 p-3 sm:p-4 rounded-[1.25rem] sm:rounded-[1.5rem] backdrop-blur-md">
                                <span className="text-[9px] uppercase font-black text-pink-100/70 tracking-widest">Outflow</span>
                                <div className="flex items-center gap-1 font-black text-lg sm:text-xl">
                                    <ArrowDownRight size={16} className="text-pink-200" />
                                    {formatCurrency(data?.total_expenses || 0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Couple Stats Card (Only if Couple Mode) */}
                {profile?.mode === 'couple' && (
                    <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
                         <FortuneMultiplier streak={7} multiplier={1.4} savingsTarget={10000} />
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div className="card !p-4 flex flex-col gap-3 !bg-white/50 backdrop-blur-xl border-white/50">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Partner Sync</span>
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                </div>
                                <p className="text-[11px] font-black text-gray-700 leading-tight">
                                    {profile.partner_name} connected. 
                                    <span className="block text-pink-400 mt-1">Updates in real-time. ✨</span>
                                </p>
                            </div>
                            <div className="card !p-4 flex flex-col gap-3 !bg-white/50 backdrop-blur-xl border-white/50">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joint Goals</span>
                                    <Target size={14} className="text-purple-400" />
                                </div>
                                <p className="text-[11px] font-black text-gray-700 leading-tight">
                                    3 Shared Dreams 
                                    <span className="block text-purple-400 mt-1">68% progress. 🏃‍♂️💨</span>
                                </p>
                            </div>
                         </div>
                    </motion.div>
                )}

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                        onClick={() => setShowAddExpense(true)}
                        className="card flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 !bg-white group hover:!bg-pink-400 hover:text-white transition-all transform active:scale-95"
                    >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1rem] sm:rounded-[1.25rem] bg-pink-50 group-hover:bg-white/20 flex items-center justify-center text-pink-500 group-hover:text-white transition-colors shadow-inner">
                            <ArrowDownRight size={24} className="sm:w-7 sm:h-7" />
                        </div>
                        <span className="font-black text-[10px] sm:text-[11px] uppercase tracking-widest">Add Expense</span>
                    </button>
                    <button
                        onClick={() => setShowAddIncome(true)}
                        className="card flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 !bg-white group hover:!bg-pink-400 hover:text-white transition-all transform active:scale-95"
                    >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1rem] sm:rounded-[1.25rem] bg-pink-50 group-hover:bg-white/20 flex items-center justify-center text-pink-500 group-hover:text-white transition-colors shadow-inner">
                            <ArrowUpRight size={24} className="sm:w-7 sm:h-7" />
                        </div>
                        <span className="font-black text-[10px] sm:text-[11px] uppercase tracking-widest">Add Income</span>
                    </button>
                </motion.div>

                {/* Spending Breakdown */}
                {data?.category_spending && data.category_spending.length > 0 && (
                    <motion.div variants={itemVariants} className="card relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-gray-800 tracking-tight">Spending Habits</h3>
                            <TrendingUp size={20} className="text-pink-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="h-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.category_spending}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={8}
                                        dataKey="amount"
                                        strokeWidth={0}
                                    >
                                        {data.category_spending.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '2rem',
                                            border: 'none',
                                            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                            padding: '16px 20px'
                                        }}
                                        itemStyle={{ fontWeight: '900', color: '#1f2937' }}
                                        cursor={false}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">Total Spent</span>
                                <span className="text-3xl font-black text-gray-800 tracking-tighter">{formatCurrency(data.total_expenses)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-6">
                            {data.category_spending.slice(0, 4).map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-2xl border border-gray-100/50">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[11px] font-black text-gray-600 truncate uppercase tracking-tight">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Budget Progress */}
                <motion.div variants={itemVariants} className="card group overflow-hidden">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 tracking-tight">
                            <Target size={22} className="text-purple-400" /> Budget Goal
                        </h3>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">
                                {Math.round(budgetProgress)}% Used
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-5 bg-pink-50 rounded-full overflow-hidden shadow-inner border border-pink-100/50">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${budgetProgress}%` }}
                            transition={{ duration: 1.2, ease: "circOut", delay: 0.5 }}
                            className={`h-full rounded-full ${budgetProgress > 90 ? 'bg-red-400' : 'bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 shadow-lg shadow-pink-200/50'}`}
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider">Current Spending</span>
                            <span className="text-sm font-black text-gray-800">{formatCurrency(data?.total_expenses || 0)}</span>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider">Monthly Limit</span>
                            <span className="text-sm font-black text-gray-800">{formatCurrency(data?.budget_amount || 0)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Smart Insights */}
                {insights.length > 0 && (
                    <motion.div variants={itemVariants} className="flex flex-col gap-4">
                        <h3 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] ml-2">Smart Insights</h3>
                        {insights.map((insight, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                className={`card !p-5 border-l-[10px] ${(insight.type as string) === 'positive' || insight.type === 'success' ? 'border-green-400' : insight.type === 'warning' ? 'border-amber-400' : 'border-blue-400'} flex items-start gap-4 shadow-sm hover:shadow-md`}
                            >
                                <div className={`p-3 rounded-[1.25rem] ${(insight.type as string) === 'positive' || insight.type === 'success' ? 'bg-green-50 text-green-500' : insight.type === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'} flex-shrink-0`}>
                                    <Sparkles size={20} />
                                </div>
                                <p className="text-[13px] font-black text-gray-700 leading-relaxed pt-1 uppercase tracking-tight">{insight.message}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* Overlays */}
            <AnimatePresence>
                {showAddExpense && (
                    <AddExpenseModal onSuccess={fetchData} onClose={() => setShowAddExpense(false)} />
                )}
                {showAddIncome && (
                    <AddIncomeModal onSuccess={fetchData} onClose={() => setShowAddIncome(false)} />
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
