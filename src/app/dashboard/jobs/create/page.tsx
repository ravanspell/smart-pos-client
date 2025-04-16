"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/atoms/Form';
import { CustomFormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';
import Editor from '@/components/molecules/RichTextEditor/Editor';
import { Switch } from '@/components/atoms/Switch';
import { SubmitButton } from '@/components/molecules/SubmitButton';
import { useCreateJobMutation } from '@/redux/api/jobsApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { JOB_DETAILS_ROUTE } from '@/constants/routes';
import { CheckCircleIcon } from 'lucide-react';

// Define the Zod schema
const jobFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.any().optional(),
  salaryMin: z.string().default('0'),
  salaryMax: z.string().default('0'),
  location: z.string().optional(),
  industry: z.string().optional(),
  isRemote: z.boolean().default(true),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

const JobDashboard = () => {
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const [createJob, { isLoading }] = useCreateJobMutation();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: {},
      salaryMin: '0',
      salaryMax: '0',
      location: '',
      industry: '',
      isRemote: true,
    },
  });

  const onSubmit = async (data: JobFormValues): Promise<void> => {
    try {
      // Format the description to match the API expected format
      const formattedData = {
        ...data,
        description: data.description,
        // Ensure salaryMin and salaryMax are always numbers
        salaryMin: Number(data.salaryMin) || 0,
        salaryMax: Number(data.salaryMax) || 0,
      };
      const response = await createJob(formattedData).unwrap();
      toast.success('Job posting created successfully', {
        icon: <CheckCircleIcon className="w-4 h-4" />,
      });
      router.push(`${JOB_DETAILS_ROUTE}?id=${response.id}`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Job Posting</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CustomFormField
            name="title"
            label="Job Title"
          >
            <Input placeholder="Enter job title" />
          </CustomFormField>

          <div className="grid grid-cols-2 gap-4">
            <CustomFormField
              name="salaryMin"
              label="Minimum Salary"
            >
              <Input
                placeholder="Enter minimum salary"
                onChange={(e) => {
                  const value = e.target.value;
                  form.setValue('salaryMin', value);
                }}
              />
            </CustomFormField>

            <CustomFormField
              name="salaryMax"
              label="Maximum Salary"
            >
              <Input

                placeholder="Enter maximum salary"
                onChange={(e) => {
                  const value = e.target.value;
                  form.setValue('salaryMax', value);
                }}
              />
            </CustomFormField>
          </div>

          <CustomFormField
            name="location"
            label="Location"
          >
            <Input placeholder="Enter job location" />
          </CustomFormField>

          <CustomFormField
            name="industry"
            label="Industry"
          >
            <Input placeholder="Enter industry" />
          </CustomFormField>

          <div className="flex items-center space-x-2">
            <div>
              <label
                htmlFor="isRemote"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remote Position
              </label>
            </div>
            <Switch
              id="isRemote"
              name="isRemote"
              checked={form.getValues('isRemote')}
              onCheckedChange={(checked: boolean) => {
                console.log('checked', checked);
                form.setValue('isRemote', checked);
              }}
            />
          </div>
          <CustomFormField
            name="description"
            label="Job Description"
          >
            <Editor
              defaultValue={form.getValues('description')}
              onTextChange={(content) => form.setValue('description', content)}
              placeholder="Enter job description..."
            />
          </CustomFormField>
          <SubmitButton
            type="submit"
            className="w-full"
            label="Create Job Posting"
            isLoading={isLoading}
          />
        </form>
      </Form>
    </div>
  );
};

export default JobDashboard; 