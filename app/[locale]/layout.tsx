import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteFooter } from "@/components/site-footer"
import { locales } from '@/i18n';
import type { Locale } from '@/i18n';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from "@/i18n/routing"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Providers } from "@/utils/providers"
import FetchRootData from "@/components/FetchRootData"
import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Readers Publications | Quality Books & Educational Materials",
  description: "Discover a wide range of quality books, journals, and educational materials for all ages at Readers Publications. Shop online with fast delivery.",
  keywords: "books, educational materials, journals, readers publications, online bookstore",
  authors: [{ name: "Readers Publications" }],
  openGraph: {
    title: "Readers Publications | Quality Books & Educational Materials",
    description: "Discover a wide range of quality books, journals, and educational materials for all ages at Readers Publications. Shop online with fast delivery.",
    url: "https://rafi-publications.vercel.app",
    siteName: "Readers Publications",
    images: [
      {
        url: "/rafi-publications.png",
        width: 800,
        height: 600,
        alt: "Rafi Publications",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

import MainLayoutWrapper from "@/components/MainLayoutWrapper"

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{ locale: string }>
}>) {

  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className="light" style={{ colorScheme: "light" }}>
      <head> 
        <link rel="icon" href="/rafi-publications.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <Providers>
                <FetchRootData />
                <MainLayoutWrapper>{children}</MainLayoutWrapper>
              </Providers>
            </NextIntlClientProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
