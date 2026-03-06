import { createSupabaseServer } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentMonth, getCurrentYear, calculateSavings, calculateSavingsPercent, calculateBudgetUsedPercent, getSavingsMessage } from "@/lib/utils";
import { SpendingInsight, CategorySpending } from "@/lib/types";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || getCurrentMonth().toString());
    const year = parseInt(searchParams.get("year") || getCurrentYear().toString());

    // 1. Fetch all data for the user/month
    const [incomeRes, expenseRes, budgetRes, categoryRes] = await Promise.all([
        supabase.from("income_entries").select("amount").eq("user_id", user.id).gte("date", `${year}-${String(month).padStart(2, "0")}-01`).lte("date", `${year}-${String(month).padStart(2, "0")}-31`),
        supabase.from("expense_entries").select("amount, category_id").eq("user_id", user.id).gte("date", `${year}-${String(month).padStart(2, "0")}-01`).lte("date", `${year}-${String(month).padStart(2, "0")}-31`),
        supabase.from("budgets").select("amount").eq("user_id", user.id).eq("month", month).eq("year", year).maybeSingle(),
        supabase.from("expense_categories").select("*").or(`user_id.eq.${user.id},is_default.eq.true`)
    ]);

    const income = incomeRes.data || [];
    const expenses = expenseRes.data || [];
    const budget = budgetRes.data;
    const categories = categoryRes.data || [];

    const totalIncome = income.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const monthlyBudget = budget?.amount || 0;

    // 2. Calculate category breakdown
    const categorySpending: CategorySpending[] = categories
        .map(cat => {
            const amount = expenses
                .filter(e => e.category_id === cat.id)
                .reduce((sum, e) => sum + (e.amount || 0), 0);
            return {
                category_id: cat.id,
                name: cat.name,
                color: cat.color,
                icon: cat.icon,
                amount,
                percent: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
            };
        })
        .filter(c => c.amount > 0)
        .sort((a, b) => b.amount - a.amount);

    // 3. Generate actionable insights
    const insights: SpendingInsight[] = [];
    const savings = calculateSavings(totalIncome, totalExpenses);
    const savingsPercent = calculateSavingsPercent(totalIncome, totalExpenses);
    const budgetUsedPercent = calculateBudgetUsedPercent(totalExpenses, monthlyBudget);

    insights.push({
        type: savings >= 0 ? "success" : "warning",
        icon: savings >= 0 ? "💰" : "⚠️",
        message: getSavingsMessage(savingsPercent)
    });

    if (monthlyBudget > 0) {
        if (budgetUsedPercent >= 100) {
            insights.push({
                type: "warning",
                icon: "🛑",
                message: `You've exceeded your monthly budget by ${formatCurrency(totalExpenses - monthlyBudget)}.`
            });
        } else if (budgetUsedPercent > 80) {
            insights.push({
                type: "warning",
                icon: "🔔",
                message: `Careful! You've used ${budgetUsedPercent}% of your monthly budget.`
            });
        }
    }

    // Top spending category insight
    if (categorySpending.length > 0) {
        insights.push({
            type: "tip",
            icon: "💡",
            message: `Your top spending is on ${categorySpending[0].name}. Try to look for ways to save here.`
        });
    }

    return NextResponse.json({
        totalIncome,
        totalExpenses,
        monthlyBudget,
        categorySpending,
        insights
    });
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}
