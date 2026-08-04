import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils/cn';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';

/* ---------- Semantic primitives (for hand-built tables) ---------- */

export function Table({ className, children, ...props }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <table className={cn('w-full border-collapse text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }) {
  return (
    <thead className={cn('bg-canvas', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }) {
  return (
    <tbody className={cn('divide-y divide-border', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }) {
  return (
    <tr className={cn('transition-colors hover:bg-canvas/70', className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }) {
  return (
    <th
      className={cn(
        'whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }) {
  return (
    <td className={cn('whitespace-nowrap px-4 py-3 text-ink', className)} {...props}>
      {children}
    </td>
  );
}

/* ---------- DataTable (TanStack-powered, sortable) ---------- */

/**
 * DataTable — sortable table built on @tanstack/react-table.
 * Pass `columns` in TanStack's columnDef shape. Handles its own loading
 * skeleton and empty state so pages don't reimplement either.
 */
export function DataTable({ columns, data, isLoading = false, emptyTitle = 'No records found', emptyDescription }) {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return <LoadingSkeleton variant="table" rows={6} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const sortState = header.column.getIsSorted();
              const canSort = header.column.getCanSort();
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : canSort ? (
                    <button
                      className="inline-flex items-center gap-1 hover:text-ink"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sortState === 'asc' && <ArrowUp className="h-3 w-3" />}
                      {sortState === 'desc' && <ArrowDown className="h-3 w-3" />}
                      {!sortState && <ArrowUpDown className="h-3 w-3 opacity-40" />}
                    </button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              );
            })}
          </tr>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
