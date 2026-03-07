import { createSupabaseServer } from "@/lib/supabase/server";
import { GUEST_USER_ID } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    // Only allow for the current user or guest
    const userId = user?.id || GUEST_USER_ID;

    // This is a simple migration helper to move guest data to a real user
    // In a real app, this would be more secure
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');

    if (!targetUserId) {
        return NextResponse.json({ error: "Target userId is required" }, { status: 400 });
    }

    try {
        // Migrate Expenses
        await supabase
            .from('expenses')
            .update({ user_id: targetUserId })
            .eq('user_id', GUEST_USER_ID);

        // Migrate Income
        await supabase
            .from('income')
            .update({ user_id: targetUserId })
            .eq('user_id', GUEST_USER_ID);

        // Migrate Budgets
        await supabase
            .from('budgets')
            .update({ user_id: targetUserId })
            .eq('user_id', GUEST_USER_ID);

        return NextResponse.json({ success: true, message: "Migration complete!" });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
