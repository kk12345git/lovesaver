import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
            return response; // Handled by the route handler
        }

        const { data: { user } } = await supabase.auth.getUser()

        const url = request.nextUrl.clone()
        const path = url.pathname

        // Define routes
        const isAppRoute = path.startsWith('/dashboard') ||
            path.startsWith('/expenses') ||
            path.startsWith('/income') ||
            path.startsWith('/budget') ||
            path.startsWith('/categories') ||
            path.startsWith('/insights')

        const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup') || path === '/'

        // Protection Logic
        if (!user && isAppRoute) {
            const redirectResponse = NextResponse.redirect(new URL('/login', request.url))
            response.cookies.getAll().forEach((cookie) => {
                redirectResponse.cookies.set(cookie.name, cookie.value);
            });
            return redirectResponse
        }

        if (user && isAuthRoute) {
            const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url))
            response.cookies.getAll().forEach((cookie) => {
                redirectResponse.cookies.set(cookie.name, cookie.value);
            });
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
