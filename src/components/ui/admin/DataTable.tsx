import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableColumn } from '@/types/ui';
import { LoadingSkeleton } from '@/components/ui/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/ui/feedback/EmptyState';

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching the current filter parameters.',
  onRowClick,
  pagination,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn('bg-white border border-border overflow-hidden', className)}>
        <div className="p-4 border-b border-border bg-canvas/30">
          <LoadingSkeleton height={20} width="30%" />
        </div>
        <div className="p-4 space-y-3">
          <LoadingSkeleton height={44} count={5} />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  return (
    <div className={cn('bg-white border border-border overflow-hidden flex flex-col', className)}>
      <div className="overflow-x-auto admin-scrollbar">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-border bg-canvas/50 text-[11px] uppercase tracking-wider text-ink-muted">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'py-3 px-4 font-semibold whitespace-nowrap',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {data.map((row, idx) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  'transition-colors duration-150',
                  onRowClick ? 'cursor-pointer hover:bg-canvas/40' : 'hover:bg-canvas/20'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'py-3.5 px-4 text-ink align-middle',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                      col.className
                    )}
                  >
                    {col.render ? col.render(row, idx) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="py-3 px-4 border-t border-border bg-canvas/20 flex items-center justify-between text-xs text-ink-muted">
          <span>
            Showing page <strong className="text-ink">{pagination.currentPage}</strong> of{' '}
            <strong className="text-ink">{pagination.totalPages}</strong> ({pagination.totalItems} records)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="p-1.5 border border-border bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-canvas transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="p-1.5 border border-border bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-canvas transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
