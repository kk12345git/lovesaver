"use client";

import { useState, useEffect, Suspense } from "react";
import { signup } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SignupContent() {
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }
    }, [searchParams]);

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError(null);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
            // Browser will redirect
        } catch (err: any) {
            setError(err.message || "Failed to connect to Google");
            setGoogleLoading(false);
        }
    };

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

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-2xl border border-red-100"
                            >
                                ⚠️ {error}
                            </motion.p>
                        )}

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
                                disabled={loading || googleLoading}
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

                    {!success && (
                        <>
                            <div className="my-6 flex items-center gap-4">
                                <div className="h-[1px] bg-gray-200 flex-1" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OR</span>
                                <div className="h-[1px] bg-gray-200 flex-1" />
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading || googleLoading}
                                className="w-full py-4 rounded-2xl border-2 border-pink-50 bg-white hover:bg-pink-50 text-gray-700 font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50"
                            >
                                {googleLoading ? (
                                    <div className="w-4 h-4 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                    </svg>
                                )}
                                {googleLoading ? "Connecting..." : "Signup with Google"}
                            </button>
                        </>
                    )}

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

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center"><div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" /></div>}>
            <SignupContent />
        </Suspense>
    );
}
