"use client"

import {
    ColumnDef,
    PaginationState,
    RowSelectionState,
    SortingState
} from "@tanstack/react-table"
import { Button } from "@/components/atoms/Button"
import { DataTable } from "@/components/molecules/DataTable/DataTable"
import { useGetRolesQuery } from "@/redux/api/rolesAPI"
import { lazy, useMemo, useState } from "react"
import { PlusIcon } from "@radix-ui/react-icons"
import { MoreHorizontal } from "lucide-react"
import Modal from "@/components/molecules/Modal"
import { Role } from "@/types/roles"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/atoms/DropdownMenu"
import { SortableColumnHeader } from "@/components/molecules/SortableColumnHeader"

const CreateRoleForm = lazy(() => import("./CreateRoleForm"))

export default function RolesTable() {
    // Set up state for the table
    const [isAddingRole, setIsAddingRole] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([
        { id: "name", desc: false },
    ])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    // Define columns for Role data
    const columns = useMemo<ColumnDef<Role>[]>(() => [
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
                const copyToClipboard = () => {
                    if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(role.id)
                    }
                }
                
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={copyToClipboard}>
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
    ], [])

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
                <Button
                    onClick={() => setIsAddingRole(true)}
                >
                    <PlusIcon className="w-4 h-4" /> Add Role
                </Button>
            </div>
            <DataTable
                columns={columns}
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
            {isAddingRole &&
                <Modal
                    isOpen={isAddingRole}
                    onClose={() => setIsAddingRole(false)}
                    title="Add Role"
                    description="Add a new role to the system"
                    isLoading={false}
                >
                    <CreateRoleForm
                        onClose={() => setIsAddingRole(false)}
                    />
                </Modal>
            }
        </div>
    )
}