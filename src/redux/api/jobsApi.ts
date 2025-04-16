import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './api';
import HTTPMethod from 'http-method-enum';
import { JOBS } from '@/constants/api';
import { ApiResponse } from './types/file-mgt';

// Define the job posting request interface
export interface JobPostingRequest {
    title: string;
    description: string;
    salaryMin: number;
    salaryMax: number;
    location?: string;
    industry?: string;
    isRemote: boolean;
}

// Define the job posting response interface
export interface JobPostingsResponse {
    jobs: {
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
    }[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface JobPostingResponse {
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

// Define the jobs response interface
export interface JobsResponse extends ApiResponse<JobPostingsResponse> { }

// Define the get job by id response interface
export interface GetJobByIdResponse extends ApiResponse<JobPostingResponse> { }

// Define the get jobs params interface
export interface GetJobsParams {
    page?: number;
    limit?: number;
}

// Define the tag types for cache invalidation
const jobsInvalidateTags = ['Jobs'];

export const jobsApi = createApi({
    reducerPath: 'jobsApi',
    baseQuery: baseQuery,
    tagTypes: jobsInvalidateTags,
    endpoints: (builder) => ({
        createJob: builder.mutation<JobPostingResponse, JobPostingRequest>({
            query: (data) => ({
                url: JOBS.CREATE_JOB,
                method: HTTPMethod.POST,
                body: data,
            }),
            invalidatesTags: jobsInvalidateTags,
        }),
        getJobs: builder.query<JobsResponse['data'], GetJobsParams>({
            query: (params) => {
                const { page = 1, limit = 10 } = params;
                return {
                    url: `${JOBS.GET_JOBS}?page=${page}&limit=${limit}`,
                    method: HTTPMethod.GET,
                };
            },
            transformResponse: (response: JobsResponse) => {
                return response?.data;
            },
            providesTags: jobsInvalidateTags,
        }),
        getJobById: builder.query<GetJobByIdResponse, string>({
            query: (jobId) => ({
                url: `${JOBS.GET_JOB_BY_ID}/${jobId}`,
                method: HTTPMethod.GET,
            }),
            providesTags: (result, error, id) => [{ type: 'Jobs', id }],
        }),
        updateJob: builder.mutation<JobPostingResponse, { id: string; data: Partial<JobPostingRequest> }>({
            query: ({ id, data }) => ({
                url: `${JOBS.UPDATE_JOB}/${id}`,
                method: HTTPMethod.PATCH,
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Jobs', id }],
        }),
        deleteJob: builder.mutation<void, string>({
            query: (jobId) => ({
                url: `${JOBS.DELETE_JOB}/${jobId}`,
                method: HTTPMethod.DELETE,
            }),
            invalidatesTags: jobsInvalidateTags,
        }),
    }),
});

export const {
    useCreateJobMutation,
    useGetJobsQuery,
    useGetJobByIdQuery,
    useUpdateJobMutation,
    useDeleteJobMutation,
} = jobsApi; 