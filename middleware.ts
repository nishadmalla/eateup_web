import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Grab the token and the role from the browser cookies
    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("role")?.value;

    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                       request.nextUrl.pathname.startsWith('/signup');

    // 2. ULTIMATE SECURITY: The Admin Bouncer
    // If they are trying to go to an /admin page, but they aren't an admin, kick them out!
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token || role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // 3. Standard user protection
    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Protect these specific routes
export const config = {
    matcher: [
        '/profile/:path*',
        '/checkout/:path*',
        '/admin/:path*', // <-- Added admin to the protected list
        '/login',
        '/signup'
    ]
};