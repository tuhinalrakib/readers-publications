"use client";

import React, { useState, useEffect } from "react";
import { Star, Trash2 } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.BOOK_REVIEWS_LIST);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="h-7 w-7 text-amber-400 fill-amber-400" />
          Book Reviews Moderation
        </h1>
        <p className="text-xs text-slate-400">Review customer ratings and product feedback.</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Book</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Review Content</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">{r.book?.title || "Book"}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: r.rating || 5 }).map((_, idx) => (
                          <Star key={idx} className="h-3.5 w-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-md">{r.review}</td>
                    <td className="py-3.5 px-4 text-slate-400">{r.created_at}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No reviews found.
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
