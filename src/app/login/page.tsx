"use client";

import { useState } from "react";
import { login } from "@/app/auth/actions";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError(null);
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF5F7] flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-pink-200 rounded-full blur-[100px] opacity-50 animate-pulse-slow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-200 rounded-full blur-[100px] opacity-50 animate-pulse-slow" style={{ animationDelay: "2s" }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-pink-200 mx-auto mb-6"
                    >
                        <span className="text-4xl">💖</span>
                    </motion.div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 font-medium mt-2">Continue saving for your dreams ✨</p>
                </div>

                {/* Form Card */}
                <div className="glass p-8 rounded-[2.5rem] border-white/40 shadow-2xl relative overflow-hidden">
                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="name@example.com"
                                className="input !bg-white/50 focus:!bg-white"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="input !bg-white/50 focus:!bg-white"
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-2xl border border-red-100"
                            >
                                ⚠️ {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full !py-5 shadow-xl shadow-pink-200 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Log In 🚀
                                    <span className="group-hover:translate-x-1 transition-transform">✨</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-bold text-gray-400">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-pink-500 hover:text-pink-600 transition-colors">
                                Create Account 💖
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Quote */}
                <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-12">
                    LoveSaver • Built with love for you
                </p>
            </motion.div>
        </div>
    );
}
