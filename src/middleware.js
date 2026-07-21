import { NextResponse } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  const isAdminHost = hostname.startsWith('admin.localhost') || hostname.startsWith('admin.');
  const isVercelDomain = hostname.endsWith('.vercel.app');

  if (url.pathname.startsWith('/api')) {
      return NextResponse.next();
  }

  const { supabaseResponse, user } = await updateSession(request);

  // If using subdomain, rewrite paths to /dashboard
  if (isAdminHost) {
    if (url.pathname === '/') {
      url.pathname = '/dashboard';
    } else if (!url.pathname.startsWith('/dashboard')) {
      url.pathname = `/dashboard${url.pathname}`;
    }
  }

  // Now, if it's a dashboard path (either naturally or via rewrite)
  if (url.pathname.startsWith('/dashboard')) {
    // Block direct access if not admin host AND not vercel
    // Removed restriction to allow /dashboard access from main domain
    // if (!isAdminHost && !isVercelDomain) {
    //   return NextResponse.redirect(new URL('/', request.url));
    // }

    // Check auth
    if (!user && url.pathname !== '/dashboard/login' && !url.pathname.startsWith('/api/')) {
      // If admin host, they see the login page at /login natively.
      // If direct vercel, they see it at /dashboard/login.
      const loginUrl = new URL(isAdminHost ? '/login' : '/dashboard/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If logged in and trying to login, redirect back
    if (user && url.pathname === '/dashboard/login') {
      const dashboardUrl = new URL(isAdminHost ? '/' : '/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // If it was rewritten, return rewrite response
    if (isAdminHost) {
      const rewriteResponse = NextResponse.rewrite(url);
      supabaseResponse.cookies.getAll().forEach(cookie => {
        rewriteResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return rewriteResponse;
    }

    // Direct access allowed, skip i18n
    return supabaseResponse;
  }

  // --- i18n Logic for Main Domain ---
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
    
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    
    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
