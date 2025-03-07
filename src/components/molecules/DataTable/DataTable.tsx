"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/Table"
import { CustomPagination } from "../Pagination"
import { Checkbox } from "@/components/atoms/CheckBox"

// Generic interface for data fetching parameters
export interface DataFetchParams<TData> {
  page: number
  pageSize: number
  sortField?: keyof TData | string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}

// Result structure from the backend
export interface DataFetchResult<TData> {
  data: TData[]
  totalCount: number
  pageCount: number
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  className?: string
  totalCount: number
  data: TData[]
  enableRowSelection?: boolean
  onSortingChange?: (updater: Updater<SortingState>) => void
  onPaginationChange: (updater: Updater<PaginationState>) => void
  onColumnFiltersChange?: (updater: Updater<ColumnFiltersState>) => void
  onColumnVisibilityChange?: (updater: Updater<VisibilityState>) => void
  onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void
  loading: boolean
  /**
   * Table states
   */
  sorting: SortingState
  pagination: PaginationState
  columnFilters?: ColumnFiltersState
  columnVisibility?: VisibilityState
  rowSelection?: RowSelectionState
}

export function DataTable<TData>({
  columns: userColumns,
  // fetchData,
  data,
  className,
  totalCount,
  onSortingChange,
  onPaginationChange,
  onColumnFiltersChange,
  onColumnVisibilityChange,
  onRowSelectionChange,
  loading,
  /**
   * Table states
   */
  sorting,
  pagination,
  columnFilters,
  columnVisibility,
  rowSelection,
  enableRowSelection,
}: DataTableProps<TData>) {

  /**
   * Add selection column to the beginning of the columns array 
   * if row selection is enabled
   */
  const columns = React.useMemo(() => {
    if (!enableRowSelection) {
      return userColumns;
    }

    const selectionColumn: ColumnDef<TData> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }

    return [selectionColumn, ...userColumns]
  }, [userColumns, enableRowSelection])

  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableRowSelection: enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: onSortingChange,
    onPaginationChange: onPaginationChange,
    onColumnFiltersChange: onColumnFiltersChange,
    onColumnVisibilityChange: onColumnVisibilityChange,
    onRowSelectionChange: onRowSelectionChange,
    rowCount: totalCount,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className={`w-full ${className}`}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <CustomPagination
            totalRecords={totalCount}
            itemsPerPage={pagination.pageSize}
            currentPage={pagination.pageIndex + 1}
            onPageChange={(page) => table.setPageIndex(page - 1)}
          />
        </div>
      </div>
    </div>
  )
}