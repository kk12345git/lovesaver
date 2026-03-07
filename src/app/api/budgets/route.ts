import { createSupabaseServer } from "@/lib/supabase/server";
import { GUEST_USER_ID } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id || GUEST_USER_ID;

    const { data, error } = await supabase
        .from('budgets')
        .select(`
            *,
            categories (*)
        `)
        .eq('user_id', userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id || GUEST_USER_ID;
    const body = await request.json();

    const { data, error } = await supabase
        .from('budgets')
        .insert([{ ...body, user_id: userId }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function PUT(request: Request) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id || GUEST_USER_ID;
    const body = await request.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabase
        .from('budgets')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
