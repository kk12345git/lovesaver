import { createBrowserClient } from "@supabase/ssr";

export const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        const missingVars = [];
        if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
        if (!supabaseKey) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

        const errorMsg = `Supabase Configuration Error: Missing ${missingVars.join(' and ')}. Please add these variables in your Vercel Project Settings -> Environment Variables.`;

        // Return a mock client that returns this error instead of throwing an internal Supabase crash
        return {
            auth: {
                signInWithOAuth: async () => ({ error: { message: errorMsg } }),
                signInWithPassword: async () => ({ error: { message: errorMsg } }),
                signUp: async () => ({ error: { message: errorMsg } }),
                signOut: async () => ({ error: { message: errorMsg } }),
                getUser: async () => ({ data: { user: null }, error: { message: errorMsg } }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            },
            from: () => ({
                select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: { message: errorMsg } }) }) }),
                insert: () => ({ select: () => ({ single: async () => ({ data: null, error: { message: errorMsg } }) }) }),
            })
        } as any;
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    );
}
