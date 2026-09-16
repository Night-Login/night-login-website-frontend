import React, { ReactNode, HTMLAttributes } from "react";

export interface ColumnDef<T> {
  header: string;
  key?: keyof T | string;
  className?: string;
  headerClassName?: string;
  render?: (item: T, index: number) => ReactNode;
}

interface AdminTableProps<T> {
  loading?: boolean;
  data: T[];
  columns: ColumnDef<T>[];
  emptyMessage?: string;
  editId?: string | number | null;
  getRowProps?: (item: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
}

export default function AdminTable<T extends { id?: string | number }>({
  loading,
  data,
  columns,
  emptyMessage = "Belum ada data di database backend.",
  editId,
  getRowProps,
}: AdminTableProps<T>) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      {loading ? (
        <div className="py-12 text-center text-gray-500 font-medium text-sm font-jakarta">
          <div className="inline-block w-6 h-6 border-2 border-red border-t-transparent rounded-full animate-spin mr-2 align-middle"></div>
          Memuat data dari database...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-jakarta">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase tracking-wider font-semibold">
                {columns.map((col, idx) => (
                  <th key={idx} className={`p-3.5 ${col.headerClassName || ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-gray-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => {
                  const customProps = getRowProps ? getRowProps(item, idx) : {};
                  const isBeingEdited = editId !== undefined && editId !== null && item.id === editId;
                  return (
                    <tr
                      key={item.id || idx}
                      {...customProps}
                      className={`hover:bg-gray-50/80 transition-colors ${
                        isBeingEdited ? "bg-red/5 border-l-4 border-l-red" : ""
                      } ${customProps.className || ""}`}
                    >
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className={`p-3.5 ${col.className || ""}`}>
                          {col.render
                            ? col.render(item, idx)
                            : col.key
                            ? (item as Record<string, unknown>)[col.key as string] as ReactNode
                            : null}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
