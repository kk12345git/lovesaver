"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { ExpenseEntry } from "@/lib/types";
import { Plus, Trash2, Calendar, TrendingDown, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import AddExpenseModal from "@/components/forms/AddExpenseModal";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchExpenses();
    }, [month, year]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/expenses?month=${month}&year=${year}`);
            const data = await res.json();
            setExpenses(data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteExpense = async (id: string) => {
        if (!confirm("Delete this expense entry?")) return;
        try {
            await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
            fetchExpenses();
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

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
        <AppLayout title="Expenses">
            <div className="flex flex-col gap-6 pt-2">
                {/* Month Selector */}
                <div className="flex items-center justify-between bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-pink-100/50 shadow-inner">
                    <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-pink-100 text-pink-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-gray-800 uppercase tracking-tight">{getMonthName(month)} {year}</span>
                    </div>
                    <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-pink-100 text-pink-500 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Expense Summary */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="card bg-gradient-to-br from-pink-400 to-pink-600 text-white !p-8 shadow-xl shadow-pink-100 border-none relative overflow-hidden"
                >
                    <div className="absolute -top-6 -right-6 opacity-10 rotate-12">
                        <TrendingDown size={120} />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-50/80">Monthly Spending</span>
                        <h3 className="text-4xl font-black mt-1 tabular-nums">{formatCurrency(totalExpenses)}</h3>
                    </div>
                </motion.div>

                {/* Floating Action Button */}
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary w-full flex items-center justify-center gap-3 !py-5 shadow-2xl shadow-pink-200 active:scale-95 transition-transform"
                >
                    <Plus size={20} />
                    <span className="font-black uppercase tracking-widest text-sm">Add Expense</span>
                </button>

                {/* Transaction Legend */}
                <div className="flex flex-col gap-3 pb-8">
                    <div className="flex items-center justify-between px-2">
                        <h4 className="text-[10px] font-black text-pink-300 uppercase tracking-[0.2em]">Transaction Log</h4>
                        <span className="text-[10px] font-black text-gray-400 uppercase">{expenses.length} entries</span>
                    </div>

                    <AnimatePresence mode="popLayout" initial={false}>
                        {expenses.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-pink-100"
                            >
                                <p className="text-gray-400 font-bold italic">No expenses recorded ✨</p>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {expenses.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, x: 50 }}
                                        transition={{ delay: index * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="card !p-5 flex items-center justify-between group hover:border-pink-200 transition-all hover:shadow-lg active:scale-98"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner text-xl border border-white"
                                                style={{ backgroundColor: item.expense_categories?.color || '#FF6FAE', color: 'white' }}
                                            >
                                                {item.expense_categories?.icon || '💸'}
                                            </div>
                                            <div className="flex flex-col">
                                                <h4 className="font-black text-gray-800 text-[13px] uppercase tracking-tight">
                                                    {item.expense_categories?.name || 'Other'}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                                        <Calendar size={10} className="text-pink-300" />
                                                        {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </div>
                                                    {item.notes && (
                                                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                                                    )}
                                                    {item.notes && (
                                                        <span className="text-[9px] font-bold text-gray-400 truncate max-w-[100px] italic">"{item.notes}"</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-gray-800 tabular-nums">{formatCurrency(item.amount)}</span>
                                            <button
                                                onClick={() => deleteExpense(item.id)}
                                                className="p-2 rounded-xl text-gray-200 hover:text-red-400 hover:bg-red-50 transition-all group-hover:scale-110"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <AddExpenseModal onSuccess={fetchExpenses} onClose={() => setShowModal(false)} />
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
