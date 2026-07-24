"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, ShieldCheck, ShieldAlert, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { showErrorAlert, showSuccessAlert, showConfirmDialog } from "@/utils/swal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`${API_ENDPOINTS.ADMIN_USERS}?search=${encodeURIComponent(search)}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleRole = async (user: any, field: string, value: boolean) => {
    try {
      await apiClient.patch(API_ENDPOINTS.ADMIN_USER_DETAIL(user.id), {
        [field]: value,
      });
      showSuccessAlert("Role Updated", "User role permissions updated.");
      fetchUsers();
    } catch (err) {
      showErrorAlert("Error", "Failed to update user role.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    const isConfirmed = await showConfirmDialog("Delete User?", "Are you sure you want to delete this user?");
    if (!isConfirmed) return;
    try {
      await apiClient.delete(API_ENDPOINTS.ADMIN_USER_DETAIL(id));
      showSuccessAlert("Deleted!", "User account has been deleted.");
      fetchUsers();
    } catch (err: any) {
      showErrorAlert("Error", err?.response?.data?.error || "Failed to delete user.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-7 w-7 text-purple-400" />
            Users Management
          </h1>
          <p className="text-xs text-slate-400">View, update roles, and manage all registered users.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search email, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Staff</th>
                <th className="py-3.5 px-4">Superuser</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 font-bold">
                          {u.full_name?.charAt(0) || "U"}
                        </div>
                        <span>{u.full_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-400">{u.phone_number || "—"}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleRole(u, "is_staff", !u.is_staff)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          u.is_staff ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {u.is_staff ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleRole(u, "is_superuser", !u.is_superuser)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          u.is_superuser ? "bg-purple-500/20 text-purple-400" : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {u.is_superuser ? "Superuser" : "No"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{u.date_joined}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No users found matching search criteria.
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
