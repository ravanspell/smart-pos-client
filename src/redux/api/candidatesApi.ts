import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './api';
import HTTPMethod from 'http-method-enum';
import { CANDIDATES } from '@/constants/api';

export interface UploadCVRequest {
    fileName: string;
    s3ObjectKey: string;
    fileSize: number;
}

interface UploadCVResponse {
    id: string;
    fileName: string;
    s3ObjectKey: string;
    fileSize: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

// New interfaces for candidate fetching
export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CandidatesResponse {
    statusCode: number;
    msg: string | null;
    success: boolean;
    data: {
        candidates: Candidate[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface GetCandidatesParams {
    status?: string;
    page?: number;
    limit?: number;
}

const candidateInvalidateTags = ['Candidate-review'];

export const candidatesApi = createApi({
    reducerPath: 'candidatesApi',
    baseQuery: baseQuery,
    tagTypes: candidateInvalidateTags,
    endpoints: (builder) => ({
        uploadCV: builder.mutation<UploadCVResponse, UploadCVRequest[]>({
            query: (data) => ({
                url: CANDIDATES.CREATE_CANDIDATE,
                method: HTTPMethod.POST,
                body: { resumeFiles: data },
            }),
            // force to refetch review candidates when a new candidate is uploaded
            invalidatesTags: candidateInvalidateTags,
        }),
        getCandidatesInReview: builder.query<CandidatesResponse, GetCandidatesParams>({
            query: (params) => {
                const { status, page = 1, limit = 10 } = params;
                return {
                    url: `${CANDIDATES.SEARCH_CANDIDATES}?status=${status || 'REVIEWING,PROCESSING'}&page=${page}&limit=${limit}`,
                    method: HTTPMethod.GET,
                };
            },
            providesTags: candidateInvalidateTags,
        }),
    }),
});

export const {
    useUploadCVMutation,
    useGetCandidatesInReviewQuery
} = candidatesApi; 