"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetJobByIdQuery } from '@/redux/api/jobsApi';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteJobMutation } from '@/redux/api/jobsApi';
import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { JOBS_ROUTE } from '@/constants/routes';

const JobDetailsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');

  // Fetch job details
  const { data: jobResponse, isLoading, error } = useGetJobByIdQuery(jobId || '', {
    skip: !jobId,
  });
  const [deleteJob] = useDeleteJobMutation();

  // Breadcrumb setup for page
  useBreadcrumb([{
    label: 'Jobs',
    href: JOBS_ROUTE
  },
  {
    label: jobResponse?.data?.title || '',
    href: ''
  }
  ]);

  const job = jobResponse?.data;

  // Handle job deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId || '').unwrap();
        toast.success('Job deleted successfully');
        router.push(JOBS_ROUTE);
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading job data...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>Failed to load job data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-end">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/jobs/edit/${jobId}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Created on {format(new Date(job.createdAt), 'PPP')}
            </p>
          </div>
          <Badge variant={job.isRemote ? "secondary" : "outline"}>
            {job.isRemote ? "Remote" : "On-site"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p>{job.location || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Industry</h3>
              <p>{job.industry || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Salary Range</h3>
              <p>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Last Updated</h3>
              <p>{format(new Date(job.updatedAt), 'PPP')}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold mb-2">Job Description</h3>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetailsPage; 