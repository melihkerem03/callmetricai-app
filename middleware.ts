import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Minimal middleware - let client-side handle auth
export async function middleware(request: NextRequest) {
  // Just pass through - AuthContext will handle redirects
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

