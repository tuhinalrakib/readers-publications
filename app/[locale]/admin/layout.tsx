"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  FolderTree,
  Star,
  ShoppingCart,
  Package,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  LifeBuoy,
  Settings,
  Sun,
  Moon,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { isAdminUser } from "@/utils/generalFunc";

interface AdminNavGroup {
  title: string;
  items: {
    title: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const navGroups: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Users & Authors",
    items: [
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Authors", href: "/admin/authors", icon: UserCheck },
    ],
  },
  {
    title: "Catalog",
    items: [
      { title: "Books", href: "/admin/books", icon: BookOpen },
      { title: "Categories", href: "/admin/categories", icon: FolderTree },
      { title: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    title: "Sales",
    items: [
      { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { title: "Special Packages", href: "/admin/special-packages", icon: Package },
    ],
  },
  {
    title: "Content & Media",
    items: [
      { title: "Blog Posts", href: "/admin/blogs", icon: FileText },
      { title: "Hero Banners", href: "/admin/carousels", icon: ImageIcon },
      { title: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    ],
  },
  {
    title: "Support & Config",
    items: [
      { title: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
      { title: "General Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoading(false);
        setIsAuthorized(false);
        return;
      }

      try {
        const res = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
        const userData = res.data;
        setUser(userData);
        if (isAdminUser(userData)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    const locale = pathname?.split("/")[1] || "en";
    router.push(`/${locale}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Loading Readers Admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Access Restricted</h2>
          <p className="mt-2 text-sm text-slate-400">
            You must be logged in with a Superuser or Staff account to access the Readers Admin Panel.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/signin"
              className="inline-flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 shadow-lg shadow-purple-600/30"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-20 flex flex-col border-r border-slate-800 bg-slate-900 transition-[width,transform] duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } ${isMobileOpen ? "translate-x-0 z-40" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Logo & Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 font-bold text-white shadow-lg shadow-purple-600/30">
              R
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white">READERS</span>
                <span className="text-[10px] font-semibold tracking-wider text-purple-400 uppercase">
                  UNFOLD ADMIN
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:flex"
          >
            {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              {isSidebarOpen && (
                <p className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  // Handle exact match vs subpath
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin" || pathname === "/en/admin" || pathname === "/bn/admin"
                      : pathname?.includes(item.href);

                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-purple-600/15 text-purple-400 shadow-sm border-l-4 border-purple-500 font-semibold"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                      }`}
                      title={!isSidebarOpen ? item.title : undefined}
                    >
                      <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
                      {isSidebarOpen && <span>{item.title}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer info in Sidebar */}
        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-950/60 p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/20 font-bold text-purple-400 border border-purple-500/30">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            {isSidebarOpen && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-xs font-semibold text-white">
                  {user?.full_name || "Admin"}
                </span>
                <span className="truncate text-[10px] text-purple-400">
                  {user?.is_superuser ? "Superuser" : "Staff"}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Right Content Area */}
      <div
        className={`flex min-h-screen flex-1 flex-col transition-[margin-left] duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Topbar Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative hidden sm:block w-64 md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search resources, books, orders..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-1.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* View Site Button */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Storefront</span>
            </Link>

            {/* Notifications */}
            <button className="relative rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-500"></span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Admin Badge */}
            <span className="hidden sm:inline-flex items-center rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-400 border border-purple-500/20">
              {user?.is_superuser ? "Superuser" : "Staff Admin"}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950">{children}</main>
      </div>
    </div>
  );
}
