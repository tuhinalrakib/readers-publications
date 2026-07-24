"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, Plus, Trash2, Edit, X } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { showErrorAlert, showSuccessAlert, showConfirmDialog } from "@/utils/swal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN_CATEGORIES);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setTitle("");
    setTitleBn("");
    setIconFile(null);
    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCategory(c);
    setTitle(c.title || "");
    setTitleBn(c.title_bn || "");
    setIconFile(null);
    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("title_bn", titleBn);
    if (iconFile) formData.append("icon", iconFile);

    try {
      if (editingCategory) {
        await apiClient.patch(API_ENDPOINTS.ADMIN_CATEGORY_DETAIL(editingCategory.id), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await apiClient.post(API_ENDPOINTS.ADMIN_CATEGORIES, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setIsModalOpen(false);
      showSuccessAlert(editingCategory ? "Category Updated" : "Category Created", editingCategory ? "Category details updated successfully!" : "New category created successfully!");
      fetchCategories();
    } catch (err: any) {
      const errMsg = err?.response?.data?.error || err?.response?.data?.detail || (editingCategory ? "Failed to update category." : "Failed to create category.");
      showErrorAlert("Error", errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const isConfirmed = await showConfirmDialog("Delete Category?", "Are you sure you want to delete this category?");
    if (!isConfirmed) return;
    try {
      await apiClient.delete(API_ENDPOINTS.ADMIN_CATEGORY_DETAIL(id));
      showSuccessAlert("Deleted!", "Category has been deleted successfully.");
      fetchCategories();
    } catch (err) {
      showErrorAlert("Error", "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderTree className="h-7 w-7 text-purple-400" />
            Categories Management
          </h1>
          <p className="text-xs text-slate-400">Organize books into genres and subject categories.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full py-8 text-center text-slate-500">Loading categories...</p>
        ) : categories.length > 0 ? (
          categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                {c.icon ? (
                  <img src={c.icon} alt={c.title} className="h-10 w-10 rounded-lg object-cover border border-purple-500/30" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-bold">
                    <FolderTree className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-white">{c.title}</h3>
                  <p className="text-xs text-purple-400">{c.title_bn}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-500/20 hover:text-purple-400 transition"
                  title="Edit Category"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
                  title="Delete Category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full py-8 text-center text-slate-500">No categories found.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h2 className="text-lg font-bold text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title (Bangla)</label>
                <input
                  type="text"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category Icon / Image {editingCategory && "(Leave blank to keep existing)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIconFile(e.target.files?.[0] || null)}
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
                      <span>{editingCategory ? "Updating..." : "Saving..."}</span>
                    </>
                  ) : (
                    editingCategory ? "Update Category" : "Save Category"
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
