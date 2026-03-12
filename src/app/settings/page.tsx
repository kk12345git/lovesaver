"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { User, Heart, Coins, Shield, LogOut, ChevronRight, Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { logout } from "@/app/auth/actions";

const CURRENCIES = [
    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
];

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile");
            const data = await res.json();
            setProfile(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile)
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (e) {
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <AppLayout title="Settings">
            <div className="flex flex-col gap-6 animate-pulse pt-6">
                <div className="h-32 bg-gray-100 rounded-3xl" />
                <div className="h-64 bg-gray-100 rounded-3xl" />
            </div>
        </AppLayout>
    );

    return (
        <AppLayout title="Settings">
            <div className="flex flex-col gap-8 pb-32 pt-4">
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-4 px-1">
                    <div className="w-24 h-24 bg-pink-100 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-xl shadow-pink-100 border-4 border-white">
                        💖
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-black text-gray-800">{profile?.display_name || "Premium User"}</h3>
                        <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mt-1">Daily Saver Status</p>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                    {/* Basic Info */}
                    <div className="card !p-8 flex flex-col gap-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <User size={14} /> Personal Details
                        </h4>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Display Name</label>
                                <input
                                    type="text"
                                    className="input !py-4"
                                    value={profile?.display_name || ""}
                                    onChange={e => setProfile({ ...profile, display_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Partner Name</label>
                                <input
                                    type="text"
                                    className="input !py-4"
                                    value={profile?.partner_name || ""}
                                    onChange={e => setProfile({ ...profile, partner_name: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sync & Connectivity Section */}
                    <div className="card !p-8 flex flex-col gap-6 !bg-white/60 backdrop-blur-2xl border-white">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                             <Zap size={14} className="text-pink-400" /> LifeStyle Sync
                        </h4>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Private ID</span>
                                    <p className="text-xs font-bold text-gray-600 truncate max-w-[150px]">{profile?.id?.substring(0, 12)}...</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(profile?.id)}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-700 transition-colors shadow-lg shadow-gray-200"
                                >
                                    Copy
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1">Partner Email / ID</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Enter partner's email..." 
                                        className="flex-1 bg-white border-gray-100 p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-400 transition-all outline-none"
                                    />
                                    <button 
                                        type="button"
                                        className="px-6 py-4 bg-gradient-to-tr from-pink-500 to-rose-400 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-pink-200 hover:scale-105 transition-transform"
                                    >
                                        Link
                                    </button>
                                </div>
                                <p className="text-[10px] font-medium text-gray-400 mt-1 italic px-1">
                                    * Linking will share your expense tracking and goal progress in real-time.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Currency */}
                    <div className="card !p-8 flex flex-col gap-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Coins size={14} /> App Preferences
                        </h4>

                        <div>
                            <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-4 block">Primary Currency</label>
                            <div className="grid grid-cols-2 gap-3">
                                {CURRENCIES.map(curr => (
                                    <button
                                        key={curr.code}
                                        type="button"
                                        onClick={() => setProfile({ ...profile, currency: curr.code })}
                                        className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${profile?.currency === curr.code ? 'bg-pink-400 border-pink-400 text-white shadow-lg' : 'bg-white border-gray-50 text-gray-700 hover:border-pink-200'}`}
                                    >
                                        <span className="text-xl font-black">{curr.symbol}</span>
                                        <span className="text-[11px] font-black uppercase tracking-tight">{curr.code}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-1 space-y-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary w-full !py-5 shadow-xl shadow-pink-100 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : success ? (
                                <><Check size={20} /> Settings Saved</>
                            ) : (
                                "Update Profile ✨"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => logout()}
                            className="w-full py-4 bg-white border-2 border-red-50 text-red-400 font-black text-[11px] uppercase tracking-[0.2em] rounded-[2rem] hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} /> Sign Out Securely
                        </button>
                    </div>
                </form>

                {/* Footer Credits */}
                <div className="mt-8 text-center space-y-2 opacity-50">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">LoveSaver v3.1</p>
                    <p className="text-[9px] font-bold text-gray-300">Your secure financial sanctuary</p>
                </div>
            </div>
        </AppLayout>
    );
}
