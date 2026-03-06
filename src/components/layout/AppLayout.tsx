"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import BottomNav from "@/components/layout/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
    headerRight?: React.ReactNode;
}

export default function AppLayout({ children, title, headerRight }: AppLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-pinkBg flex flex-col max-w-lg mx-auto relative overflow-hidden">
            {/* Dynamic Background Blobs */}
            <div className="blob -top-20 -left-20 animate-float" style={{ animationDelay: "0s" }} />
            <div className="blob top-1/2 -right-20 animate-float" style={{ animationDelay: "2s", width: "400px", height: "400px", opacity: 0.6 }} />
            <div className="blob -bottom-20 left-10 animate-float" style={{ animationDelay: "4s", background: "radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(255, 240, 246, 0) 70%)" }} />

            {/* Header */}
            <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-40 bg-pinkBg/60 backdrop-blur-md">
                <div>
                    {title ? (
                        <h1 className="text-2xl font-black text-gradient-pink leading-tight tracking-tight">{title}</h1>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-gradient-pink">LoveSaver</span>
                            <span className="text-lg">💕</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {headerRight}
                    <LogoutButton />
                </div>
            </header>

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
