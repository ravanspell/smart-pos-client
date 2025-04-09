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
                body: { createFileData: data },
            }),
            invalidatesTags: candidateInvalidateTags,
        }),
    }),
});

export const { useUploadCVMutation } = candidatesApi; 