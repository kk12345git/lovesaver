"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import BottomNav from "@/components/layout/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
    headerRight?: React.ReactNode;
    loading?: boolean;
}

export default function AppLayout({ children, title, headerRight, loading }: AppLayoutProps) {
    const pathname = usePathname();

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
                    {title ? (
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
                <div className="mx-6 mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-shake">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Configuration Required ⚠️</p>
                    <p className="text-xs font-bold text-red-500 leading-tight">
                        Missing NEXT_PUBLIC_SUPABASE_URL! Please add it to your Vercel Project Settings and Redeploy.
                    </p>
                </div>
            )}

            {/* Main content with AnimatePresence */}
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

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
