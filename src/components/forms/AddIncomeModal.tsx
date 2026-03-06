"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import { INCOME_CATEGORIES } from "@/lib/utils";
import { AddIncomeInput } from "@/lib/types";
import { getTodayISO } from "@/lib/utils";

interface AddIncomeModalProps {
    isOpen?: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddIncomeModal({ isOpen = true, onClose, onSuccess }: AddIncomeModalProps) {
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Salary");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddIncomeInput>({
        defaultValues: { date: getTodayISO() },
    });

    const onSubmit = async (data: AddIncomeInput) => {
        setLoading(true);
        try {
            const res = await fetch("/api/income", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, category: selectedCategory }),
            });
            if (!res.ok) throw new Error("Failed to add income");
            reset();
            onSuccess?.();
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Income 💰">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
                {/* Amount */}
                <div>
                    <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Amount (₹)</label>
                    <input
                        type="number"
                        className="input !text-2xl font-black focus:scale-[1.02] transition-transform"
                        placeholder="0.00"
                        autoFocus
                        {...register("amount", {
                            required: "Amount is required",
                            min: { value: 1, message: "Must be greater than 0" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.amount && (
                        <p className="text-pink-500 text-[10px] font-bold mt-1 ml-1">{errors.amount.message}</p>
                    )}
                </div>

                {/* Category Selector */}
                <div>
                    <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-3 block">Source</label>
                    <div className="grid grid-cols-2 gap-2">
                        {INCOME_CATEGORIES.map((cat) => (
                            <button
                                key={cat.label}
                                type="button"
                                onClick={() => setSelectedCategory(cat.label)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-black transition-all ${selectedCategory === cat.label
                                    ? "bg-pink-400 text-white shadow-lg shadow-pink-200 scale-[1.02]"
                                    : "bg-white text-gray-400 border border-gray-100 hover:border-pink-200 hover:text-pink-400"
                                    }`}
                            >
                                <span className="text-lg">{cat.icon}</span>
                                <span className="uppercase tracking-tight">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                        <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Date</label>
                        <input
                            type="date"
                            className="input !py-3 !text-sm font-bold"
                            {...register("date", { required: "Date is required" })}
                        />
                    </div>

                    {/* Notes */}
                    <div className="col-span-1">
                        <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Notes</label>
                        <input
                            type="text"
                            className="input !py-3 !text-sm font-bold"
                            placeholder="Optional..."
                            {...register("notes")}
                        />
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" className="btn-primary w-full !py-5 shadow-xl shadow-pink-200" disabled={loading}>
                    {loading ? "Saving..." : "Add Income 💖"}
                </button>
            </form>
        </Modal>
    );
}
