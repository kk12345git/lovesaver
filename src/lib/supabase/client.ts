import { createBrowserClient } from "@supabase/ssr";

export const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        const errorMsg = "Supabase configuration is missing. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables.";
        console.error(errorMsg, {
            urlPresent: !!supabaseUrl,
            keyPresent: !!supabaseKey,
            nodeEnv: process.env.NODE_ENV
        });
    }

    return createBrowserClient(
        supabaseUrl || "",
        supabaseKey || ""
    );
}
