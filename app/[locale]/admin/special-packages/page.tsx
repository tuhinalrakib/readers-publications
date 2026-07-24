"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Trash2 } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";

export default function AdminSpecialPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.SPECIAL_PACKAGES);
      setPackages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package className="h-7 w-7 text-purple-400" />
          Special Packages
        </h1>
        <p className="text-xs text-slate-400">View and manage book bundles and promotional packages.</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Package Title</th>
                <th className="py-3.5 px-4">Bangla Title</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Discount Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    Loading packages...
                  </td>
                </tr>
              ) : packages.length > 0 ? (
                packages.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">{p.title}</td>
                    <td className="py-3.5 px-4 text-purple-400">{p.title_bn}</td>
                    <td className="py-3.5 px-4 font-bold text-white">৳ {p.price}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">
                      {p.discount_price ? `৳ ${p.discount_price}` : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No special packages created.
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
