"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.includes("/admin");

  if (isAdminRoute) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">{children}</div>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <Navigation />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
