"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { IncomeEntry } from "@/lib/types";
import { Plus, Trash2, Calendar, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import AddIncomeModal from "@/components/forms/AddIncomeModal";
import { motion, AnimatePresence } from "framer-motion";

export default function IncomePage() {
    const [income, setIncome] = useState<IncomeEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchIncome();
    }, [month, year]);

    const fetchIncome = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/income?month=${month}&year=${year}`);
            const data = await res.json();
            setIncome(data);
        } catch (error) {
            console.error("Error fetching income:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteIncome = async (id: string) => {
        if (!confirm("Are you sure you want to delete this income entry?")) return;
        try {
            await fetch(`/api/income?id=${id}`, { method: "DELETE" });
            fetchIncome();
        } catch (error) {
            console.error("Error deleting income:", error);
        }
    };

    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);

    const prevMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const nextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    return (
        <AppLayout title="Income Tracking">
            <div className="flex flex-col gap-6 pt-2">
                {/* Month Selector */}
                <div className="flex items-center justify-between bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-pink-100/50 shadow-inner">
                    <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-pink-100 text-pink-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-gray-800">{getMonthName(month)} {year}</span>
                    </div>
                    <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-pink-100 text-pink-500 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Monthly Summary */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="card bg-gradient-to-br from-green-400 to-green-600 text-white !p-8 shadow-xl shadow-green-100 border-none relative overflow-hidden"
                >
                    <div className="absolute -top-6 -right-6 opacity-10 rotate-12">
                        <TrendingUp size={120} />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-50/80">Current Monthly Total</span>
                        <h3 className="text-4xl font-black mt-1 tabular-nums">{formatCurrency(totalIncome)}</h3>
                    </div>
                </motion.div>

                {/* Action Button */}
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary w-full flex items-center justify-center gap-3 !py-5"
                >
                    <Plus size={20} />
                    <span>Add New Income</span>
                </button>

                {/* Income List */}
                <div className="flex flex-col gap-3 pb-4">
                    <h4 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] ml-2 mb-1">Transaction History</h4>
                    <AnimatePresence mode="popLayout">
                        {income.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-pink-100"
                            >
                                <p className="text-gray-400 font-bold italic">No income entries this month ✨</p>
                            </motion.div>
                        ) : (
                            income.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    className="card !p-5 flex items-center justify-between group hover:border-pink-200 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 border border-green-100">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-800 text-sm uppercase tracking-tight">{item.category}</h4>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                                <Calendar size={10} />
                                                {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-green-600 tabular-nums">+{formatCurrency(item.amount)}</span>
                                        <button
                                            onClick={() => deleteIncome(item.id)}
                                            className="p-2.5 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <AddIncomeModal onClose={() => { setShowModal(false); fetchIncome(); }} />
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
