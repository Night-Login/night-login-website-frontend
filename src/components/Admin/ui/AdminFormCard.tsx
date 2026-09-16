import React, { ReactNode, FormEvent } from "react";

interface AdminFormCardProps {
  isOpen: boolean;
  title: string;
  editId?: string | number | null;
  actionLoading?: boolean;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  submitTextAdd?: string;
  submitTextEdit?: string;
  gridCols?: string;
  children: ReactNode;
}

export default function AdminFormCard({
  isOpen,
  title,
  editId,
  actionLoading = false,
  onSubmit,
  onCancel,
  submitTextAdd = "Simpan",
  submitTextEdit = "Simpan Perubahan",
  gridCols = "md:grid-cols-2",
  children,
}: AdminFormCardProps) {
  if (!isOpen) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-red/30 shadow-sm mb-6 transition-all">
      <h3 className="font-bold text-sm text-red mb-4 border-b border-gray-100 pb-2 flex items-center justify-between font-jakarta">
        <span>
          {editId ? `Form Edit ${title} (ID: ${editId})` : `Form Tambah ${title}`}
        </span>
        {editId && (
          <span className="text-xs font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Mode Edit
          </span>
        )}
      </h3>

      <form onSubmit={onSubmit} className={`grid grid-cols-1 ${gridCols} gap-4 text-xs font-jakarta`}>
        {children}

        <div
          className={`col-span-1 ${
            gridCols === "md:grid-cols-2"
              ? "md:col-span-2"
              : gridCols === "md:grid-cols-3"
              ? "md:col-span-3"
              : "md:col-span-1"
          } flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100`}
        >
          <button
            type="button"
            disabled={actionLoading}
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors rounded-lg font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={actionLoading}
            className="px-4 py-2 bg-red hover:bg-red/90 transition-colors text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px] cursor-pointer shadow-xs"
          >
            {actionLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : editId ? (
              submitTextEdit
            ) : (
              submitTextAdd
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
