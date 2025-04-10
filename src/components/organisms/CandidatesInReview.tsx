'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/molecules/DataTable/DataTable';
import { ColumnDef, SortingState, PaginationState, RowSelectionState } from '@tanstack/react-table';
import { Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Candidate, useGetCandidatesInReviewQuery } from '@/redux/api/candidatesApi';
import { useRouter } from 'next/navigation';

const POLLING_INTERVAL = 4000;
const PAGE_SIZE = 10;
const PAGE_INDEX = 0;

const CANDIDATES_STATUS = {
  REVIEWING: 'REVIEWING',
  PROCESSING: 'PROCESSING',
}

function CandidatesInReview() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_INDEX,
    pageSize: PAGE_SIZE,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [shouldPoll, setShouldPoll] = useState(false);
  const router = useRouter();
  const { data, isLoading, error } = useGetCandidatesInReviewQuery({
    status: `${CANDIDATES_STATUS.REVIEWING},${CANDIDATES_STATUS.PROCESSING}`,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  }, {
    pollingInterval: shouldPoll ? POLLING_INTERVAL : 0, // Poll every 4 seconds when shouldPoll is true
  });

  const candidates = data?.data?.candidates || [];
  const totalCount = data?.data?.total || 0;

  // Check if any candidate has 'PROCESSING' status
  useEffect(() => {
    if (candidates.length > 0) {
      const hasProcessingCandidates = candidates.some(
        candidate => candidate.status === CANDIDATES_STATUS.PROCESSING
      );
      setShouldPoll(hasProcessingCandidates);
    } else {
      setShouldPoll(false);
    }
  }, [candidates]);

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
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div className={`flex items-center gap-1 ${
            status === CANDIDATES_STATUS.PROCESSING ? 'text-amber-500' : 'text-green-500'
          }`}>
            {status === CANDIDATES_STATUS.PROCESSING && (
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            )}
            {status}
          </div>
        );
      },
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
              onClick={() => {
                router.push(`/dashboard/candidates/details?id=${candidate.id}`);
              }}
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

  if (isLoading && candidates.length === 0) {
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
      <h2 className="text-xl font-semibold mb-4">
        Candidates in Review
      </h2>
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