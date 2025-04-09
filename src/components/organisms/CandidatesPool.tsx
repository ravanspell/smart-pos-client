'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/molecules/DataTable/DataTable';
import { Candidate } from '@/types/candidate';
import { ColumnDef, SortingState, PaginationState } from '@tanstack/react-table';
import { Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

function CandidatesPool() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    // TODO: Fetch candidates with IDLE status
    // This is a placeholder for the actual API call
    const fetchCandidates = async () => {
      try {
        // const response = await fetch('/api/candidates?status=IDLE');
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

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Candidate Pool</h2>
      {candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates yet</h3>
          <p className="text-sm text-gray-500 mb-4">Start adding new candidates to get started</p>
        </div>
      ) : (
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
      )}
    </section>
  );
}

export default CandidatesPool;