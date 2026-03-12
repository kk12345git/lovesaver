import { createSupabaseServer } from "@/lib/supabase/server";
import { GUEST_USER_ID } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id || GUEST_USER_ID;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json({
            id: userId,
            full_name: "Luxe Explorer",
            mode: "individual",
            currency: "INR",
            onboarding_completed: false
        });
    }

    if (!data) {
        return NextResponse.json({
            id: userId,
            full_name: "Luxe Explorer",
            mode: "individual",
            currency: "INR",
            onboarding_completed: false
        });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...body })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
