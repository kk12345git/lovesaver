import { createClient, GUEST_USER_ID } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || GUEST_USER_ID;

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") || new Date().getMonth() + 1;
    const year = searchParams.get("year") || new Date().getFullYear();

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(Number(year), Number(month), 0).toISOString().split("T")[0];

    const { data, error } = await supabase
        .from("expense_entries")
        .select("*, expense_categories(id, name, icon, color)")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || GUEST_USER_ID;

    const body = await req.json();
    const { amount, category_id, date, notes } = body;

    if (!amount || !category_id || !date) {
        return NextResponse.json({ error: "Amount, category, and date are required" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("expense_entries")
        .insert({ user_id: userId, amount: Number(amount), category_id, date, notes: notes || null })
        .select("*, expense_categories(id, name, icon, color)")
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || GUEST_USER_ID;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const { error } = await supabase
        .from("expense_entries")
        .delete()
        .eq("id", id!)
        .eq("user_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
