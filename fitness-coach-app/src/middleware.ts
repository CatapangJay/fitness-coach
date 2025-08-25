import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('Middleware running for:', req.nextUrl.pathname);
  
  // Skip middleware for static files and API routes
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Try to get session - handle potential errors
  let session = null;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (!error && data.session) {
      session = data.session;
    }
  } catch (error) {
    console.log('Middleware session error:', error);
  }
  
  console.log('Middleware session check:', !!session, session?.user?.email);

  const { pathname } = req.nextUrl;

  // Define protected routes that require authentication
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/onboarding') ||
                          pathname.startsWith('/workout') ||
                          pathname.startsWith('/nutrition') ||
                          pathname.startsWith('/progress') ||
                          pathname.startsWith('/food-search') ||
                          pathname.startsWith('/meal-planner');

  // Define auth routes that should redirect if user is already authenticated
  const isAuthRoute = pathname.startsWith('/auth/login') || 
                     pathname.startsWith('/auth/register');

  // If trying to access protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    console.log('Redirecting to login - no session for protected route:', pathname);
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthRoute && session) {
    console.log('Redirecting to dashboard - authenticated user on auth route');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  console.log('Middleware allowing request to:', pathname);
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    // Temporarily disable middleware to fix redirect loop
    // '/((?!_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)',
  ],
};