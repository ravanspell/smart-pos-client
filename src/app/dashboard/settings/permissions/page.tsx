"use client";

import React, { useState } from 'react';
import { DataTable } from '@/components/molecules/DataTable/DataTable';
import { Button } from '@/components/atoms/Button';
import { Separator } from '@/components/ui/separator';
import {
    ColumnDef,
    SortingState,
    RowSelectionState,
    ColumnFiltersState,
    VisibilityState
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load the form component
const PermissionCategoryForm = dynamic(
    () => import('@/components/organisms/PermissionCategoryForm'),
    { ssr: false }
);

// Define the permission category type
interface PermissionCategory {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

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
    // State for pagination and sorting
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock data - replace with actual API call
    const mockData: PermissionCategory[] = [
        {
            id: '1',
            name: 'User Management',
            description: 'Permissions related to user management',
            createdAt: '2023-01-01',
        },
        {
            id: '2',
            name: 'Content Management',
            description: 'Permissions related to content management',
            createdAt: '2023-01-02',
        },
    ];

    // Mock total count - replace with actual count from API
    const totalCount = mockData.length;

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
                        data={mockData}
                        totalCount={totalCount}
                        pagination={pagination}
                        sorting={sorting}
                        columnFilters={columnFilters}
                        columnVisibility={columnVisibility}
                        rowSelection={rowSelection}
                        onPaginationChange={setPagination}
                        onSortingChange={setSorting}
                        onColumnFiltersChange={setColumnFilters}
                        onColumnVisibilityChange={setColumnVisibility}
                        onRowSelectionChange={setRowSelection}
                        loading={false}
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
