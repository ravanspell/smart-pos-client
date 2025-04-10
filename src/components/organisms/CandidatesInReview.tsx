'use client';

import { useState } from 'react';
import { DataTable } from '@/components/molecules/DataTable/DataTable';
import { ColumnDef, SortingState, PaginationState, RowSelectionState } from '@tanstack/react-table';
import { Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Candidate, useGetCandidatesInReviewQuery } from '@/redux/api/candidatesApi';

function CandidatesInReview() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading, error } = useGetCandidatesInReviewQuery({
    status: 'REVIEWING,PROCESSING',
    page: pagination.pageIndex + 1, // API uses 1-based pagination
    limit: pagination.pageSize,
  });

  const candidates = data?.data?.candidates || [];
  const totalCount = data?.data?.total || 0;

  const columns: ColumnDef<Candidate>[] = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const candidate = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* TODO: Implement view */}}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* TODO: Implement edit */}}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* TODO: Implement delete */}}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading candidates</div>;
  }

  if (candidates.length === 0) {
    return null; // Don't show the section if there are no candidates
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Candidates in Review</h2>
      <DataTable
        data={candidates}
        columns={columns}
        totalCount={totalCount}
        loading={isLoading}
        sorting={sorting}
        pagination={pagination}
        onSortingChange={setSorting}
        onPaginationChange={setPagination}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        enableRowSelection={true}
      />
    </section>
  );
} 

export default CandidatesInReview;