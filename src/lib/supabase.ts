import { createBrowserClient } from '@supabase/ssr'

export const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000"

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
