import React, { ReactNode } from "react";
import { PlusIcon } from "./Icons";

interface AdminActionBarProps {
  title: string;
  isAddMode: boolean;
  onAddClick: () => void;
  addLabel?: string;
  closeLabel?: string;
  searchSlot?: ReactNode;
  filterSlot?: ReactNode;
}

export default function AdminActionBar({
  title,
  isAddMode,
  onAddClick,
  addLabel = "Tambah Data Baru",
  closeLabel = "Tutup Form",
  searchSlot,
  filterSlot,
}: AdminActionBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
      <div>
        <h2 className="font-jakarta font-bold text-base text-gray-900">
          {title}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {searchSlot}
        {filterSlot}

        <button
          type="button"
          onClick={onAddClick}
          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer font-jakarta ${
            isAddMode
              ? "bg-red/10 hover:bg-red/20 text-red border border-red/30"
              : "bg-red hover:bg-red/90 text-white shadow-xs"
          }`}
        >
          <span className={`transition-transform duration-300 ${isAddMode ? "rotate-45" : "rotate-0"}`}>
            <PlusIcon className="w-4 h-4" />
          </span>
          <span>{isAddMode ? closeLabel : addLabel}</span>
        </button>
      </div>
    </div>
  );
}
