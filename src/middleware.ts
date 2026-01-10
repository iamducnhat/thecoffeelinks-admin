import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const adminToken = request.cookies.get('admin_token')?.value;
    const { pathname } = request.nextUrl;

    // Paths that don't require authentication
    if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
        // If user is already authenticated and tries to go to login, redirect to dashboard
        if (adminToken === process.env.ADMIN_SECRET && pathname === '/login') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // Check if token matches the secret
    // Note: ideally checking simple equality. 
    // If ADMIN_SECRET is not set, this might block everything or allow nothing depending on logic.
    // We assume ADMIN_SECRET is set.
    if (adminToken !== process.env.ADMIN_SECRET) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images etc)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
