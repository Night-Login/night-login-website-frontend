"use client";

import React, { useState } from "react";
import type { User, UserRole } from "@/modules/admin/types";
import { initialAdminData } from "@/modules/admin/data/mockData";
import AdminActionBar from "@/components/Admin/ui/AdminActionBar";
import AdminFormCard from "@/components/Admin/ui/AdminFormCard";
import AdminTable, { type ColumnDef } from "@/components/Admin/ui/AdminTable";
import AdminModal from "@/components/Admin/ui/AdminModal";
import { EditIcon, TrashIcon, EyeIcon, SearchIcon } from "@/components/Admin/ui/Icons";

interface UserFormData {
  name: string;
  email: string;
  role: UserRole | string;
  password?: string;
}

const emptyForm: UserFormData = {
  name: "",
  email: "",
  role: "admin",
  password: "",
};

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>(initialAdminData.users);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [previewUser, setPreviewUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showMessage = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (user: User) => {
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setEditId(user.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    if (!window.confirm(`Yakin ingin menghapus user "${target.name}" (${target.email})?`)) {
      return;
    }

    setActionLoading(true);
    setTimeout(() => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      if (editId === userId) resetForm();
      setActionLoading(false);
      showMessage("success", `User "${target.name}" berhasil dihapus.`);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      showMessage("error", "Nama dan email wajib diisi.");
      return;
    }

    setActionLoading(true);

    setTimeout(() => {
      if (editId) {
        // Update existing user
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editId
              ? {
                  ...u,
                  name: form.name,
                  email: form.email,
                  role: form.role,
                }
              : u
          )
        );
        showMessage("success", `User "${form.name}" berhasil diperbarui.`);
      } else {
        // Create new user
        const newUser: User = {
          id: `usr_${String(Date.now()).slice(-4)}`,
          name: form.name,
          email: form.email,
          role: form.role,
          createdAt: new Date().toISOString(),
          password_hash: "$2b$10$simulatedhashfornewuser",
        };
        setUsers((prev) => [newUser, ...prev]);
        showMessage("success", `User baru "${form.name}" berhasil ditambahkan.`);
      }

      resetForm();
      setActionLoading(false);
    }, 400);
  };

  // Filter and search logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Columns definition matching AdminTable pattern
  const columns: ColumnDef<User>[] = [
    {
      header: "User ID",
      key: "id",
      className: "font-mono font-semibold text-gray-700",
      render: (u) => (
        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-mono border border-gray-200">
          {u.id}
        </span>
      ),
    },
    {
      header: "Nama",
      key: "name",
      className: "font-semibold text-gray-900",
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-red/10 text-red flex items-center justify-center font-bold text-xs uppercase">
            {u.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{u.name}</div>
            <div className="text-[11px] text-gray-400">ID: {u.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      key: "email",
      className: "text-gray-600",
    },
    {
      header: "Role",
      key: "role",
      render: (u) => {
        let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200";
        if (u.role === "admin") {
          badgeStyle = "bg-red/10 text-red border-red/20";
        } else if (u.role === "leader") {
          badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
        } else if (u.role === "member") {
          badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
        }

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${badgeStyle}`}>
            {u.role}
          </span>
        );
      },
    },
    {
      header: "Tanggal Dibuat",
      key: "createdAt",
      className: "text-gray-500 text-[11px]",
      render: (u) => (
        <span>
          {new Date(u.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Aksi",
      headerClassName: "text-right",
      className: "text-right",
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            title="Lihat Detail"
            onClick={() => setPreviewUser(u)}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Edit User"
            onClick={() => handleEditClick(u)}
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Hapus User"
            onClick={() => handleDelete(u.id)}
            className="p-1.5 text-red hover:text-red/80 hover:bg-red/10 rounded-lg transition-colors cursor-pointer"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="font-jakarta">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`mb-4 p-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red/10 border-red/20 text-red"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Action Bar */}
      <AdminActionBar
        title="Daftar Pengguna & Administrator"
        isAddMode={showAddForm}
        onAddClick={() => {
          if (showAddForm) {
            resetForm();
          } else {
            resetForm();
            setShowAddForm(true);
          }
        }}
        searchSlot={
          <div className="relative">
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari user (nama, email)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red focus:bg-white transition-colors w-48 sm:w-60"
            />
          </div>
        }
        filterSlot={
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red focus:bg-white text-gray-700 cursor-pointer"
          >
            <option value="all">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="leader">Leader</option>
            <option value="member">Member</option>
          </select>
        }
      />

      {/* Form Card (Create / Edit) */}
      <AdminFormCard
        isOpen={showAddForm}
        title="User"
        editId={editId}
        actionLoading={actionLoading}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        submitTextAdd="Simpan User Baru"
        submitTextEdit="Simpan Perubahan"
        gridCols="md:grid-cols-2"
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Nama Lengkap <span className="text-red">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Admin User"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-red"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email <span className="text-red">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="Contoh: admin@nightlogin.org"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-red"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Role Akun <span className="text-red">*</span>
          </label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-red bg-white"
          >
            <option value="admin">Admin</option>
            <option value="leader">Leader</option>
            <option value="member">Member</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {editId ? "Password Baru (Opsional)" : "Password Sementara"}
          </label>
          <input
            type="password"
            placeholder={editId ? "Kosongkan jika tidak ingin diubah" : "Minimal 8 karakter"}
            value={form.password || ""}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-red"
          />
        </div>
      </AdminFormCard>

      {/* Table Component */}
      <AdminTable
        loading={loading}
        data={filteredUsers}
        columns={columns}
        editId={editId}
        emptyMessage={
          searchTerm || roleFilter !== "all"
            ? "Tidak ada user yang cocok dengan pencarian atau filter."
            : "Belum ada user terdaftar di database."
        }
      />

      {/* Modal Preview Detail */}
      <AdminModal
        isOpen={Boolean(previewUser)}
        onClose={() => setPreviewUser(null)}
        title="Detail Akun User"
      >
        {previewUser && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-red/10 text-red flex items-center justify-center font-bold text-base uppercase">
                {previewUser.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{previewUser.name}</h4>
                <p className="text-gray-500">{previewUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-400 block mb-1">User ID</span>
                <span className="font-mono font-bold text-gray-800">{previewUser.id}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-400 block mb-1">Role</span>
                <span className="font-bold text-red uppercase">{previewUser.role}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 col-span-2">
                <span className="text-[11px] text-gray-400 block mb-1">Created At</span>
                <span className="font-medium text-gray-700">
                  {new Date(previewUser.createdAt).toLocaleString("id-ID")}
                </span>
              </div>
              {previewUser.password_hash && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 col-span-2">
                  <span className="text-[11px] text-gray-400 block mb-1">Password Hash (Security)</span>
                  <span className="font-mono text-[10px] text-gray-600 break-all">
                    {previewUser.password_hash}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewUser(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
