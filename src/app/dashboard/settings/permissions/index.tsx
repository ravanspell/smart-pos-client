"use client";

import React, { useState } from 'react';
import { DataTable } from '@/components/molecules/DataTable/DataTable';
import { Button } from '@/components/atoms/Button';
import { Separator } from '@/components/ui/separator';
import {
    ColumnDef,
    RowSelectionState,
    ColumnFiltersState,
    VisibilityState,
    PaginationState,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useGetPermissionsQuery } from '@/redux/api/permissionsAPI';
import { Permission } from '@/redux/api/permissionsAPI';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const PermissionForm = dynamic(
    () => import('@/components/organisms/PermissionForm'),
    { ssr: false }
);

// Define columns for the data table
const columns: ColumnDef<Permission>[] = [
    {
        accessorKey: 'displayName',
        header: 'Display Name',
    },
    {
        accessorKey: 'permissionKey',
        header: 'Permission Key',
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'categoryName',
        header: 'Category',
    }
];

const PermissionsPageSection: React.FC = () => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const { handleError } = useErrorHandler();
    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Fetch permissions from the API with pagination
    const { data, isLoading, error } = useGetPermissionsQuery({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    if (error) {
        handleError(error);
    }

    // Extract permissions and pagination data
    const permissions = data?.items || [];
    const totalCount = data?.meta?.totalItems || 0;

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Permissions</h2>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Permission
                    </Button>
                </div>
                <Separator />
                <div className="mt-4">
                    <DataTable
                        columns={columns}
                        data={permissions}
                        totalCount={totalCount}
                        columnFilters={columnFilters}
                        columnVisibility={columnVisibility}
                        rowSelection={rowSelection}
                        onColumnFiltersChange={setColumnFilters}
                        onColumnVisibilityChange={setColumnVisibility}
                        onRowSelectionChange={setRowSelection}
                        onPaginationChange={setPagination}
                        pagination={pagination}
                        loading={isLoading}
                        enableRowSelection={true}
                    />
                </div>
            </div>
            {/* Modal for adding new permission */}
            {isModalOpen && (
                <PermissionForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default PermissionsPageSection; 