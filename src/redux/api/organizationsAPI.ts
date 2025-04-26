import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './api';
import { ORGANIZATIONS } from '@/constants/api';

interface Organization {
  id: string;
  name: string;
  description: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationsResponse {
  statusCode: number;
  msg: string | null;
  success: boolean;
  data: {
    items: Organization[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const organizationsApi = createApi({
  reducerPath: 'organizationsApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getOrganizations: builder.query<OrganizationsResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: ORGANIZATIONS.GET_ORGANIZATIONS,
        params: { page, limit },
      }),
    }),
  }),
});

export const { useGetOrganizationsQuery } = organizationsApi; 