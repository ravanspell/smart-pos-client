'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/molecules/DataTable/DataTable';
import { ColumnDef, SortingState, PaginationState, RowSelectionState } from '@tanstack/react-table';
import { Button } from '@/components/atoms/Button';
import { Eye, Pencil, Trash } from 'lucide-react';
import { useGetOrganizationsQuery } from '@/redux/api/organizationsAPI';
import { SortableColumnHeader } from '@/components/molecules/SortableColumnHeader';
import { RoundedAvatar } from '@/components/atoms/RoundedAvatar';
import { ORGANIZATION_DETAILS_ROUTE } from '@/constants/routes';

interface Organization {
  id: string;
  name: string;
  description: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
}

const OrganizationList = () => {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Fetch organizations data
  const { data, isLoading } = useGetOrganizationsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  // Extract organizations and pagination data from the response
  const organizations = data?.data?.items || [];
  const totalCount = data?.data?.total || 0;

  // Define columns for the organizations table
  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Organization" />
      ),
      cell: ({ row }) => {
        const organization = row.original;
        return (
          <div className="flex items-center gap-3">
            <RoundedAvatar
              imageUrl={organization.logo}
              size="md"
              alt={`${organization.name} logo`}
            />
            <span className="font-medium">{organization.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Description" />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const organization = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`${ORGANIZATION_DETAILS_ROUTE}?id=${organization.id}`)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/dashboard/organizations/${organization.id}/edit`)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Implement delete functionality
                console.log('Delete organization:', organization.id);
              }}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={organizations}
      totalCount={totalCount}
      sorting={sorting}
      pagination={pagination}
      onSortingChange={setSorting}
      onPaginationChange={setPagination}
      onRowSelectionChange={setRowSelection}
      rowSelection={rowSelection}
      loading={isLoading}
      enableRowSelection={true}
    />
  );
};

export default OrganizationList; 