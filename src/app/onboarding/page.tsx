"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Rocket, Coins, ArrowRight, Check, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const CURRENCIES = [
    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
];

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        mode: "" as "single" | "couple" | "",
        display_name: "",
        partner_name: "",
        currency: "INR",
        monthly_budget: ""
    });
    const router = useRouter();

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    display_name: formData.display_name,
                    partner_name: formData.mode === "couple" ? formData.partner_name : null,
                    currency: formData.currency,
                    mode: formData.mode,
                    onboarding_completed: true
                })
            });

            if (formData.monthly_budget) {
                await fetch("/api/budgets", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: Number(formData.monthly_budget),
                        month: new Date().getMonth() + 1,
                        year: new Date().getFullYear()
                    })
                });
            }

            router.push("/dashboard");
            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const cardVariants = {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 }
    };

    return (
        <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] bg-pink-200 rounded-full blur-[120px] opacity-40 animate-pulse-slow" />
            <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-200 rounded-full blur-[120px] opacity-40 animate-pulse-slow" style={{ animationDelay: "2s" }} />

            <motion.div layout className="w-full max-w-md z-10">
                <AnimatePresence mode="wait">

                    {/* ─── STEP 1: Single or Couple? ─── */}
                    {step === 1 && (
                        <motion.div key="step1" variants={cardVariants} initial="initial" animate="animate" exit="exit"
                            className="glass p-8 rounded-[3rem] border-white/60 shadow-2xl">
                            <div className="text-center mb-8">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className="text-5xl mb-4"
                                >
                                    💖
                                </motion.div>
                                <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Welcome to LoveSaver!</h2>
                                <p className="text-gray-500 font-medium">First things first — are you saving solo or as a couple?</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {/* Solo Card */}
                                <button
                                    onClick={() => setFormData({ ...formData, mode: "single" })}
                                    className={`relative p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 text-center ${formData.mode === "single"
                                        ? "bg-gradient-to-br from-pink-400 to-rose-500 border-pink-400 text-white shadow-xl scale-105"
                                        : "bg-white border-gray-100 text-gray-700 hover:border-pink-200 hover:shadow-md"
                                        }`}
                                >
                                    {formData.mode === "single" && (
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    )}
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.mode === "single" ? "bg-white/20" : "bg-pink-50"}`}>
                                        <User size={24} className={formData.mode === "single" ? "text-white" : "text-pink-400"} />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">Solo Saver</p>
                                        <p className={`text-xs mt-1 ${formData.mode === "single" ? "text-white/70" : "text-gray-400"}`}>Just me &amp; my goals</p>
                                    </div>
                                </button>

                                {/* Couple Card */}
                                <button
                                    onClick={() => setFormData({ ...formData, mode: "couple" })}
                                    className={`relative p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 text-center ${formData.mode === "couple"
                                        ? "bg-gradient-to-br from-purple-400 to-pink-500 border-purple-400 text-white shadow-xl scale-105"
                                        : "bg-white border-gray-100 text-gray-700 hover:border-purple-200 hover:shadow-md"
                                        }`}
                                >
                                    {formData.mode === "couple" && (
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    )}
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.mode === "couple" ? "bg-white/20" : "bg-purple-50"}`}>
                                        <Users size={24} className={formData.mode === "couple" ? "text-white" : "text-purple-400"} />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">Couple Mode</p>
                                        <p className={`text-xs mt-1 ${formData.mode === "couple" ? "text-white/70" : "text-gray-400"}`}>Saving together 💑</p>
                                    </div>
                                </button>
                            </div>

                            <button
                                disabled={!formData.mode}
                                onClick={nextStep}
                                className="btn-primary w-full !py-5 flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {formData.mode === "couple" ? "Let's save together!" : formData.mode === "single" ? "Let's go!" : "Pick a mode first"}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* ─── STEP 2: Name(s) ─── */}
                    {step === 2 && (
                        <motion.div key="step2" variants={cardVariants} initial="initial" animate="animate" exit="exit"
                            className="glass p-8 rounded-[3rem] border-white/60 shadow-2xl">
                            <div className="w-16 h-16 bg-pink-50 rounded-[1.5rem] flex items-center justify-center mb-6">
                                {formData.mode === "couple" ? <Heart size={32} className="text-pink-400" /> : <Sparkles size={32} className="text-pink-400" />}
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-2">
                                {formData.mode === "couple" ? "Who's saving together?" : "What's your name?"}
                            </h2>
                            <p className="text-gray-500 font-medium mb-8">
                                {formData.mode === "couple" ? "Tell us about the duo! 💑" : "Let's personalise your experience!"}
                            </p>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="input"
                                        value={formData.display_name}
                                        onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                                    />
                                </div>

                                {formData.mode === "couple" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1 mb-2 block">
                                            Partner's Name 💜
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Who are you saving with?"
                                            className="input border-purple-100 focus:border-purple-300"
                                            value={formData.partner_name}
                                            onChange={e => setFormData({ ...formData, partner_name: e.target.value })}
                                        />
                                    </motion.div>
                                )}

                                <div className="flex gap-4 pt-2">
                                    <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-colors">Back</button>
                                    <button
                                        disabled={!formData.display_name || (formData.mode === "couple" && !formData.partner_name)}
                                        onClick={nextStep}
                                        className="flex-[2] btn-primary !py-4 flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── STEP 3: Currency ─── */}
                    {step === 3 && (
                        <motion.div key="step3" variants={cardVariants} initial="initial" animate="animate" exit="exit"
                            className="glass p-8 rounded-[3rem] border-white/60 shadow-2xl">
                            <div className="w-16 h-16 bg-purple-50 rounded-[1.5rem] flex items-center justify-center mb-6">
                                <Coins size={32} className="text-purple-400" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Your Currency</h2>
                            <p className="text-gray-500 font-medium mb-8">Which currency do you track in?</p>

                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {CURRENCIES.map(curr => (
                                    <button
                                        key={curr.code}
                                        onClick={() => setFormData({ ...formData, currency: curr.code })}
                                        className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-1 ${formData.currency === curr.code
                                            ? 'bg-pink-400 border-pink-400 text-white shadow-lg scale-105'
                                            : 'bg-white border-gray-100 text-gray-700 hover:border-pink-200'
                                            }`}
                                    >
                                        <span className="text-2xl font-black">{curr.symbol}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{curr.code}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-colors">Back</button>
                                <button onClick={nextStep} className="flex-[2] btn-primary !py-4 font-black">Continue 🚀</button>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── STEP 4: Budget ─── */}
                    {step === 4 && (
                        <motion.div key="step4" variants={cardVariants} initial="initial" animate="animate" exit="exit"
                            className="glass p-8 rounded-[3rem] border-white/60 shadow-2xl">
                            <div className="w-16 h-16 bg-green-50 rounded-[1.5rem] flex items-center justify-center mb-6">
                                <Rocket size={32} className="text-green-400" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Set a Budget</h2>
                            <p className="text-gray-500 font-medium mb-8">
                                {formData.mode === "couple"
                                    ? `How much will ${formData.display_name} & ${formData.partner_name} spend this month?`
                                    : "How much do you plan to spend this month?"}
                                <span className="text-gray-400 text-sm block mt-1">(Optional — you can set this later)</span>
                            </p>

                            <div className="space-y-6 mb-8">
                                <div>
                                    <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Monthly Budget Limit</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">
                                            {CURRENCIES.find(c => c.code === formData.currency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="input !pl-12 !text-3xl font-black"
                                            value={formData.monthly_budget}
                                            onChange={e => setFormData({ ...formData, monthly_budget: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-colors">Back</button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-[2] btn-primary !py-4 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Let's Go! <Check size={18} /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === step ? 'w-8 bg-pink-400' : i + 1 < step ? 'w-4 bg-pink-300' : 'w-2 bg-pink-100'}`}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
