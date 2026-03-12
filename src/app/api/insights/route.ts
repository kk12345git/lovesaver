import { createSupabaseServer } from "@/lib/supabase/server";
import { GUEST_USER_ID } from "@/lib/supabase/client";
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

    // Calculate date range for the month
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    // Calculate first day of next month to safely capture everything up to the end of current month
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

    // 1. Fetch user profile to check for partnership
    const { data: profile } = await supabase.from("profiles").select("mode, partner_id").eq("id", user.id).maybeSingle();
    const isCouple = profile?.mode === 'couple';
    const partnerId = profile?.partner_id;

    // Build the user IDs filter
    const userIds = [user.id];
    if (isCouple && partnerId) {
        userIds.push(partnerId);
    }

    // 2. Fetch all data for the user(s)/month
    const orFilter = `is_default.eq.true,user_id.eq.${user.id}${partnerId ? `,user_id.eq.${partnerId}` : ''}`;
    
    const [incomeRes, expenseRes, budgetRes, categoryRes] = await Promise.all([
        supabase.from("income_entries").select("amount").in("user_id", userIds).gte("date", startDate).lt("date", endDate),
        supabase.from("expense_entries").select("amount, category_id").in("user_id", userIds).gte("date", startDate).lt("date", endDate),
        supabase.from("budgets").select("amount").in("user_id", userIds).eq("month", month).eq("year", year),
        supabase.from("expense_categories").select("*").or(orFilter)
    ]);

    const income = incomeRes.data || [];
    const expenses = expenseRes.data || [];
    // If couple, we aggregate budgets or take the first one found for simplicity
    const budgets = budgetRes.data || [];
    const monthlyBudget = budgets.reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
    const categories = categoryRes.data || [];

    const totalIncome = income.reduce((sum: number, i: any) => sum + (i.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

    // 2. Calculate category breakdown (grouped by name to avoid duplicates)
    const categoryMap: Record<string, { amount: number, color: string, icon: string, id: string }> = {};
    
    categories.forEach((cat: any) => {
        const amount = expenses
            .filter((e: any) => e.category_id === cat.id)
            .reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
        
        if (amount > 0) {
            if (categoryMap[cat.name]) {
                categoryMap[cat.name].amount += amount;
            } else {
                categoryMap[cat.name] = {
                    amount,
                    color: cat.color,
                    icon: cat.icon,
                    id: cat.id
                };
            }
        }
    });

    const categorySpending: CategorySpending[] = Object.entries(categoryMap)
        .map(([name, data]) => ({
            category_id: data.id,
            name,
            amount: data.amount,
            color: data.color,
            icon: data.icon,
            percent: totalExpenses > 0 ? Math.round((data.amount / totalExpenses) * 100) : 0
        }))
        .sort((a: any, b: any) => b.amount - a.amount);

    // 3. Generate actionable insights
    const insights: SpendingInsight[] = [];
    const savings = calculateSavings(totalIncome, totalExpenses);
    const savingsPercent = calculateSavingsPercent(totalIncome, totalExpenses);
    const budgetUsedPercent = calculateBudgetUsedPercent(totalExpenses, monthlyBudget);

    // Days in month calculation
    const today = new Date();
    const isCurrentMonth = today.getMonth() + 1 === month && today.getFullYear() === year;
    const daysInMonth = new Date(year, month, 0).getDate();
    const currentDay = isCurrentMonth ? today.getDate() : daysInMonth;
    const remainingDays = daysInMonth - currentDay;

    // Daily Burn Rate
    const dailyBurnRate = currentDay > 0 ? Math.round(totalExpenses / currentDay) : 0;
    
    // Savings Forecast
    const estimatedExtraExpenses = dailyBurnRate * remainingDays;
    const projectedTotalExpenses = totalExpenses + estimatedExtraExpenses;
    const savingsForecast = totalIncome - projectedTotalExpenses;

    insights.push({
        type: savings >= 0 ? "success" : "warning",
        icon: savings >= 0 ? "💰" : "⚠️",
        message: getSavingsMessage(savingsPercent)
    });

    // 4. Advanced Insights
    
    // Discretionary vs Essential analysis
    const essentialCategories = ["Food", "Groceries", "Rent", "Utilities", "Bills", "Transport", "Commute", "Health", "Education", "Insurance"];
    const essentialSpent = categorySpending
        .filter(c => essentialCategories.some(e => c.name.toLowerCase().includes(e.toLowerCase())))
        .reduce((sum, c) => sum + c.amount, 0);
    
    const discretionarySpent = totalExpenses - essentialSpent;
    const discretionaryPercent = totalExpenses > 0 ? Math.round((discretionarySpent / totalExpenses) * 100) : 0;

    if (discretionaryPercent > 40) {
        insights.push({
            type: "warning",
            icon: "🎭",
            message: `Discretionary spending is high (${discretionaryPercent}%). Consider cutting back on non-essentials to boost savings.`
        });
    }

    // Forecast message
    if (isCurrentMonth && remainingDays > 0) {
        if (savingsForecast < 0) {
            insights.push({
                type: "warning",
                icon: "📉",
                message: `At your current rate of ${formatCurrency(dailyBurnRate)}/day, you might end the month with a ${formatCurrency(Math.abs(savingsForecast))} deficit.`
            });
        } else if (savingsForecast < totalIncome * 0.1) {
            insights.push({
                type: "tip",
                icon: "💡",
                message: `Track carefully! Your projected end-of-month savings is approx ${formatCurrency(savingsForecast)}.`
            });
        }
    }

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

    // Top spending category insight with contextual suggestions
    if (categorySpending.length > 0) {
        const topCat = categorySpending[0];
        let tip = `Your top spending is on ${topCat.name}. Try to look for ways to save here.`;
        
        const catName = topCat.name.toLowerCase();
        if (catName.includes("food") || catName.includes("dining")) {
            tip = `High ${topCat.name} spend detected. Suggestion: Try meal prepping or reducing weekend takeaways to save up to 30%.`;
        } else if (catName.includes("shopping") || catName.includes("amazon")) {
            tip = `Shopping is your top expense. Try the "24-hour rule"—wait a day before making non-essential purchases.`;
        } else if (catName.includes("transport") || catName.includes("fuel")) {
            tip = `Transport costs are high. Explore carpooling or public transit passes to reduce this monthly cost.`;
        } else if (catName.includes("subscription")) {
            tip = `Multiple subscriptions detected. Audit unused services to free up extra cash monthly.`;
        }

        insights.push({
            type: "tip",
            icon: "💡",
            message: tip
        });
    }

    return NextResponse.json({
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        balance: savings,
        budgetAmount: monthlyBudget,
        budgetUsedPercent: budgetUsedPercent,
        savingsPercent: savingsPercent,
        categorySpending: categorySpending,
        dailyBurnRate,
        discretionaryPercent,
        savingsForecast: isCurrentMonth ? savingsForecast : 0,
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
