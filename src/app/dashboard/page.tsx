"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { MonthSummary, SpendingInsight } from "@/lib/types";
import { Plus, ArrowUpRight, ArrowDownRight, Wallet, Target, Sparkles, TrendingUp } from "lucide-react";
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
                    <div className="flex items-center gap-2 flex-wrap">
                        {profile?.mode === "couple" && profile.partner_name ? (
                            <>
                                <h3 className="text-3xl font-black text-gray-800 tracking-tight">
                                    {profile.display_name} &amp; {profile.partner_name}
                                </h3>
                                <span className="text-2xl">💑</span>
                            </>
                        ) : profile?.display_name ? (
                            <>
                                <h3 className="text-3xl font-black text-gray-800 tracking-tight">
                                    Hey, {profile.display_name}!
                                </h3>
                                <span className="text-2xl animate-bounce">💖</span>
                            </>
                        ) : (
                            <>
                                <h3 className="text-3xl font-black text-gray-800 tracking-tight">Hello, Love!</h3>
                                <span className="text-2xl animate-bounce">💖</span>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Main Balance Card */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="relative overflow-hidden bg-gradient-to-br from-pink-400 to-pink-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-pink-200/50"
                >
                    <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
                        <Wallet size={200} />
                    </div>
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-pink-50 font-black uppercase tracking-widest text-[10px] opacity-80">
                            <Sparkles size={12} /> Total Balance
                        </div>
                        <h4 className="text-5xl font-black tracking-tighter tabular-nums">
                            {formatCurrency(data?.balance || 0)}
                        </h4>
                        <div className="flex gap-6 pt-6 mt-6 border-t border-white/20">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase font-black text-pink-100 opacity-70 tracking-widest">Income</span>
                                <div className="flex items-center gap-1 font-black text-xl">
                                    <ArrowUpRight size={16} className="text-pink-200" />
                                    {formatCurrency(data?.total_income || 0)}
                                </div>
                            </div>
                            <div className="w-[1px] h-10 bg-white/20 self-center" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase font-black text-pink-100 opacity-70 tracking-widest">Expenses</span>
                                <div className="flex items-center gap-1 font-black text-xl">
                                    <ArrowDownRight size={16} className="text-pink-200" />
                                    {formatCurrency(data?.total_expenses || 0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setShowAddExpense(true)}
                        className="card flex flex-col items-center gap-3 p-6 !bg-white group hover:!bg-pink-400 hover:text-white transition-all transform active:scale-95"
                    >
                        <div className="w-14 h-14 rounded-[1.25rem] bg-pink-50 group-hover:bg-white/20 flex items-center justify-center text-pink-500 group-hover:text-white transition-colors shadow-inner">
                            <ArrowDownRight size={28} />
                        </div>
                        <span className="font-black text-[11px] uppercase tracking-widest">Add Expense</span>
                    </button>
                    <button
                        onClick={() => setShowAddIncome(true)}
                        className="card flex flex-col items-center gap-3 p-6 !bg-white group hover:!bg-pink-400 hover:text-white transition-all transform active:scale-95"
                    >
                        <div className="w-14 h-14 rounded-[1.25rem] bg-pink-50 group-hover:bg-white/20 flex items-center justify-center text-pink-500 group-hover:text-white transition-colors shadow-inner">
                            <ArrowUpRight size={28} />
                        </div>
                        <span className="font-black text-[11px] uppercase tracking-widest">Add Income</span>
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
