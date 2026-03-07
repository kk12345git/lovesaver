"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Rocket, Coins, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const CURRENCIES = [
    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
];

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
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
            // 1. Update Profile
            await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    display_name: formData.display_name,
                    partner_name: formData.partner_name,
                    currency: formData.currency,
                    onboarding_completed: true
                })
            });

            // 2. Set Initial Budget
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

    return (
        <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] bg-pink-200 rounded-full blur-[120px] opacity-40 animate-pulse-slow" />
            <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-200 rounded-full blur-[120px] opacity-40 animate-pulse-slow" style={{ animationDelay: "2s" }} />

            <motion.div
                layout
                className="w-full max-w-md z-10"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass p-8 rounded-[3rem] border-white/60 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-pink-50 rounded-[1.5rem] flex items-center justify-center mb-8">
                                <Sparkles size={32} className="text-pink-400" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Welcome Home!</h2>
                            <p className="text-gray-500 font-medium mb-8">Let's start with the basics. What should we call you?</p>

                            <div className="space-y-6">
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
                                <div>
                                    <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Partner's Name (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Who are you saving with?"
                                        className="input"
                                        value={formData.partner_name}
                                        onChange={e => setFormData({ ...formData, partner_name: e.target.value })}
                                    />
                                </div>
                                <button
                                    disabled={!formData.display_name}
                                    onClick={nextStep}
                                    className="btn-primary w-full !py-5 mt-4 flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    Next Step
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass p-8 rounded-[3rem] border-white/60 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-purple-50 rounded-[1.5rem] flex items-center justify-center mb-8">
                                <Coins size={32} className="text-purple-400" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Your Currency</h2>
                            <p className="text-gray-500 font-medium mb-8">Which currency do you want to track your wealth in?</p>

                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {CURRENCIES.map(curr => (
                                    <button
                                        key={curr.code}
                                        onClick={() => setFormData({ ...formData, currency: curr.code })}
                                        className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-1 ${formData.currency === curr.code ? 'bg-pink-400 border-pink-400 text-white shadow-lg scale-105' : 'bg-white border-gray-50 text-gray-700 hover:border-pink-200'}`}
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

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass p-8 rounded-[3rem] border-white/60 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-green-50 rounded-[1.5rem] flex items-center justify-center mb-8">
                                <Rocket size={32} className="text-green-400" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Setting a Goal</h2>
                            <p className="text-gray-500 font-medium mb-8">How much do you plan to spend this month? (Optional)</p>

                            <div className="space-y-6 mb-8">
                                <div>
                                    <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Monthly Budget limit</label>
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
                                <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-500">Back</button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-[2] btn-primary !py-4 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Complete Setup <Check size={18} /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-pink-400' : 'w-2 bg-pink-100'}`}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
