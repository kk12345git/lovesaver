"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Sparkles, Shield, Database, ArrowRight, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DebugPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [migrating, setMigrating] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/debug");
            const data = await res.json();
            setStats(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleMigrate = async () => {
        if (!confirm("This will move all guest-mode data to your current account. Continue?")) return;
        try {
            setMigrating(true);
            const res = await fetch("/api/debug/migrate", { method: "POST" });
            const data = await res.json();
            setMessage(data.message);
            fetchStats();
        } catch (e) {
            setMessage("Migration failed. See console.");
        } finally {
            setMigrating(false);
        }
    };

    return (
        <AppLayout title="System Status">
            <div className="flex flex-col gap-8 pt-4">
                {/* Header */}
                <div className="flex flex-col gap-2 px-1">
                    <h2 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">Diagnostics</h2>
                    <h3 className="text-3xl font-black text-gray-800 tracking-tight">Health Check</h3>
                </div>

                {loading ? (
                    <div className="flex flex-col gap-4 animate-pulse">
                        <div className="h-32 bg-gray-100 rounded-3xl" />
                        <div className="h-64 bg-gray-100 rounded-3xl" />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Auth Status */}
                        <div className={`card !p-6 border-l-[8px] ${stats?.authenticated ? 'border-green-400' : 'border-red-400'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${stats?.authenticated ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-800 uppercase text-xs tracking-widest">Authentication</h4>
                                    <p className="text-sm font-bold text-gray-500 mt-1">
                                        {stats?.authenticated ? `Connected as ${stats.user_id.slice(0, 8)}...` : "Not Logged In"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Database Sync */}
                        <div className="card !p-8 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                    <Database size={14} /> Database Status
                                </h4>
                                <button onClick={fetchStats} className="p-2 text-pink-400 hover:bg-pink-50 rounded-xl transition-colors">
                                    <RefreshCw size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(stats?.counts || {}).map(([table, count]: [string, any]) => (
                                    <div key={table} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">{table.replace('_', ' ')}</span>
                                        <span className="text-xl font-black text-gray-800 flex items-center gap-2">
                                            {typeof count === 'number' ? (
                                                <>
                                                    {count}
                                                    {count > 0 ? <CheckCircle2 size={14} className="text-green-400" /> : <AlertTriangle size={14} className="text-amber-400" />}
                                                </>
                                            ) : (
                                                <span className="text-[10px] text-red-400 leading-tight">FAILED</span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Migration Tool */}
                        <div className="card !p-8 bg-gradient-to-br from-pink-500 to-pink-600 text-white relative overflow-hidden">
                            <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
                            <div className="relative z-10">
                                <h4 className="font-black uppercase text-[10px] tracking-[0.2em] opacity-80 mb-2">Recovery Tool</h4>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">Restore Guest Data</h3>
                                <p className="text-xs font-bold leading-relaxed opacity-90 mb-6">
                                    If you used the app before creating an account, click below to move all your data to your new secure profile! 💎
                                </p>

                                {message ? (
                                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 text-sm font-black flex items-center gap-2">
                                        <CheckCircle2 size={18} /> {message}
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleMigrate}
                                        disabled={migrating || !stats?.authenticated}
                                        className="w-full bg-white text-pink-500 font-black uppercase tracking-widest text-[11px] py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {migrating ? "Moving Data..." : "Migrate Everything 🚀"}
                                        {!migrating && <ArrowRight size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] pb-12 mt-4">
                    LoveSaver Diagnostic Suite v3.0
                </p>
            </div>
        </AppLayout>
    );
}
