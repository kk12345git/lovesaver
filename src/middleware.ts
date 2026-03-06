import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const HAS_URL = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const HAS_KEY = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 1. Guard against missing variables
    if (!HAS_URL || !HAS_KEY) {
        console.error("Middleware Sync Error: Missing Supabase Keys");
        return NextResponse.next();
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    // IMPORTANT: Soft-getting user to prevent middleware failure
    const { data: { user } } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname
    const isAppRoute = path.startsWith('/dashboard') ||
        path.startsWith('/expenses') ||
        path.startsWith('/income') ||
        path.startsWith('/budget') ||
        path.startsWith('/categories') ||
        path.startsWith('/insights')

    const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup')

    if (!user && isAppRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    if (user && path === '/') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (handled separately)
         */
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
