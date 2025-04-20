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
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useGetPermissionCategoriesQuery } from '@/redux/api/permissionsAPI';
import { PermissionCategory } from '@/redux/api/permissionsAPI';
import { useErrorHandler } from '@/hooks/useErrorHandler';

// Lazy load the form component
const PermissionCategoryForm = dynamic(
    () => import('@/components/organisms/PermissionCategoryForm'),
    { ssr: false }
);

// Define columns for the data table
const columns: ColumnDef<PermissionCategory>[] = [
    {
        accessorKey: 'name',
        header: 'Category Name',
    },
    {
        accessorKey: 'description',
        header: 'Description',
    }
];

const PermissionsPage: React.FC = () => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const { handleError } = useErrorHandler();
    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Fetch permission categories from the API
    const { data: permissionCategories = [], isLoading, error } = useGetPermissionCategoriesQuery();

    if (error) {
        handleError(error);
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Permission Categories</h2>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Permission Category
                    </Button>
                </div>
                <Separator />
                <div className="mt-4">
                    <DataTable
                        columns={columns}
                        data={permissionCategories}
                        totalCount={permissionCategories.length}
                        columnFilters={columnFilters}
                        columnVisibility={columnVisibility}
                        rowSelection={rowSelection}
                        onColumnFiltersChange={setColumnFilters}
                        onColumnVisibilityChange={setColumnVisibility}
                        onRowSelectionChange={setRowSelection}
                        loading={isLoading}
                        enableRowSelection={true}
                    />
                </div>
            </div>
            {/* Modal for adding new permission category */}
            {isModalOpen && (
                <PermissionCategoryForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default PermissionsPage;
