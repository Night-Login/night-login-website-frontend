"use client";

import React, { useState } from "react";
import type { User, UserRole } from "@/modules/admin/types";
import { initialAdminData } from "@/modules/admin/data/mockData";
import AdminActionBar from "@/components/Admin/ui/AdminActionBar";
import AdminFormCard from "@/components/Admin/ui/AdminFormCard";
import AdminTable, { type ColumnDef } from "@/components/Admin/ui/AdminTable";
import AdminModal from "@/components/Admin/ui/AdminModal";
import { EditIcon, TrashIcon, EyeIcon } from "@/components/Admin/ui/Icons";

// Initial form state
const emptyForm = {
  name: "",
  email: "",
  role: "admin" as UserRole | string,
  password: "",
};

export default function UsersManager() {
  // 1. State
  const [users, setUsers] = useState<User[]>(initialAdminData.users);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [previewUser, setPreviewUser] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);

  // 2. Handlers
  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  // Edit user (uses the same form as Add)
  const handleEdit = (user: User) => {
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setEditId(user.id);
    setShowForm(true);
  };

  // Delete user
  const handleDelete = (id: string) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (editId === id) resetForm();
    }
  };

  // Submit (handles both Add and Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      // Edit mode: update existing user
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editId
            ? { ...u, name: form.name, email: form.email, role: form.role }
            : u
        )
      );
    } else {
      // Add mode: create new user
      const newUser: User = {
        id: `usr_${String(Date.now()).slice(-4)}`,
        name: form.name,
        email: form.email,
        role: form.role,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
    }

    resetForm();
  };

  // 3. Columns definition for AdminTable
  const columns: ColumnDef<User>[] = [
    {
      header: "User ID",
      key: "id",
      className: "font-mono font-semibold text-gray-700",
    },
    {
      header: "Nama",
      key: "name",
      className: "font-semibold text-gray-900",
    },
    {
      header: "Email",
      key: "email",
      className: "text-gray-600",
    },
    {
      header: "Role",
      key: "role",
      render: (user) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
            user.role === "admin"
              ? "bg-red/10 text-red"
              : user.role === "leader"
              ? "bg-blue-50 text-blue-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      header: "Tanggal Dibuat",
      key: "createdAt",
      render: (user) =>
        new Date(user.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      header: "Aksi",
      className: "text-right",
      headerClassName: "text-right",
      render: (user) => (
        <div className="flex items-center justify-end gap-1">
          {/* Preview action */}
          <button
            type="button"
            title="Preview User"
            onClick={() => setPreviewUser(user)}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          {/* Edit action */}
          <button
            type="button"
            title="Edit User"
            onClick={() => handleEdit(user)}
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg cursor-pointer"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          {/* Delete action */}
          <button
            type="button"
            title="Hapus User"
            onClick={() => handleDelete(user.id)}
            className="p-1.5 text-red hover:text-red/80 hover:bg-red/10 rounded-lg cursor-pointer"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="font-jakarta">
      {/* 1. Action Bar with Add Button */}
      <AdminActionBar
        title="Daftar Pengguna"
        isAddMode={showForm}
        onAddClick={() => {
          if (showForm) {
            resetForm();
          } else {
            resetForm();
            setShowForm(true);
          }
        }}
      />

      {/* 2. Add / Edit Form Card (Same Form used for both) */}
      <AdminFormCard
        isOpen={showForm}
        title="User"
        editId={editId}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Nama Lengkap *
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
            Email *
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
            Role Akun *
          </label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
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
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-red"
          />
        </div>
      </AdminFormCard>

      {/* 3. User Display Table */}
      <AdminTable
        data={users}
        columns={columns}
        editId={editId}
        emptyMessage="Belum ada user terdaftar."
      />

      {/* 4. Detail Preview Modal */}
      <AdminModal
        isOpen={Boolean(previewUser)}
        onClose={() => setPreviewUser(null)}
        title="Detail User"
      >
        {previewUser && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-400 block mb-1 text-[11px]">User ID</span>
              <span className="font-mono font-bold text-gray-800">{previewUser.id}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-400 block mb-1 text-[11px]">Nama Lengkap</span>
              <span className="font-semibold text-gray-800">{previewUser.name}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-400 block mb-1 text-[11px]">Email</span>
              <span className="text-gray-700">{previewUser.email}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-400 block mb-1 text-[11px]">Role</span>
              <span className="font-bold uppercase text-red">{previewUser.role}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-400 block mb-1 text-[11px]">Tanggal Dibuat</span>
              <span className="text-gray-700">
                {new Date(previewUser.createdAt).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
