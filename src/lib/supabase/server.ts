import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createSupabaseServer() {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        const errorMsg = "Supabase server-side environment variables are missing! Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel Project Settings.";
        console.error(errorMsg);
        
        return {
            auth: {
                signInWithPassword: async () => ({ error: { message: errorMsg } }),
                signUp: async () => ({ error: { message: errorMsg } }),
                signInWithOAuth: async () => ({ error: { message: errorMsg } }),
                signOut: async () => ({ error: { message: errorMsg } }),
                getUser: async () => ({ data: { user: null }, error: { message: errorMsg } }),
                exchangeCodeForSession: async () => ({ error: { message: errorMsg } }),
            },
            from: () => ({
                select: () => ({
                    eq: () => ({ 
                        maybeSingle: async () => ({ data: null, error: { message: errorMsg } }),
                        single: async () => ({ data: null, error: { message: errorMsg } })
                    }),
                    maybeSingle: async () => ({ data: null, error: { message: errorMsg } }),
                    single: async () => ({ data: null, error: { message: errorMsg } }),
                    head: async () => ({ count: 0, error: { message: errorMsg } }),
                }),
                insert: () => ({ select: () => ({ single: async () => ({ data: null, error: { message: errorMsg } }) }) }),
            })
        } as any;
    }

    return createServerClient(
        supabaseUrl,
        supabaseKey,
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
