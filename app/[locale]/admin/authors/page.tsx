"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Plus, Search, Trash2, Edit, X, Mail, Phone, MapPin } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { showErrorAlert, showSuccessAlert, showConfirmDialog } from "@/utils/swal";

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);

  // Author Form State matching Django Unfold model fields
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugTouched) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugTouched(true);
  };

  const fetchAuthors = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`${API_ENDPOINTS.ADMIN_AUTHORS}?search=${encodeURIComponent(search)}`);
      setAuthors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN_USERS);
      setUsersList(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users list", err);
    }
  };

  useEffect(() => {
    fetchAuthors();
    fetchUsers();
  }, [search]);

  const handleOpenCreate = () => {
    setEditingAuthor(null);
    setUserId("");
    setName("");
    setNameBn("");
    setSlug("");
    setIsSlugTouched(false);
    setEmail("");
    setDescription("");
    setDescriptionBn("");
    setPhoneNumber("");
    setAddress("");
    setCity("");
    setStateVal("");
    setCountry("");
    setPostalCode("");
    setIsActive(true);
    setImageFile(null);
    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: any) => {
    setEditingAuthor(a);
    setUserId(a.user_id ? a.user_id.toString() : (a.user ? a.user.toString() : ""));
    setName(a.name || "");
    setNameBn(a.name_bn || "");
    setSlug(a.slug || "");
    setIsSlugTouched(true);
    setEmail(a.email || "");
    setDescription(a.description || a.bio || "");
    setDescriptionBn(a.description_bn || "");
    setPhoneNumber(a.phone_number || "");
    setAddress(a.address || "");
    setCity(a.city || "");
    setStateVal(a.state || "");
    setCountry(a.country || "");
    setPostalCode(a.postal_code || "");
    setIsActive(a.is_active ?? true);
    setImageFile(null);
    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const handleSaveAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    if (userId) formData.append("user_id", userId);
    formData.append("name", name);
    formData.append("name_bn", nameBn);
    const finalSlug = slug.trim() || generateSlug(name);
    if (finalSlug) formData.append("slug", finalSlug);
    formData.append("email", email);
    formData.append("description", description);
    formData.append("description_bn", descriptionBn);
    formData.append("phone_number", phoneNumber);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", stateVal);
    formData.append("country", country);
    formData.append("postal_code", postalCode);
    formData.append("is_active", isActive ? "true" : "false");

    if (imageFile) {
      formData.append("profile_picture", imageFile);
      formData.append("image", imageFile);
    }

    try {
      if (editingAuthor) {
        await apiClient.patch(API_ENDPOINTS.ADMIN_AUTHOR_DETAIL(editingAuthor.id), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await apiClient.post(API_ENDPOINTS.ADMIN_AUTHORS, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setIsModalOpen(false);
      showSuccessAlert(editingAuthor ? "Author Updated" : "Author Created", editingAuthor ? "Author details updated successfully!" : "New author created successfully!");
      fetchAuthors();
    } catch (err: any) {
      const errMsg = err?.response?.data?.error || err?.response?.data?.detail || (editingAuthor ? "Failed to update author." : "Failed to create author.");
      showErrorAlert("Error", errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAuthor = async (id: number) => {
    const isConfirmed = await showConfirmDialog("Delete Author?", "Are you sure you want to delete this author?");
    if (!isConfirmed) return;
    try {
      await apiClient.delete(API_ENDPOINTS.ADMIN_AUTHOR_DETAIL(id));
      showSuccessAlert("Deleted!", "Author has been deleted successfully.");
      fetchAuthors();
    } catch (err) {
      showErrorAlert("Error", "Failed to delete author.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCheck className="h-7 w-7 text-purple-400" />
            Authors Management
          </h1>
          <p className="text-xs text-slate-400">Manage author profiles, details, contact information, and biography.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search author by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Author
          </button>
        </div>
      </div>

      {/* Authors List Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full py-8 text-center text-slate-500">Loading authors...</p>
        ) : authors.length > 0 ? (
          authors.map((a) => (
            <div
              key={a.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-xl relative overflow-hidden group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {a.profile_picture || a.image ? (
                      <img src={a.profile_picture || a.image} alt={a.name} className="h-12 w-12 rounded-full object-cover border-2 border-purple-500/30 shrink-0" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 font-bold text-base shrink-0">
                        {a.name?.charAt(0) || "A"}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{a.name}</h3>
                      {a.name_bn && <p className="text-xs text-purple-400">{a.name_bn}</p>}
                      {a.slug && <p className="text-[10px] text-slate-500 font-mono">/{a.slug}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(a)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-500/20 hover:text-purple-400 transition"
                      title="Edit Author"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAuthor(a.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
                      title="Delete Author"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-400 mt-2">
                  {a.email && (
                    <div className="flex items-center gap-2 text-[11px]">
                      <Mail className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{a.email}</span>
                    </div>
                  )}
                  {a.phone_number && (
                    <div className="flex items-center gap-2 text-[11px]">
                      <Phone className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span>{a.phone_number}</span>
                    </div>
                  )}
                  {(a.city || a.country) && (
                    <div className="flex items-center gap-2 text-[11px]">
                      <MapPin className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span>{[a.city, a.country].filter(Boolean).join(", ")}</span>
                    </div>
                  )}
                </div>

                {(a.description || a.bio) && (
                  <p className="mt-3 line-clamp-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                    {a.description || a.bio}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  a.is_active !== false ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                }`}>
                  {a.is_active !== false ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full py-8 text-center text-slate-500">No authors found.</p>
        )}
      </div>

      {/* Comprehensive Add / Edit Author Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingAuthor ? `Edit Author: ${editingAuthor.name}` : "Add New Author"}
                </h2>
                <p className="text-xs text-slate-400">Fill in complete author information matching the platform records.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveAuthor} className="space-y-6">
              {/* Section 1: Basic & User Selection */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 border-b border-slate-800 pb-1">
                  1. Basic Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">User (Optional Account Link)</label>
                    <select
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select User Account (Optional)</option>
                      {usersList.map((u) => {
                        const isLinkedToOther = authors.some((a) => (a.user_id === u.id || a.user === u.id) && (!editingAuthor || a.id !== editingAuthor.id));
                        return (
                          <option key={u.id} value={u.id} disabled={isLinkedToOther}>
                            {u.full_name || u.username || u.email} ({u.email}) {isLinkedToOther ? "— (Already Linked)" : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Name (English) *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Name (Bangla)</label>
                    <input
                      type="text"
                      value={nameBn}
                      onChange={(e) => setNameBn(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Slug (URL identifier)</label>
                    <input
                      type="text"
                      placeholder="e.g. humayun-ahmed (auto-generated)"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono placeholder-slate-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="author@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Descriptions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 border-b border-slate-800 pb-1">
                  2. Biography & Description
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description (English)</label>
                    <textarea
                      rows={4}
                      placeholder="Biography in English..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Bangla)</label>
                    <textarea
                      rows={4}
                      placeholder="বাংলায় লেখক পরিচিতি..."
                      value={descriptionBn}
                      onChange={(e) => setDescriptionBn(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Contact & Address Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 border-b border-slate-800 pb-1">
                  3. Contact & Address Info
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+88017..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Dhaka"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">State / Region</label>
                    <input
                      type="text"
                      placeholder="e.g. Dhaka Division"
                      value={stateVal}
                      onChange={(e) => setStateVal(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangladesh"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Postal Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 1207"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                    <input
                      type="text"
                      placeholder="Street address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Media & Status */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 border-b border-slate-800 pb-1">
                  4. Media & Status
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Profile Picture {editingAuthor && "(Leave blank to keep existing)"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-purple-600 focus:ring-purple-500 h-4 w-4"
                      />
                      Is Active Author
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{editingAuthor ? "Updating..." : "Saving..."}</span>
                    </>
                  ) : (
                    editingAuthor ? "Update Author" : "Save Author"
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
