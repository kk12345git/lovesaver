"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { ExpenseCategory } from "@/lib/types";
import { Plus, Trash2, Tag, Palette, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCat, setNewCat] = useState({ name: "", icon: "✨", color: "#FF6FAE" });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async () => {
        if (!newCat.name) return;
        try {
            await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCat),
            });
            setNewCat({ name: "", icon: "✨", color: "#FF6FAE" });
            setShowAddModal(false);
            fetchCategories();
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm("Are you sure? This will remove the category from your list. Defaults cannot be deleted.")) return;
        try {
            const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.error) alert(data.error);
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const categoryColors = ["#FF6FAE", "#FF4DA6", "#98FB98", "#FFB347", "#87CEEB", "#DDA0DD", "#FFA07A", "#7B68EE"];
    const categoryIcons = ["💖", "🍕", "🚗", "🎬", "💄", "☕", "🛒", "⚡", "🏠", "✈️", "🎁", "💅", "💎", "🧸", "📚", "🧘"];

    return (
        <AppLayout title="Categories">
            <div className="flex flex-col gap-8 pt-4">
                {/* Header Section */}
                <div className="flex flex-col gap-2 px-1">
                    <h2 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">Management</h2>
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-black text-gray-800 tracking-tight">Pocket Files</h3>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm text-pink-500 hover:scale-110 active:scale-90 transition-all border border-pink-50"
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 gap-4 pb-12">
                    <AnimatePresence>
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -5 }}
                                className="card !p-5 relative group overflow-hidden border-none shadow-lg shadow-pink-100/30"
                            >
                                {/* Decorative background circle */}
                                <div
                                    className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10"
                                    style={{ backgroundColor: cat.color }}
                                />

                                <div className="relative z-10 flex flex-col gap-4">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white"
                                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                                    >
                                        {cat.icon}
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">{cat.name}</span>
                                        <span className="text-[8px] font-bold text-gray-300 uppercase mt-0.5">
                                            {cat.is_default ? "System Static" : "Custom Field"}
                                        </span>
                                    </div>

                                    {!cat.is_default && (
                                        <button
                                            onClick={() => deleteCategory(cat.id)}
                                            className="absolute top-0 right-0 p-2 text-gray-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create Category">
                        <div className="flex flex-col gap-6 pt-2">
                            <div>
                                <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Name</label>
                                <input
                                    type="text"
                                    className="input !py-4 font-black tracking-tight"
                                    placeholder="e.g. Skin Care, Hobby..."
                                    value={newCat.name}
                                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-3 block">Pick an Icon</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {categoryIcons.map(icon => (
                                        <button
                                            key={icon}
                                            onClick={() => setNewCat({ ...newCat, icon })}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all ${newCat.icon === icon ? 'bg-pink-400 shadow-lg scale-110' : 'bg-pink-50 hover:bg-pink-100'}`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-3 block">Theme Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {categoryColors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setNewCat({ ...newCat, color })}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${newCat.color === color ? 'border-pink-500 scale-125' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={addCategory}
                                disabled={!newCat.name}
                                className="btn-primary w-full !py-5 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Check size={20} />
                                <span className="font-black uppercase tracking-widest text-xs">Save Category</span>
                            </button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
