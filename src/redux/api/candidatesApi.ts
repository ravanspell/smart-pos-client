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

interface WorkExperience {
    company: string;
    duration: string;
    jobTitle: string;
    responsibilities: string[];
}

interface Education {
    degree: string;
    institution: string;
    graduationYear: string;
}

interface Project {
    project_title: string;
    description: string;
}

interface ResumeRecommendations {
    jobRecommendations: string[];
    resumeOptimization: string;
}

interface StructuredData {
    skills: string[];
    projects: Project[];
    education: Education[];
    certifications: string[];
    workExperience: WorkExperience[];
}

interface Resume {
    structuredData: StructuredData;
    recommendations: ResumeRecommendations;
}

// Updated Candidate interface with all required fields
export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    currentPosition: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    resume: Resume;
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

export interface GetCandidateByIdResponse {
    statusCode: number;
    msg: string | null;
    success: boolean;
    data: Candidate;
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
        getCandidateById: builder.query<GetCandidateByIdResponse, string>({
            query: (candidateId) => ({
                url: `${CANDIDATES.GET_CANDIDATE}/${candidateId}`,
                method: HTTPMethod.GET,
            }),
            providesTags: (result, error, id) => [{ type: 'Candidate-review', id }],
        }),
    }),
});

export const {
    useUploadCVMutation,
    useGetCandidatesInReviewQuery,
    useGetCandidateByIdQuery
} = candidatesApi; 