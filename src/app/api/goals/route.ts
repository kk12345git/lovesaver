import { createSupabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, icon, target_amount, current_amount, deadline } = body;

    if (!name || !target_amount) {
        return NextResponse.json({ error: "Name and target amount are required" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("savings_goals")
        .insert({
            user_id: user.id,
            name,
            icon: icon || "🎯",
            target_amount: Number(target_amount),
            current_amount: Number(current_amount || 0),
            deadline: deadline || null
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, current_amount, name, target_amount, deadline } = body;
    if (!id) return NextResponse.json({ error: "Goal ID required" }, { status: 400 });

    const { data, error } = await supabase
        .from("savings_goals")
        .update({ current_amount, name, target_amount, deadline })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Goal ID required" }, { status: 400 });

    const { error } = await supabase
        .from("savings_goals")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
