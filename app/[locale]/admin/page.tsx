"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  BookOpen,
  Users,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  PackageCheck,
  UserCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN_STATS);
      setStats(res.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load dashboard metrics. Ensure backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm font-medium">Fetching realtime dashboard metrics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `৳ ${stats?.total_revenue?.toLocaleString() || "0"}`,
      subtitle: "Lifetime completed sales",
      icon: DollarSign,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "Total Orders",
      value: stats?.total_orders || 0,
      subtitle: `${stats?.pending_orders || 0} Pending orders`,
      icon: ShoppingCart,
      color: "from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30",
    },
    {
      title: "Total Books",
      value: stats?.total_books || 0,
      subtitle: `${stats?.total_authors || 0} Listed Authors`,
      icon: BookOpen,
      color: "from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/30",
    },
    {
      title: "Total Users",
      value: stats?.total_users || 0,
      subtitle: `${stats?.total_blogs || 0} Blog Articles`,
      icon: Users,
      color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome back! Here is what's happening with Readers Publication today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <Link
            href="/admin/books"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition"
          >
            <Plus className="h-4 w-4" />
            Add New Book
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Metrics Summary Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${card.color} p-5 backdrop-blur-xl shadow-xl transition hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/60 shadow-inner">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-white">{card.value}</h3>
                <p className="mt-1 text-xs text-slate-400">{card.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Trend Area Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Monthly Revenue & Sales</h2>
              <p className="text-xs text-slate-400">Monthly sales performance over time</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-950 p-1 text-xs text-slate-400 border border-slate-800">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                <span className="h-2 w-2 rounded-full bg-purple-400"></span> Revenue
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            {stats?.sales_chart && stats.sales_chart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.sales_chart}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#a855f7"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">
                No revenue data available yet
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">Quick Management</h2>
            <p className="text-xs text-slate-400 mb-6">Shortcuts to manage catalog and users</p>

            <div className="space-y-3">
              <Link
                href="/admin/orders"
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 transition hover:bg-purple-600/10 hover:border-purple-500/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                    <PackageCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Process Orders</p>
                    <p className="text-[10px] text-slate-400">Review & update order status</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 transition hover:bg-blue-600/10 hover:border-blue-500/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Manage Users</p>
                    <p className="text-[10px] text-slate-400">Toggle roles & permissions</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </Link>

              <Link
                href="/admin/carousels"
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 transition hover:bg-amber-600/10 hover:border-amber-500/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Hero Banners</p>
                    <p className="text-[10px] text-slate-400">Update homepage sliders</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-purple-500/10 p-4 border border-purple-500/20">
            <p className="text-xs font-semibold text-purple-300">Django Unfold Premium</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Frontend & Backend synchronized seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-purple-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stats?.recent_orders && stats.recent_orders.length > 0 ? (
                  stats.recent_orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-semibold text-purple-400">
                        #{order.id}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">{order.customer}</td>
                      <td className="py-3 px-4 font-bold text-slate-200">
                        ৳ {order.total_price?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            order.status?.toLowerCase() === "delivered"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : order.status?.toLowerCase() === "shipped"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href="/admin/orders"
                          className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white"
                        >
                          <Eye className="h-4 w-4 inline" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Books List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Top Books</h2>
            <Link href="/admin/books" className="text-xs font-semibold text-purple-400 hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.top_books && stats.top_books.length > 0 ? (
              stats.top_books.map((b: any) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3"
                >
                  <div className="flex items-center gap-3">
                    {b.cover_image ? (
                      <img
                        src={b.cover_image}
                        alt={b.title}
                        className="h-12 w-9 rounded object-cover shadow"
                      />
                    ) : (
                      <div className="flex h-12 w-9 items-center justify-center rounded bg-slate-800 text-slate-500">
                        <BookOpen className="h-4 w-4" />
                      </div>
                    )}
                    <div>
                      <p className="line-clamp-1 text-xs font-bold text-white">{b.title}</p>
                      <p className="text-[10px] text-slate-400">Stock: {b.stock}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-400">৳ {b.price}</span>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-xs text-slate-500">No books listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
