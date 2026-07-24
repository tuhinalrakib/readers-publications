"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Search, Eye, X, CheckCircle, Clock, Truck, PackageCheck, AlertTriangle } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { showErrorAlert, showSuccessAlert } from "@/utils/swal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(
        `${API_ENDPOINTS.ADMIN_ORDERS}?status=${encodeURIComponent(statusFilter)}&search=${encodeURIComponent(search)}`
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await apiClient.patch(API_ENDPOINTS.ADMIN_ORDER_DETAIL(orderId), {
        status: newStatus,
      });
      showSuccessAlert("Order Updated", `Order #${orderId} status changed to ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      showErrorAlert("Error", "Failed to update order status.");
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN_ORDER_DETAIL(id));
      setSelectedOrder(res.data);
      setIsDetailOpen(true);
    } catch (err) {
      showErrorAlert("Error", "Failed to load order details.");
    }
  };

  const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-purple-400" />
            Orders Management
          </h1>
          <p className="text-xs text-slate-400">Track, update delivery status, and review order invoices.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search order ID, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-400">#{o.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>
                        <p>{o.customer_name}</p>
                        <p className="text-[10px] text-slate-400">{o.customer_email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">৳ {o.total_price?.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-400">{o.payment_method || "COD"}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        className={`rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] font-bold ${
                          o.status?.toLowerCase() === "delivered"
                            ? "text-emerald-400"
                            : o.status?.toLowerCase() === "shipped"
                            ? "text-blue-400"
                            : o.status?.toLowerCase() === "cancelled"
                            ? "text-red-400"
                            : "text-amber-400"
                        }`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{o.created_at}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleViewDetail(o.id)}
                        className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white transition"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {isDetailOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Order Details #{selectedOrder.id}</h2>
                <p className="text-xs text-slate-400">Placed on {selectedOrder.created_at}</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid gap-3 sm:grid-cols-2 rounded-xl bg-slate-950 p-4 border border-slate-800">
                <div>
                  <span className="text-slate-500 font-semibold">Customer:</span>
                  <p className="font-bold text-white mt-0.5">{selectedOrder.customer_name}</p>
                  <p className="text-slate-400">{selectedOrder.customer_email}</p>
                  <p className="text-slate-400">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Shipping Address:</span>
                  <p className="text-slate-300 mt-0.5">{selectedOrder.shipping_address || "Standard Address"}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">Ordered Items</h3>
                <div className="rounded-xl border border-slate-800 bg-slate-950 divide-y divide-slate-800">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between p-3">
                        <div>
                          <p className="font-semibold text-white">{item.book_title}</p>
                          <p className="text-slate-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-purple-400">৳ {item.price}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-slate-500 text-center">No item details available</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="font-bold text-slate-300">Total Invoice Amount:</span>
                <span className="text-lg font-extrabold text-emerald-400">৳ {selectedOrder.total_price?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
