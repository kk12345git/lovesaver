"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import { ExpenseCategory, AddExpenseInput } from "@/lib/types";
import { getTodayISO } from "@/lib/utils";

interface AddExpenseModalProps {
    isOpen?: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddExpenseModal({ isOpen = true, onClose, onSuccess }: AddExpenseModalProps) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddExpenseInput>({
        defaultValues: { date: getTodayISO() },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                setCategories(data);
                if (data.length > 0) setSelectedCategoryId(data[0].id);
            } catch (e) {
                console.error(e);
            }
        };
        fetchCategories();
    }, []);

    const onSubmit = async (data: AddExpenseInput) => {
        if (!selectedCategoryId) return;
        setLoading(true);
        try {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, category_id: selectedCategoryId }),
            });
            if (!res.ok) throw new Error("Failed to add expense");
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
        <Modal isOpen={isOpen} onClose={onClose} title="Add Expense 💸">
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
                            min: { value: 0.01, message: "Must be greater than 0" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.amount && (
                        <p className="text-pink-500 text-[10px] font-bold mt-1 ml-1">{errors.amount.message}</p>
                    )}
                </div>

                {/* Category Selection */}
                <div>
                    <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-3 block">Category</label>
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategoryId(cat.id)}
                                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-2xl transition-all ${selectedCategoryId === cat.id
                                    ? "bg-pink-400 text-white shadow-lg shadow-pink-200 scale-105"
                                    : "bg-white text-gray-400 border border-gray-100 hover:border-pink-200"
                                    }`}
                            >
                                <span className="text-xl">{cat.icon}</span>
                                <span className="text-[8px] font-black uppercase tracking-tight truncate w-full text-center">{cat.name}</span>
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
                    <div>
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
                    {loading ? "Saving..." : "Add Expense 💖"}
                </button>
            </form>
        </Modal>
    );
}
