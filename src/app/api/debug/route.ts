import { createSupabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = createSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();

        const stats: any = {
            status: "OK",
            authenticated: !!user,
            user_id: user?.id || null,
            env: {
                url_exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                url_value_starts_with_http: process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http'),
                key_exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                site_url: process.env.NEXT_PUBLIC_SITE_URL || "MISSING",
                vercel_url: process.env.NEXT_PUBLIC_VERCEL_URL || "MISSING",
                node_env: process.env.NODE_ENV
            },
            callback_sample: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lovesaver.vercel.app'}/auth/callback`,
            counts: {}
        };

        if (user) {
            // Try to get counts for all tables to verify schema
            const tables = ["expense_categories", "income_entries", "expense_entries", "budgets"];

            for (const table of tables) {
                try {
                    const { count, error } = await supabase
                        .from(table)
                        .select("*", { count: 'exact', head: true });

                    stats.counts[table] = error ? `Error: ${error.message}` : count;
                } catch (e: any) {
                    stats.counts[table] = `Loop Error: ${e.message}`;
                }
            }
        }

        return NextResponse.json(stats);
    } catch (error: any) {
        return NextResponse.json({
            status: "ERROR",
            message: error.message,
            stack: error.stack,
            env_snapshot: {
                url_exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                key_exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            }
        }, { status: 500 });
    }
}
