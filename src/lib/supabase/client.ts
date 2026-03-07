import { createBrowserClient } from "@supabase/ssr";

export const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

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
