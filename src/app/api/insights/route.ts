import { createClient, GUEST_USER_ID } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { SpendingInsight, CategorySpending } from "@/lib/types";
import { getSavingsMessage } from "@/lib/utils";

export async function GET(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || GUEST_USER_ID;

    const { searchParams } = new URL(req.url);
    const month = Number(searchParams.get("month") || new Date().getMonth() + 1);
    const year = Number(searchParams.get("year") || new Date().getFullYear());
    const type = searchParams.get("type");

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    // Get data
    const { data: expenses } = await supabase
        .from("expense_entries")
        .select("*, expense_categories(id, name, icon, color)")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate);

    const { data: income } = await supabase
        .from("income_entries")
        .select("amount")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate);

    const { data: budget } = await supabase
        .from("budgets")
        .select("amount")
        .eq("user_id", userId)
        .eq("month", month)
        .eq("year", year)
        .single();

    const total_expenses = (expenses || []).reduce((s, e) => s + e.amount, 0);
    const total_income = (income || []).reduce((s, e) => s + e.amount, 0);
    const balance = total_income - total_expenses;
    const budget_amount = budget?.amount || 0;
    const budget_used_percent = budget_amount > 0 ? (total_expenses / budget_amount) * 100 : 0;
    const savings_percent = total_income > 0 ? (balance / total_income) * 100 : 0;

    // Category breakdown
    const categoryMap: Record<string, any> = {};
    for (const exp of expenses || []) {
        const cat = exp.expense_categories;
        if (!cat) continue;
        if (!categoryMap[cat.id]) {
            categoryMap[cat.id] = {
                category_id: cat.id,
                name: cat.name,
                icon: cat.icon,
                color: cat.color,
                amount: 0,
                percent: 0,
            };
        }
        categoryMap[cat.id].amount += exp.amount;
    }

    const category_spending = Object.values(categoryMap)
        .map((c) => ({
            ...c,
            percent: total_expenses > 0 ? (c.amount / total_expenses) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

    if (type === "insights") {
        const insights: SpendingInsight[] = [];
        const savingsMsg = getSavingsMessage(savings_percent);

        insights.push({
            type: balance >= 0 ? "positive" : "warning",
            message: savingsMsg,
            icon: balance >= 0 ? "💖" : "⚠️"
        });

        if (budget_amount > 0) {
            if (budget_used_percent > 90) {
                insights.push({
                    type: "warning",
                    message: "You've used over 90% of your budget! Time to be careful, love. 🛑",
                    icon: "🚨"
                });
            } else if (budget_used_percent > 70) {
                insights.push({
                    type: "warning",
                    message: "You're approaching your budget limit. Stay mindful! ✨",
                    icon: "💡"
                });
            }
        }

        if (category_spending.length > 0) {
            const top = category_spending[0];
            if (top.percent > 40) {
                insights.push({
                    type: "warning",
                    icon: "⚠️",
                    message: `You spent ${Math.round(top.percent)}% of your total expenses on ${top.name} this month. Consider setting a limit.`,
                });
            }
        }

        return NextResponse.json(insights);
    }

    return NextResponse.json({
        total_income,
        total_expenses,
        balance,
        budget_amount,
        budget_used_percent,
        savings_percent,
        category_spending
    });
}
