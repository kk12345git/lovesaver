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
    const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", icon: "✨", color: "#FF6FAE" });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddExpenseInput>({
        defaultValues: { date: getTodayISO() },
    });

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
            if (data.length > 0 && !selectedCategoryId) {
                setSelectedCategoryId(data[0].id);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateCategory = async () => {
        if (!newCategory.name) return;
        try {
            setLoading(true);
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCategory),
            });
            const data = await res.json();
            if (data.id) {
                const refreshedRes = await fetch("/api/categories");
                const refreshedData = await refreshedRes.json();
                setCategories(refreshedData);
                setSelectedCategoryId(data.id);
                setShowNewCategoryForm(false);
                setNewCategory({ name: "", icon: "✨", color: "#FF6FAE" });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

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
        <Modal isOpen={isOpen} onClose={onClose} title={showNewCategoryForm ? "New Category ✨" : "Add Expense 💸"}>
            {showNewCategoryForm ? (
                <div className="space-y-6 pt-2">
                    <div>
                        <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Name</label>
                        <input
                            type="text"
                            className="input !text-lg font-black"
                            placeholder="e.g. Skin Care"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-3 block">Icon</label>
                        <div className="grid grid-cols-6 gap-2">
                            {["💄", "🍣", "💅", "💆‍♀️", "💍", "👜", "🎁", "☕"].map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setNewCategory({ ...newCategory, icon })}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all ${newCategory.icon === icon ? 'bg-pink-400 shadow-lg scale-110' : 'bg-pink-50'}`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setShowNewCategoryForm(false)} className="btn-secondary flex-1 !py-4 text-xs font-black uppercase tracking-widest text-center flex items-center justify-center border border-gray-200 rounded-2xl">Cancel</button>
                        <button type="button" onClick={handleCreateCategory} disabled={loading || !newCategory.name} className="btn-primary flex-1 !py-4 text-xs font-black uppercase tracking-widest">Create</button>
                    </div>
                </div>
            ) : (
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
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedCategoryId(cat.id)}
                                    className={`flex flex-col items-center justify-center gap-1 p-2 sm:p-3 rounded-2xl transition-all ${selectedCategoryId === cat.id
                                        ? "bg-pink-400 text-white shadow-lg shadow-pink-200 scale-105"
                                        : "bg-white text-gray-400 border border-gray-100 hover:border-pink-200"
                                        }`}
                                >
                                    <span className="text-lg sm:text-xl">{cat.icon}</span>
                                    <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-tight truncate w-full text-center">{cat.name}</span>
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setShowNewCategoryForm(true)}
                                className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border-2 border-dashed border-pink-100 text-pink-400 hover:bg-pink-50 transition-all"
                            >
                                <span className="text-xl">+</span>
                                <span className="text-[8px] font-black uppercase tracking-tight">New</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                        {/* Date */}
                        <div className="flex-1">
                            <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Date</label>
                            <input
                                type="date"
                                className="input !py-3 !text-sm font-bold w-full"
                                {...register("date", { required: "Date is required" })}
                            />
                        </div>

                        {/* Notes */}
                        <div className="flex-1">
                            <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Notes</label>
                            <input
                                type="text"
                                className="input !py-3 !text-sm font-bold w-full"
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
            )}
        </Modal>
    );
}
