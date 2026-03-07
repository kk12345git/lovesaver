import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // DIAGNOSTIC LOGS: Check if keys are actually present in the edge runtime
    console.log("LoveSaver Middleware: URL?", !!process.env.NEXT_PUBLIC_SUPABASE_URL, "KEY?", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If variables are missing, don't crash, just let the request through
    if (!supabaseUrl || !supabaseKey) {
        console.error("MIDDLEWARE ERROR: Missing Supabase Environment Variables in Vercel settings.");
        return response
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

        // Refresh session
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

        const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup')

        // Protection Logic
        if (!user && isAppRoute) {
            const redirectResponse = NextResponse.redirect(new URL('/login', request.url))
            // IMPORTANT: Copy cookies to redirect response!
            response.cookies.getAll().forEach((cookie) => {
                redirectResponse.cookies.set(cookie.name, cookie.value);
            });
            return redirectResponse
        }

        if (user && (isAuthRoute || path === '/')) {
            const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url))
            // IMPORTANT: Copy cookies to redirect response!
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
