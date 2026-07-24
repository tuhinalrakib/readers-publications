"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Search, Trash2, Edit, X, Star } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { showErrorAlert, showSuccessAlert, showConfirmDialog } from "@/utils/swal";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);

  // Complete Form state matching Django Unfold model
  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [status, setStatus] = useState("published");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isbn, setIsbn] = useState("");
  const [pages, setPages] = useState("200");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [authorId, setAuthorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [publisherName, setPublisherName] = useState("");
  const [publisherWebsiteLink, setPublisherWebsiteLink] = useState("");
  const [translator, setTranslator] = useState("");
  const [edition, setEdition] = useState("");
  const [language, setLanguage] = useState("Bengali");
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [country, setCountry] = useState("Bangladesh");

  // Boolean Flags
  const [isAvailable, setIsAvailable] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isCommingSoon, setIsCommingSoon] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`${API_ENDPOINTS.ADMIN_BOOKS}?search=${encodeURIComponent(search)}`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [authRes, catRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.ADMIN_AUTHORS),
        apiClient.get(API_ENDPOINTS.ADMIN_CATEGORIES),
      ]);
      setAuthors(authRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchDropdowns();
  }, [search]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugTouched) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugTouched(true);
  };

  const handleOpenCreate = () => {
    setEditingBook(null);
    setTitle("");
    setTitleBn("");
    setSlug("");
    setIsSlugTouched(false);
    setStatus("published");
    setSku("");
    setDescription("");
    setDescriptionBn("");
    setPublishedDate(new Date().toISOString().split("T")[0]);
    setIsbn("");
    setPages("200");
    setPrice("");
    setDiscountPrice("");
    setStock("10");
    setAuthorId("");
    setCategoryId("");
    setPublisherName("");
    setPublisherWebsiteLink("");
    setTranslator("");
    setEdition("");
    setLanguage("Bengali");
    setDimensions("");
    setWeight("");
    setCountry("Bangladesh");
    setIsAvailable(true);
    setIsNewArrival(false);
    setIsPopular(false);
    setIsCommingSoon(false);
    setIsBestSeller(false);
    setIsActive(true);
    setCoverFile(null);
    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingBook(b);
    setTitle(b.title || "");
    setTitleBn(b.title_bn || "");
    setSlug(b.slug || "");
    setIsSlugTouched(true);
    setStatus(b.status || "published");
    setSku(b.sku || "");
    setDescription(b.description || "");
    setDescriptionBn(b.description_bn || "");
    setPublishedDate(b.published_date || new Date().toISOString().split("T")[0]);
    setIsbn(b.isbn || "");
    setPages(b.pages ? b.pages.toString() : "0");
    setPrice(b.price ? b.price.toString() : "");
    setDiscountPrice(b.discount_price ? b.discount_price.toString() : "");
    setStock(b.stock !== undefined ? b.stock.toString() : "0");
    setAuthorId(b.author_id ? b.author_id.toString() : "");
    setCategoryId(b.category_id ? b.category_id.toString() : "");
    setPublisherName(b.publisher_name || "");
    setPublisherWebsiteLink(b.publisher_website_link || "");
    setTranslator(b.translator || "");
    setEdition(b.edition || "");
    setLanguage(b.language || "Bengali");
    setDimensions(b.dimensions || "");
    setWeight(b.weight ? b.weight.toString() : "");
    setCountry(b.country || "Bangladesh");
    setIsAvailable(b.is_available ?? true);
    setIsNewArrival(!!b.is_new_arrival);
    setIsPopular(!!b.is_popular);
    setIsCommingSoon(!!b.is_comming_soon);
    setIsBestSeller(!!b.is_best_seller);
    setIsActive(b.is_active ?? true);
    setCoverFile(null);
    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("title_bn", titleBn);
    const finalSlug = slug.trim() || generateSlug(title);
    if (finalSlug) formData.append("slug", finalSlug);
    formData.append("status", status);
    formData.append("sku", sku);
    formData.append("description", description);
    formData.append("description_bn", descriptionBn);
    formData.append("published_date", publishedDate);
    formData.append("isbn", isbn);
    formData.append("pages", pages);
    formData.append("price", price);
    if (discountPrice) formData.append("discount_price", discountPrice);
    formData.append("stock", stock);
    if (authorId) formData.append("author_id", authorId);
    if (categoryId) formData.append("category_id", categoryId);
    formData.append("publisher_name", publisherName);
    formData.append("publisher_website_link", publisherWebsiteLink);
    formData.append("translator", translator);
    formData.append("edition", edition);
    formData.append("language", language);
    formData.append("dimensions", dimensions);
    if (weight) formData.append("weight", weight);
    formData.append("country", country);

    formData.append("is_available", isAvailable ? "true" : "false");
    formData.append("is_new_arrival", isNewArrival ? "true" : "false");
    formData.append("is_popular", isPopular ? "true" : "false");
    formData.append("is_comming_soon", isCommingSoon ? "true" : "false");
    formData.append("is_best_seller", isBestSeller ? "true" : "false");
    formData.append("is_active", isActive ? "true" : "false");

    if (coverFile) formData.append("cover_image", coverFile);

    try {
      if (editingBook) {
        await apiClient.patch(API_ENDPOINTS.ADMIN_BOOK_DETAIL(editingBook.id), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await apiClient.post(API_ENDPOINTS.ADMIN_BOOKS, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setIsModalOpen(false);
      showSuccessAlert(editingBook ? "Book Updated" : "Book Created", editingBook ? "Book details updated successfully!" : "New book created successfully!");
      fetchBooks();
    } catch (err: any) {
      const errMsg = err?.response?.data?.error || err?.response?.data?.detail || (editingBook ? "Failed to update book." : "Failed to create book.");
      showErrorAlert("Error", errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBook = async (id: number) => {
    const isConfirmed = await showConfirmDialog("Delete Book?", "Are you sure you want to delete this book?");
    if (!isConfirmed) return;
    try {
      await apiClient.delete(API_ENDPOINTS.ADMIN_BOOK_DETAIL(id));
      showSuccessAlert("Deleted!", "Book has been deleted successfully.");
      fetchBooks();
    } catch (err) {
      showErrorAlert("Error", "Failed to delete book.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-purple-400" />
            Books Management
          </h1>
          <p className="text-xs text-slate-400">Manage all catalog books with complete metadata, prices, descriptions, slug, and flags.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, SKU, or ISBN..."
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
            Add Book
          </button>
        </div>
      </div>

      {/* Books Data Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Book</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading books...
                  </td>
                </tr>
              ) : books.length > 0 ? (
                books.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        {b.cover_image ? (
                          <img src={b.cover_image} alt={b.title} className="h-12 w-9 rounded object-cover border border-slate-800 shrink-0" />
                        ) : (
                          <div className="flex h-12 w-9 items-center justify-center rounded bg-slate-800 text-slate-500 shrink-0">
                            <BookOpen className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <p className="line-clamp-1 font-bold text-white text-sm">{b.title}</p>
                          <p className="text-[11px] text-purple-400">{b.title_bn}</p>
                          {b.slug && <p className="text-[10px] text-slate-500 font-mono">/{b.slug}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        b.status === 'published' ? "bg-emerald-500/20 text-emerald-400" :
                        b.status === 'draft' ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-400"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{b.author_name || "—"}</td>
                    <td className="py-3.5 px-4 text-slate-300">{b.category_title || "—"}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ৳ {b.price}
                      {b.discount_price && <span className="ml-1 text-[10px] text-emerald-400">({b.discount_price})</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${b.stock > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {b.stock} in stock
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1">
                        {b.is_best_seller && (
                          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">Best Seller</span>
                        )}
                        {b.is_new_arrival && (
                          <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-400">New</span>
                        )}
                        {b.is_popular && (
                          <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-400">Popular</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-500/20 hover:text-purple-400 transition"
                          title="Edit Book"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBook(b.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
                          title="Delete Book"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Add / Edit Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingBook ? `Edit Book: ${editingBook.title}` : "Add New Book"}
                </h2>
                <p className="text-xs text-slate-400">Fill in complete book details, pricing, slug, publication info, and flags.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 border-b border-slate-800 pb-1">
                  1. Basic & Classification
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Title (English) *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Slug (URL identifier)</label>
                    <input
                      type="text"
                      placeholder="e.g. atomic-habits (auto-generated from title)"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono placeholder-slate-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Status *</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Author</label>
                    <select
                      value={authorId}
                      onChange={(e) => setAuthorId(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select Author</option>
                      {authors.map((a) => (
                        <option key={a.id} value={a.id}>{a.name} ({a.name_bn || ""})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">SKU (Stock Keeping Unit)</label>
                    <input
                      type="text"
                      placeholder="e.g. BK-1002"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Inventory */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 border-b border-slate-800 pb-1">
                  2. Pricing & Stock
                </h3>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Regular Price (৳) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Discounted Price (৳)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Optional"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Available Copies *</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Total Pages *</label>
                    <input
                      type="number"
                      required
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Publishing Details & Specifications */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 border-b border-slate-800 pb-1">
                  3. Publication & Specifications
                </h3>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Published Date *</label>
                    <input
                      type="date"
                      required
                      value={publishedDate}
                      onChange={(e) => setPublishedDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">ISBN</label>
                    <input
                      type="text"
                      placeholder="e.g. 978-3-16-148410-0"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Publisher Name</label>
                    <input
                      type="text"
                      value={publisherName}
                      onChange={(e) => setPublisherName(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Publisher Link</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={publisherWebsiteLink}
                      onChange={(e) => setPublisherWebsiteLink(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Translator</label>
                    <input
                      type="text"
                      value={translator}
                      onChange={(e) => setTranslator(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Edition</label>
                    <input
                      type="text"
                      placeholder="e.g. 1st Edition"
                      value={edition}
                      onChange={(e) => setEdition(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Language</label>
                    <input
                      type="text"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Dimensions (e.g. 5 x 8 inches)</label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (in grams)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Descriptions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 border-b border-slate-800 pb-1">
                  4. Description
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description (English)</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Bangla)</label>
                    <textarea
                      rows={4}
                      value={descriptionBn}
                      onChange={(e) => setDescriptionBn(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Flags, Toggles & Cover Image */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 border-b border-slate-800 pb-1">
                  5. Availability, Badges & Cover Image
                </h3>
                <div className="flex flex-wrap items-center gap-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-900 text-purple-600 focus:ring-purple-500"
                    />
                    Is Available
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-900 text-amber-500 focus:ring-amber-500"
                    />
                    Best Seller
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-900 text-blue-500 focus:ring-blue-500"
                    />
                    New Arrival
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-900 text-purple-500 focus:ring-purple-500"
                    />
                    Popular Book
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCommingSoon}
                      onChange={(e) => setIsCommingSoon(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                    />
                    Coming Soon
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cover Image {editingBook && "(Leave blank to keep existing cover)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{editingBook ? "Updating..." : "Saving..."}</span>
                    </>
                  ) : (
                    editingBook ? "Update Book" : "Save Book"
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
