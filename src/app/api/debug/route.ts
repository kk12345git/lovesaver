import { createSupabaseServer } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    const stats: any = {
        authenticated: !!user,
        user_id: user?.id || null,
        env: {
            url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            site_url: process.env.NEXT_PUBLIC_SITE_URL || "MISSING",
            vercel_url: process.env.NEXT_PUBLIC_VERCEL_URL || "MISSING"
        },
        callback_sample: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lovesaver.vercel.app'}/auth/callback`,
        counts: {}
    };

    if (user) {
        // Try to get counts for all tables to verify schema
        const tables = ["expense_categories", "income_entries", "expense_entries", "budgets"];

        for (const table of tables) {
            const { count, error } = await supabase
                .from(table)
                .select("*", { count: 'exact', head: true });

            stats.counts[table] = error ? `Error: ${error.message}` : count;
        }
    }

    return NextResponse.json(stats);
}
