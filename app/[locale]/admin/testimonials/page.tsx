"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { showErrorAlert, showSuccessAlert, showConfirmDialog } from "@/utils/swal";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN_TESTIMONIALS);
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDeleteTestimonial = async (id: number) => {
    const isConfirmed = await showConfirmDialog("Delete Testimonial?", "Are you sure you want to delete this testimonial?");
    if (!isConfirmed) return;
    try {
      await apiClient.delete(API_ENDPOINTS.ADMIN_TESTIMONIAL_DETAIL(id));
      showSuccessAlert("Deleted!", "Testimonial deleted successfully.");
      fetchTestimonials();
    } catch (err) {
      showErrorAlert("Error", "Failed to delete testimonial.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-purple-400" />
          Testimonials
        </h1>
        <p className="text-xs text-slate-400">Review and delete customer testimonials displayed on homepage.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full py-8 text-center text-slate-500">Loading testimonials...</p>
        ) : testimonials.length > 0 ? (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover border border-purple-500/30" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 font-bold">
                      {t.name?.charAt(0) || "T"}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-white">{t.name}</h3>
                    <p className="text-[10px] text-purple-400">{t.designation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                    <Star key={idx} className="h-3 w-3 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 italic">"{t.comment}"</p>
              </div>

              <div className="mt-4 flex justify-end border-t border-slate-800 pt-3">
                <button
                  onClick={() => handleDeleteTestimonial(t.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full py-8 text-center text-slate-500">No testimonials found.</p>
        )}
      </div>
    </div>
  );
}
