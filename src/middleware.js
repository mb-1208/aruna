import { NextResponse } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // For local development, map admin.localhost:3000 to dashboard.
  // For production, map admin.arunaretreats.com to dashboard.
  const isAdminHost = hostname.startsWith('admin.localhost') || hostname.startsWith('admin.');

  // Ignore /api routes for rewrites to prevent overriding api endpoints
  if (url.pathname.startsWith('/api')) {
      return NextResponse.next();
  }

  // Handle Supabase Auth Session
  const { supabaseResponse, user } = await updateSession(request);

  if (isAdminHost) {
    // Prevent unauthenticated access to the dashboard
    // Exclude the login API route and login page from the check
    if (!user && url.pathname !== '/login' && !url.pathname.startsWith('/api/')) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If logged in and trying to access /login, redirect to root (which rewrites to /dashboard)
    if (user && url.pathname === '/login') {
      const dashboardUrl = new URL('/', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // Rewrite admin subdomain paths to /dashboard/... internally
    if (url.pathname === '/') {
      url.pathname = '/dashboard';
    } else {
      url.pathname = `/dashboard${url.pathname}`;
    }
    
    // Copy cookies from supabaseResponse to the rewritten response
    const rewriteResponse = NextResponse.rewrite(url);
    supabaseResponse.cookies.getAll().forEach(cookie => {
      rewriteResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return rewriteResponse;
  }

  // Prevent direct access to /dashboard from the main domain
  // Allow access if it's a .vercel.app preview domain for easier testing
  const isVercelDomain = hostname.endsWith('.vercel.app');
  if (url.pathname.startsWith('/dashboard') && !isAdminHost && !isVercelDomain) {
    return NextResponse.redirect(new URL('/', request.url));
  }


  // --- i18n Logic for Main Domain ---
  if (!isAdminHost) {
    // Ignore files with extensions (like images, fonts)
    if (url.pathname.includes('.')) {
      return supabaseResponse;
    }

    const locales = ['en', 'es'];
    const defaultLocale = 'en';

    const pathnameHasLocale = locales.some(
      (locale) => url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
      url.pathname = `/${defaultLocale}${url.pathname}`;
      const redirectResponse = NextResponse.redirect(url);
      
      // Copy cookies to the new response
      supabaseResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      
      return redirectResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
