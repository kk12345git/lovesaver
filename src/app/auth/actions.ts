'use server'

import { createSupabaseServer, getURL } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const supabase = createSupabaseServer()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = createSupabaseServer()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${getURL()}auth/callback`,
        }
    })

    if (error) {
        return { error: error.message }
    }

    // If session is null, email confirmation is likely enabled
    if (!authData.session) {
        return {
            message: "Check your email for the confirmation link! 💌",
            pendingConfirmation: true
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signInWithGoogle() {
    const supabase = createSupabaseServer()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${getURL()}auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (data.url) {
        return { url: data.url }
    }

    return { error: "Failed to generate Google login URL" }
}

export async function logout() {
    const supabase = createSupabaseServer()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
