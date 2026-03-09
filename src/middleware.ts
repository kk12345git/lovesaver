import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Safety check: Don't crash if keys are missing
    if (!supabaseUrl || !supabaseKey) {
        console.warn("LoveSaver: Supabase keys missing in environment. Auth will be disabled.");
        return response;
    }

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                        response = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // Special case: OAuth callback
        if (request.nextUrl.pathname === '/auth/callback') {
            return response;
        }

        const { data: { user } } = await supabase.auth.getUser()

        const url = request.nextUrl.clone()
        const path = url.pathname

        // Define route categories
        const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup')
        const isLandingPage = path === '/'
        const isOnboarding = path.startsWith('/onboarding')

        const isAppRoute = path.startsWith('/dashboard') ||
            path.startsWith('/expenses') ||
            path.startsWith('/income') ||
            path.startsWith('/budget') ||
            path.startsWith('/categories') ||
            path.startsWith('/insights') ||
            path.startsWith('/settings') ||
            isOnboarding

        // 1. Unauthenticated users: Allow Landing, Login, Signup. Redirect App -> Landing
        if (!user) {
            if (isAppRoute && !isLandingPage) {
                const redirectResponse = NextResponse.redirect(new URL('/', request.url))
                return redirectResponse
            }
            return response
        }

        // 2. Authenticated users: Check Onboarding status
        const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .maybeSingle()

        const hasCompletedOnboarding = profile?.onboarding_completed || false

        // If authenticated and on Auth routes or Landing -> Go to Dashboard (or Onboarding)
        if (isAuthRoute || isLandingPage) {
            const target = hasCompletedOnboarding ? '/dashboard' : '/onboarding'
            const redirectResponse = NextResponse.redirect(new URL(target, request.url))
            response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie.name, cookie.value))
            return redirectResponse
        }

        // If authenticated but not onboarded -> Force Onboarding (unless already there)
        if (!hasCompletedOnboarding && !isOnboarding && isAppRoute) {
            const redirectResponse = NextResponse.redirect(new URL('/onboarding', request.url))
            response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie.name, cookie.value))
            return redirectResponse
        }

        // If authenticated and onboarded but tries to enter Onboarding -> Go to Dashboard
        if (hasCompletedOnboarding && isOnboarding) {
            const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url))
            response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie.name, cookie.value))
            return redirectResponse
        }
    } catch (e) {
        console.error("MIDDLEWARE EXCEPTION:", e);
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
