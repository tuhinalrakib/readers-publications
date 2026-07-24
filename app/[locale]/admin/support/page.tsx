"use client";

import React, { useState, useEffect } from "react";
import { LifeBuoy, CheckCircle, Clock } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { showErrorAlert, showSuccessAlert } from "@/utils/swal";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN_SUPPORT);
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleToggleResolve = async (id: number, currentStatus: boolean) => {
    try {
      await apiClient.patch(API_ENDPOINTS.ADMIN_SUPPORT_DETAIL(id), {
        is_resolved: !currentStatus,
      });
      showSuccessAlert("Status Updated", !currentStatus ? "Ticket marked as Resolved!" : "Ticket reopened.");
      fetchTickets();
    } catch (err) {
      showErrorAlert("Error", "Failed to update ticket status.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <LifeBuoy className="h-7 w-7 text-purple-400" />
          Support Tickets
        </h1>
        <p className="text-xs text-slate-400">Manage customer inquiries and support messages.</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Message</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Loading support tickets...
                  </td>
                </tr>
              ) : tickets.length > 0 ? (
                tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>
                        <p>{t.name}</p>
                        <p className="text-[10px] text-purple-400">{t.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">{t.subject}</td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-sm line-clamp-2">{t.message}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          t.is_resolved
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {t.is_resolved ? (
                          <>
                            <CheckCircle className="h-3 w-3" /> Resolved
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" /> Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleResolve(t.id, t.is_resolved)}
                        className="rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No support tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
