"use client";

import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency, getCurrentMonth, getCurrentYear, getMonthName } from "@/lib/utils";
import { SpendingInsight, CategorySpending } from "@/lib/types";

interface InsightsData {
    insights: SpendingInsight[];
    categorySpending: CategorySpending[];
    totalExpenses: number;
    totalIncome: number;
    monthlyBudget: number;
}

const insightBg: Record<string, string> = {
    warning: "bg-orange-50 border-orange-200",
    tip: "bg-pink-50 border-pink-200",
    success: "bg-green-50 border-green-200",
};

export default function InsightsPage() {
    const [month] = useState(getCurrentMonth());
    const [year] = useState(getCurrentYear());
    const [data, setData] = useState<InsightsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchInsights = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/insights?month=${month}&year=${year}`);
            const json = await res.json();
            if (!json.error) setData(json);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [month, year]);

    useEffect(() => { fetchInsights(); }, [fetchInsights]);

    return (
        <AppLayout>
            <div className="px-5 pt-12 pb-6 bg-gradient-to-br from-yellow-400 to-pink-400 text-white">
                <p className="text-sm font-semibold opacity-80">{getMonthName(month)} {year}</p>
                <h1 className="text-2xl font-black">Smart Insights 💡</h1>
                <p className="text-sm opacity-80 mt-1">Personalized tips based on your spending</p>
            </div>

            <div className="px-4 mt-4 space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Analyzing your finances...</div>
                ) : (
                    <>
                        {/* Insights */}
                        <div className="space-y-3">
                            {data?.insights.map((insight, i) => (
                                <div
                                    key={i}
                                    className={`card border ${insightBg[insight.type] || "bg-pink-50 border-pink-200"}`}
                                >
                                    <div className="flex gap-3 items-start">
                                        <span className="text-2xl">{insight.icon}</span>
                                        <p className="text-sm font-semibold text-gray-700 leading-relaxed">{insight.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Category spending breakdown */}
                        {data?.categorySpending && data.categorySpending.length > 0 && (
                            <div className="card">
                                <h3 className="font-bold text-gray-700 mb-3">Category Breakdown</h3>
                                <div className="space-y-3">
                                    {data.categorySpending.map((cat) => (
                                        <div key={cat.category_id}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">{cat.icon}</span>
                                                    <span className="text-sm font-semibold text-gray-700">{cat.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-gray-500">{cat.percent}%</span>
                                                    <span className="text-sm font-black" style={{ color: cat.color }}>
                                                        {formatCurrency(cat.total)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full transition-all duration-700"
                                                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Monthly summary */}
                        {data && (
                            <div className="card bg-gradient-to-br from-pink-50 to-purple-50">
                                <h3 className="font-bold text-gray-700 mb-3">📊 Month Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Income</span>
                                        <span className="font-black text-green-600">{formatCurrency(data.totalIncome)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Expenses</span>
                                        <span className="font-black text-pink-500">{formatCurrency(data.totalExpenses)}</span>
                                    </div>
                                    {data.monthlyBudget > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Budget</span>
                                            <span className="font-black text-purple-500">{formatCurrency(data.monthlyBudget)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-pink-100 pt-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-bold text-gray-700">Net Savings</span>
                                            <span className={`font-black text-lg ${data.totalIncome >= data.totalExpenses ? "text-green-600" : "text-red-500"}`}>
                                                {formatCurrency(Math.abs(data.totalIncome - data.totalExpenses))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reminder box */}
                        <div className="card border border-pink-200 bg-pink-50">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🔔</span>
                                <div>
                                    <p className="text-sm font-bold text-pink-600">Daily Reminder</p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Log your expenses every day to get the most accurate insights and help build better financial habits! 💕
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
