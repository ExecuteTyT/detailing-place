"use client";

import React from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export type { Column, DataTableProps };

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const hasActions = !!onEdit || !!onDelete;

  return (
    <div className="overflow-x-auto rounded-xl border border-[#333333]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#252525]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-[#A0A0A0] font-medium border-b border-[#333333]"
              >
                {col.label}
              </th>
            ))}
            {hasActions && (
              <th className="text-right px-4 py-3 text-[#A0A0A0] font-medium border-b border-[#333333]">
                Действия
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="px-4 py-8 text-center text-[#A0A0A0]"
              >
                Нет данных
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-[#333333] last:border-b-0 hover:bg-[#252525]/50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-[#F5F5F5]">
                    {col.render
                      ? col.render(item)
                      : (item[col.key] as React.ReactNode) ?? "—"}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#333333] text-[#00F0FF] hover:bg-[#252525] transition-colors"
                        >
                          Изменить
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#333333] text-[#FF4444] hover:bg-[#FF4444]/10 transition-colors"
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
