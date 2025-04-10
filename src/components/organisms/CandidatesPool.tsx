'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/molecules/DataTable/DataTable';
import { Candidate } from '@/types/candidate';
import { ColumnDef, SortingState, PaginationState, RowSelectionState } from '@tanstack/react-table';
import { Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

function CandidatesPool() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    // Dummy data for candidates
    const dummyCandidates: any[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/john-smith.pdf',
        createdAt: new Date('2024-03-15').toISOString(),
        updatedAt: new Date('2024-03-15').toISOString(),
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/sarah-johnson.pdf',
        createdAt: new Date('2024-03-14').toISOString(),
        updatedAt: new Date('2024-03-14').toISOString(),
      },
      {
        id: '3',
        name: 'Michael Chen',
        email: 'm.chen@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/michael-chen.pdf',
        createdAt: new Date('2024-03-13').toISOString(),
        updatedAt: new Date('2024-03-13').toISOString(),
      },
      {
        id: '4',
        name: 'Emily Brown',
        email: 'emily.b@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/emily-brown.pdf',
        createdAt: new Date('2024-03-12').toISOString(),
        updatedAt: new Date('2024-03-12').toISOString(),
      },
      {
        id: '5',
        name: 'David Wilson',
        email: 'd.wilson@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/david-wilson.pdf',
        createdAt: new Date('2024-03-11').toISOString(),
        updatedAt: new Date('2024-03-11').toISOString(),
      },
      {
        id: '6',
        name: 'Lisa Anderson',
        email: 'lisa.a@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/lisa-anderson.pdf',
        createdAt: new Date('2024-03-10').toISOString(),
        updatedAt: new Date('2024-03-10').toISOString(),
      },
      {
        id: '7',
        name: 'James Taylor',
        email: 'j.taylor@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/james-taylor.pdf',
        createdAt: new Date('2024-03-09').toISOString(),
        updatedAt: new Date('2024-03-09').toISOString(),
      },
      {
        id: '8',
        name: 'Maria Garcia',
        email: 'm.garcia@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/maria-garcia.pdf',
        createdAt: new Date('2024-03-08').toISOString(),
        updatedAt: new Date('2024-03-08').toISOString(),
      },
      {
        id: '9',
        name: 'Robert Lee',
        email: 'r.lee@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/robert-lee.pdf',
        createdAt: new Date('2024-03-07').toISOString(),
        updatedAt: new Date('2024-03-07').toISOString(),
      },
      {
        id: '10',
        name: 'Patricia White',
        email: 'p.white@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/patricia-white.pdf',
        createdAt: new Date('2024-03-06').toISOString(),
        updatedAt: new Date('2024-03-06').toISOString(),
      },
      {
        id: '11',
        name: 'Thomas Moore',
        email: 't.moore@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/thomas-moore.pdf',
        createdAt: new Date('2024-03-05').toISOString(),
        updatedAt: new Date('2024-03-05').toISOString(),
      },
      {
        id: '12',
        name: 'Jennifer Davis',
        email: 'j.davis@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/jennifer-davis.pdf',
        createdAt: new Date('2024-03-04').toISOString(),
        updatedAt: new Date('2024-03-04').toISOString(),
      },
      {
        id: '13',
        name: 'William Clark',
        email: 'w.clark@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/william-clark.pdf',
        createdAt: new Date('2024-03-03').toISOString(),
        updatedAt: new Date('2024-03-03').toISOString(),
      },
      {
        id: '14',
        name: 'Elizabeth Hall',
        email: 'e.hall@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/elizabeth-hall.pdf',
        createdAt: new Date('2024-03-02').toISOString(),
        updatedAt: new Date('2024-03-02').toISOString(),
      },
      {
        id: '15',
        name: 'Daniel Young',
        email: 'd.young@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/daniel-young.pdf',
        createdAt: new Date('2024-03-01').toISOString(),
        updatedAt: new Date('2024-03-01').toISOString(),
      },
      {
        id: '16',
        name: 'Nancy King',
        email: 'n.king@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/nancy-king.pdf',
        createdAt: new Date('2024-02-29').toISOString(),
        updatedAt: new Date('2024-02-29').toISOString(),
      },
      {
        id: '17',
        name: 'Christopher Wright',
        email: 'c.wright@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/christopher-wright.pdf',
        createdAt: new Date('2024-02-28').toISOString(),
        updatedAt: new Date('2024-02-28').toISOString(),
      },
      {
        id: '18',
        name: 'Margaret Scott',
        email: 'm.scott@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/margaret-scott.pdf',
        createdAt: new Date('2024-02-27').toISOString(),
        updatedAt: new Date('2024-02-27').toISOString(),
      },
      {
        id: '19',
        name: 'Joseph Green',
        email: 'j.green@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/joseph-green.pdf',
        createdAt: new Date('2024-02-26').toISOString(),
        updatedAt: new Date('2024-02-26').toISOString(),
      },
      {
        id: '20',
        name: 'Susan Baker',
        email: 's.baker@example.com',
        status: 'IDLE',
        resumeUrl: '/resumes/susan-baker.pdf',
        createdAt: new Date('2024-02-25').toISOString(),
        updatedAt: new Date('2024-02-25').toISOString(),
      },
    ];

    setCandidates(dummyCandidates);
    setLoading(false);
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
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          enableRowSelection={true}
        />
      )}
    </section>
  );
}

export default CandidatesPool;