import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

// Client for Browser components
export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase environment variables are missing!");
    }

    return createBrowserClient(
        supabaseUrl!,
        supabaseKey!
    );
}

// Helper to get the current site URL for redirects
export function getURL() {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env vars
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
        'http://localhost:3000/';
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url;
}

// Client for Server Actions, API Routes, and Middleware
export function createSupabaseServer() {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return createServerClient(
        supabaseUrl!,
        supabaseKey!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options as any)
                        );
                    } catch (error) {
                        // This can be ignored if you have middleware refreshing user sessions.
                    }
                },
            },
        }
    );
}
