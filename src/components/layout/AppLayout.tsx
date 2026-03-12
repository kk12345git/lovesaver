"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import BottomNav from "@/components/layout/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, X } from "lucide-react";
import AddExpenseModal from "@/components/forms/AddExpenseModal";
import AddIncomeModal from "@/components/forms/AddIncomeModal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
    headerRight?: React.ReactNode;
    loading?: boolean;
    showBack?: boolean;
}

export default function AppLayout({ children, title, headerRight, loading, showBack }: AppLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [fabOpen, setFabOpen] = useState(false);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddIncome, setShowAddIncome] = useState(false);

    const isDashboard = pathname === "/dashboard";

    return (
        <div className="min-h-screen bg-pinkBg flex flex-col max-w-lg mx-auto relative overflow-hidden">
            {/* Loading Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
                    >
                        <Logo size="xl" />
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="flex flex-col items-center gap-1"
                        >
                            <span className="text-sm font-black text-pink-500 uppercase tracking-[0.3em]">LoveSaver</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preparing your world...</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dynamic Background Blobs */}
            <div className="blob -top-20 -left-20 animate-float" style={{ animationDelay: "0s" }} />
            <div className="blob top-1/2 -right-20 animate-float" style={{ animationDelay: "2s", width: "400px", height: "400px", opacity: 0.6 }} />
            <div className="blob -bottom-20 left-10 animate-float" style={{ animationDelay: "4s", background: "radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(255, 240, 246, 0) 70%)" }} />

            {/* Header */}
            <header className="px-6 pt-10 pb-6 flex items-center justify-between sticky top-0 z-40 bg-pinkBg/60 backdrop-blur-xl border-b border-pink-100/30">
                <div className="flex items-center gap-3">
                    {showBack ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                            >
                                <ArrowLeft size={18} className="text-gray-600" />
                            </button>
                            {title && (
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-black text-gray-800 leading-tight tracking-tight">{title}</h1>
                                    <div className="h-1 w-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mt-1" />
                                </div>
                            )}
                        </div>
                    ) : title ? (
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black text-gray-800 leading-tight tracking-tight">{title}</h1>
                            <div className="h-1 w-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mt-1" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Logo size="sm" />
                            <span className="text-xl font-black text-gray-800 tracking-tight">LoveSaver</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {headerRight}
                    <LogoutButton />
                </div>
            </header>

            {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
                <div className="mx-6 mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Configuration Required ⚠️</p>
                    <p className="text-xs font-bold text-red-500 leading-tight">
                        Missing NEXT_PUBLIC_SUPABASE_URL! Please add it to your Vercel Project Settings and Redeploy.
                    </p>
                </div>
            )}

            {/* Main content */}
            <main className="flex-1 pb-28 px-4 z-10 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ─── Floating Quick-Add Button ─── */}
            <AnimatePresence>
                {fabOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={() => setFabOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* FAB Action Buttons */}
            <AnimatePresence>
                {fabOpen && (
                    <div className="fixed bottom-32 right-6 z-50 flex flex-col items-end gap-3">
                        {/* Expense */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 20 }}
                            transition={{ delay: 0.05 }}
                            onClick={() => { setFabOpen(false); setShowAddExpense(true); }}
                            className="flex items-center gap-3 bg-white shadow-xl rounded-2xl px-4 py-3 border border-red-100"
                        >
                            <span className="text-xs font-black text-gray-700">Add Expense</span>
                            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                                <TrendingDown size={18} className="text-red-400" />
                            </div>
                        </motion.button>

                        {/* Income */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 20 }}
                            transition={{ delay: 0 }}
                            onClick={() => { setFabOpen(false); setShowAddIncome(true); }}
                            className="flex items-center gap-3 bg-white shadow-xl rounded-2xl px-4 py-3 border border-green-100"
                        >
                            <span className="text-xs font-black text-gray-700">Add Income</span>
                            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                                <TrendingUp size={18} className="text-green-400" />
                            </div>
                        </motion.button>
                    </div>
                )}
            </AnimatePresence>

            {/* FAB Main Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setFabOpen(v => !v)}
                className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl shadow-2xl flex items-center justify-center"
                style={{ boxShadow: "0 8px 32px rgba(236, 72, 153, 0.45)" }}
            >
                <motion.div animate={{ rotate: fabOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
                    <Plus size={26} className="text-white" strokeWidth={2.5} />
                </motion.div>
            </motion.button>

            {/* Bottom Navigation */}
            <BottomNav />

            {/* Quick-Add Modals */}
            <AnimatePresence>
                {showAddExpense && (
                    <AddExpenseModal
                        onClose={() => setShowAddExpense(false)}
                        onSuccess={() => { setShowAddExpense(false); window.location.reload(); }}
                    />
                )}
                {showAddIncome && (
                    <AddIncomeModal
                        onClose={() => setShowAddIncome(false)}
                        onSuccess={() => { setShowAddIncome(false); window.location.reload(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
