"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Plus, Trash2, X } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { showErrorAlert, showSuccessAlert, showConfirmDialog } from "@/utils/swal";

export default function AdminCarouselsPage() {
  const [carousels, setCarousels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchCarousels = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN_CAROUSELS);
      setCarousels(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarousels();
  }, []);

  const handleCreateCarousel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("title_bn", titleBn);
    formData.append("link", link);
    if (imageFile) formData.append("image", imageFile);

    try {
      await apiClient.post(API_ENDPOINTS.ADMIN_CAROUSELS, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsModalOpen(false);
      setTitle("");
      setTitleBn("");
      setLink("");
      setImageFile(null);
      showSuccessAlert("Banner Created", "Carousel banner added successfully!");
      fetchCarousels();
    } catch (err: any) {
      const errMsg = err?.response?.data?.error || err?.response?.data?.detail || "Failed to add carousel banner.";
      showErrorAlert("Error", errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCarousel = async (id: number) => {
    const isConfirmed = await showConfirmDialog("Delete Banner?", "Are you sure you want to delete this banner?");
    if (!isConfirmed) return;
    try {
      await apiClient.delete(API_ENDPOINTS.ADMIN_CAROUSEL_DETAIL(id));
      showSuccessAlert("Deleted!", "Carousel banner deleted successfully.");
      fetchCarousels();
    } catch (err) {
      showErrorAlert("Error", "Failed to delete banner.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-7 w-7 text-purple-400" />
            Hero Sliders & Banners
          </h1>
          <p className="text-xs text-slate-400">Manage homepage hero carousel banners and promotional slides.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add Slider Banner
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full py-8 text-center text-slate-500">Loading carousel banners...</p>
        ) : carousels.length > 0 ? (
          carousels.map((c) => (
            <div
              key={c.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-xl"
            >
              <div>
                {c.image && (
                  <img src={c.image} alt={c.title} className="h-40 w-full rounded-xl object-cover mb-3 border border-slate-800" />
                )}
                <h3 className="text-sm font-bold text-white line-clamp-1">{c.title || "Banner"}</h3>
                <p className="text-xs text-purple-400">{c.title_bn}</p>
                {c.link && <p className="mt-1 text-[10px] text-slate-500 truncate">Link: {c.link}</p>}
              </div>

              <div className="mt-4 flex justify-end border-t border-slate-800 pt-3">
                <button
                  onClick={() => handleDeleteCarousel(c.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full py-8 text-center text-slate-500">No hero banners created yet.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h2 className="text-lg font-bold text-white">Add Hero Banner</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCarousel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Link (URL)</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. /books"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Banner"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
