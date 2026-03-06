import { createClient, GUEST_USER_ID } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || GUEST_USER_ID;

    const { searchParams } = new URL(req.url);
    const month = Number(searchParams.get("month") || new Date().getMonth() + 1);
    const year = Number(searchParams.get("year") || new Date().getFullYear());

    const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", userId)
        .eq("month", month)
        .eq("year", year)
        .single();

    if (error && error.code !== "PGRST116") {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || null);
}

export async function POST(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || GUEST_USER_ID;

    const body = await req.json();
    const { amount, month, year } = body;

    if (!amount || !month || !year) {
        return NextResponse.json({ error: "Amount, month, and year are required" }, { status: 400 });
    }

    // Upsert budget (insert or update)
    const { data, error } = await supabase
        .from("budgets")
        .upsert(
            { user_id: userId, amount: Number(amount), month: Number(month), year: Number(year) },
            { onConflict: "user_id,month,year" }
        )
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
