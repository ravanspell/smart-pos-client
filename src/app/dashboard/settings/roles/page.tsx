"use client"

import {
    ColumnDef,
    PaginationState,
    RowSelectionState,
    SortingState
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/atoms/Button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/atoms/DropdownMenu"
import { SortableColumnHeader } from "@/components/molecules/SortableColumnHeader"
import { DataTable } from "@/components/molecules/DataTable/DataTable"
import { Role } from "@/types/roles"
import { useGetRolesQuery } from "@/redux/api/rolesAPI"
import { useMemo, useState } from "react"

// Define columns for Role data
export const roleColumns: ColumnDef<Role>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <SortableColumnHeader column={column} title="Role Name" />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <SortableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const role = row.original
            // TODO: add actions for the role
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(role.id)}
                        >
                            Copy role ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit role</DropdownMenuItem>
                        <DropdownMenuItem>Delete role</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function RolesTable() {
    // Set up state for the table
    const [sorting, setSorting] = useState<SortingState>([
        { id: "name", desc: false },
    ])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    // Extract query parameters from the table state
    const queryParams = useMemo(() => {
        const params: {
            page: number
            pageSize: number
            sortField?: string
            sortOrder?: "asc" | "desc"
            filters?: Record<string, any>
        } = {
            page: pagination.pageIndex + 1, // Convert to 1-based for API
            pageSize: pagination.pageSize,
        }

        // Add sorting if present
        if (sorting.length > 0) {
            params.sortField = sorting[0].id
            params.sortOrder = sorting[0].desc ? "desc" : "asc"
        }

        return params
    }, [pagination, sorting])

    // Fetch data using RTK Query
    const { data, isLoading, isFetching } = useGetRolesQuery(queryParams)

    // Handle selected roles actions
    const handleBulkDelete = () => {
        const selectedRoleIds = Object.keys(rowSelection)
        if (selectedRoleIds.length === 0) return

        console.log("Deleting roles:", selectedRoleIds)
        // Implement your delete logic here
        // Could call a mutation from RTK Query
    }
    // Calculate if we have selected items
    const hasSelected = Object.keys(rowSelection).length > 0

    return (
        <div className="mx-auto">
            <h1 className="text-2xl font-bold mb-4">Roles Management</h1>
            <div className="flex items-center justify-end mb-2">
                {hasSelected && (
                    <Button
                        variant="destructive"
                        onClick={handleBulkDelete}
                    >
                        Delete Selected
                    </Button>
                )}
            </div>
            <DataTable
                columns={roleColumns}
                data={data?.items || []}
                loading={isLoading}
                totalCount={data?.meta?.totalItems || 0}
                sorting={sorting}
                pagination={pagination}
                onPaginationChange={setPagination}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                onSortingChange={setSorting}
                enableRowSelection
            />
        </div>
    )
}