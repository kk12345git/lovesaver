import { createSupabaseServer, GUEST_USER_ID } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST() {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Migrate all tables from GUEST_USER_ID to userId
    const results: any = {};

    // 1. Categories
    const catRes = await supabase
        .from("expense_categories")
        .update({ user_id: userId })
        .eq("user_id", GUEST_USER_ID);
    results.categories = catRes.error ? catRes.error.message : "Success";

    // 2. Income
    const incRes = await supabase
        .from("income_entries")
        .update({ user_id: userId })
        .eq("user_id", GUEST_USER_ID);
    results.income = incRes.error ? incRes.error.message : "Success";

    // 3. Expenses
    const expRes = await supabase
        .from("expense_entries")
        .update({ user_id: userId })
        .eq("user_id", GUEST_USER_ID);
    results.expenses = expRes.error ? expRes.error.message : "Success";

    // 4. Budgets
    const budRes = await supabase
        .from("budgets")
        .update({ user_id: userId })
        .eq("user_id", GUEST_USER_ID);
    results.budgets = budRes.error ? budRes.error.message : "Success";

    return NextResponse.json({ message: "Migration complete", results });
}
