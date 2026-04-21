// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Define your supported locales and default locale
const locales = ['bn', 'en'];
const defaultLocale = 'bn';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore paths that already include a valid locale
  if (locales.some((locale) => pathname.startsWith(`/${locale}`))) {
    return NextResponse.next();
  }

  // Detect the user's preferred language from the Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  const preferredLocale = acceptLanguage?.split(',')[0].split('-')[0];

  const locale =  defaultLocale;

  // Rewrite or redirect to the correct locale-prefixed route
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

// Only run middleware on paths that aren't static assets or API routes
export const config = {
  matcher: [
    // Match everything except: /_next, /api, /favicon.ico, /assets, etc.
    '/((?!_next|api|favicon.ico|assets|.*\\..*).*)',
  ],
};
