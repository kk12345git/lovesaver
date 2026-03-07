import { createSupabaseServer } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = createSupabaseServer();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocalEnv = process.env.NODE_ENV === "development";
            const targetUrl = next.startsWith('/') ? next : `/${next}`;

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${targetUrl}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${targetUrl}`);
            } else {
                return NextResponse.redirect(`${origin}${targetUrl}`);
            }
        } else {
            console.error("AUTH CALLBACK ERROR:", error);
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
        }
    }

    return NextResponse.redirect(`${origin}/login?error=No%20auth%20code%20received`);
}
