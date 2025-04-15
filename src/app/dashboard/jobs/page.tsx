"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/molecules/DataTable/DataTable';
import { ColumnDef, SortingState, PaginationState, RowSelectionState } from '@tanstack/react-table';
import { Button } from '@/components/atoms/Button';
import { PlusIcon, Eye, Pencil, Trash } from 'lucide-react';
import { useGetJobsQuery } from '@/redux/api/jobsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { SortableColumnHeader } from '@/components/molecules/SortableColumnHeader';

// Define the job type for the table
interface Job {
  id: string;
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  industry: string;
  isRemote: boolean;
  createdAt: string;
  updatedAt: string;
}

const JobsPage = () => {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Fetch jobs data
  const { data, isLoading } = useGetJobsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
console.log("data", data);

  // Extract jobs from the response
  const jobs: Job[] = (data || []) as Job[];
  const totalCount = jobs.length; // Since we don't have a total count in the response

  // Define columns for the jobs table
  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Job Title" />
      ),
    },
    {
      accessorKey: 'location',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Location" />
      ),
    },
    {
      accessorKey: 'industry',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Industry" />
      ),
    },
    {
      accessorKey: 'salaryMin',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Min Salary" />
      ),
      cell: ({ row }) => {
        const salary = row.getValue('salaryMin') as number;
        return <span>${salary.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: 'salaryMax',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Max Salary" />
      ),
      cell: ({ row }) => {
        const salary = row.getValue('salaryMax') as number;
        return <span>${salary.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: 'isRemote',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Remote" />
      ),
      cell: ({ row }) => {
        const isRemote = row.getValue('isRemote') as boolean;
        return <span>{isRemote ? 'Yes' : 'No'}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/dashboard/jobs/edit/${job.id}`)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Implement delete functionality
                console.log('Delete job:', job.id);
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
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Job Postings</CardTitle>
          <Button onClick={() => router.push('/dashboard/jobs/create')}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={jobs}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default JobsPage; 