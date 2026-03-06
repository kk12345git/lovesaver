"use client";

import { useState } from "react";
import { signup } from "@/app/auth/actions";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        const result = await signup(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else if (result?.message) {
            setSuccess(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF5F7] flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-pink-200 rounded-full blur-[100px] opacity-50 animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-200 rounded-full blur-[100px] opacity-50 animate-pulse-slow" style={{ animationDelay: "2s" }} />

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
                        <span className="text-4xl">💎</span>
                    </motion.div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Create Account</h1>
                    <p className="text-gray-500 font-medium mt-2">Start your premium financial journey 🚀</p>
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

                        {success && (
                            <motion.p
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-pink-600 text-xs font-bold text-center bg-pink-50 py-4 px-6 rounded-2xl border border-pink-100"
                            >
                                {success}
                            </motion.p>
                        )}

                        {!success && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full !py-5 shadow-xl shadow-pink-200 flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Join the Club 💖
                                        <span className="group-hover:translate-x-1 transition-transform">💎</span>
                                    </>
                                )}
                            </button>
                        )}
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-bold text-gray-400">
                            Already have an account?{" "}
                            <Link href="/login" className="text-pink-500 hover:text-pink-600 transition-colors">
                                Log In 🚀
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Quote */}
                <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-12">
                    LoveSaver • Secure & Beautiful
                </p>
            </motion.div>
        </div>
    );
}
