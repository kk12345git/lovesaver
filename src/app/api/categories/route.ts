import { createClient, GUEST_USER_ID } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Default expense categories to seed on first use
const DEFAULT_CATEGORIES = [
    { name: "Food & Dining", icon: "🍕", color: "#FF6FAE" },
    { name: "Shopping", icon: "🛍️", color: "#FF4DA6" },
    { name: "Transport", icon: "🚗", color: "#FF8C69" },
    { name: "Entertainment", icon: "🎬", color: "#FFB347" },
    { name: "Health", icon: "💊", color: "#98FB98" },
    { name: "Beauty", icon: "💄", color: "#FF69B4" },
    { name: "Coffee", icon: "☕", color: "#D2691E" },
    { name: "Groceries", icon: "🛒", color: "#32CD32" },
    { name: "Bills", icon: "⚡", color: "#FFD700" },
    { name: "Rent", icon: "🏠", color: "#87CEEB" },
    { name: "Travel", icon: "✈️", color: "#DDA0DD" },
    { name: "Gifts", icon: "🎁", color: "#FFA07A" },
    { name: "Makeup", icon: "💅", color: "#FF1493" },
    { name: "Other", icon: "💸", color: "#7B68EE" },
];

export async function GET(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || GUEST_USER_ID;

    // Get user + default categories
    const { data, error } = await supabase
        .from("expense_categories")
        .select("*")
        .or(`user_id.eq.${userId},is_default.eq.true`)
        .order("is_default", { ascending: false })
        .order("name");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || GUEST_USER_ID;

    const body = await req.json();
    const { name, icon, color } = body;

    if (!name || !icon || !color) {
        return NextResponse.json({ error: "Name, icon, and color are required" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("expense_categories")
        .insert({ user_id: userId, name, icon, color, is_default: false })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || GUEST_USER_ID;

    const body = await req.json();
    const { id, name, icon, color } = body;

    const { data, error } = await supabase
        .from("expense_categories")
        .update({ name, icon, color })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || GUEST_USER_ID;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const { error } = await supabase
        .from("expense_categories")
        .delete()
        .eq("id", id!)
        .eq("user_id", userId)
        .eq("is_default", false); // Can't delete default categories

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
