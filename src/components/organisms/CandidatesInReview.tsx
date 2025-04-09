'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/molecules/DataTable/DataTable';
import { ColumnDef, SortingState, PaginationState } from '@tanstack/react-table';
import { Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Candidate } from '@/types/candidate';

function CandidatesInReview() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    // TODO: Fetch candidates with REVIEWING status
    // This is a placeholder for the actual API call
    const fetchCandidates = async () => {
      try {
        // const response = await fetch('/api/candidates?status=REVIEWING');
        // const data = await response.json();
        // setCandidates(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const columns: ColumnDef<Candidate>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
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

  if (loading) {
    return <div>Loading...</div>;
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
        totalCount={candidates.length}
        loading={loading}
        sorting={sorting}
        pagination={pagination}
        onSortingChange={setSorting}
        onPaginationChange={setPagination}
      />
    </section>
  );
} 

export default CandidatesInReview;