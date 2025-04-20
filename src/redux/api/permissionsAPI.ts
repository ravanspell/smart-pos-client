import { PaginatedResponse, QueryParams } from '@/types';
import { createApi } from '@reduxjs/toolkit/query/react';
import HTTPMethod from 'http-method-enum';
import { baseQuery } from './api';
import { PERMISSIONS } from '@/constants/api';

// Define the API response type
export interface ApiResponse<T> {
  statusCode: number;
  msg: string | null;
  success: boolean;
  data: T;
}

// Define the PermissionCategory type
export interface PermissionCategory {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// Define the request payload for creating a permission category
export interface CreatePermissionCategoryRequest {
  name: string;
  description: string;
}

const PERMISSION_CATEGORY_INVALIDATE_TAG = 'PermissionCategory';

export const permissionsApi = createApi({
  reducerPath: 'permissionsApi',
  baseQuery: baseQuery,
  tagTypes: [PERMISSION_CATEGORY_INVALIDATE_TAG],
  endpoints: (builder) => ({
    getPermissionCategories: builder.query<PermissionCategory[], void>({
      query: () => PERMISSIONS.GET_PERMISSION_CATEGORIES,
      transformResponse: (response: ApiResponse<PermissionCategory[]>) => response.data,
      providesTags: [{ type: PERMISSION_CATEGORY_INVALIDATE_TAG, id: 'LIST' }],
    }),
    
    getPermissionCategory: builder.query<PermissionCategory, string>({
      query: (id) => `${PERMISSIONS.GET_PERMISSION_CATEGORIES}/${id}`,
      providesTags: (result, error, id) => [{ type: PERMISSION_CATEGORY_INVALIDATE_TAG, id }],
    }),
    
    createPermissionCategory: builder.mutation<PermissionCategory, CreatePermissionCategoryRequest>({
      query: (category) => ({
        url: PERMISSIONS.CREATE_PERMISSION_CATEGORY,
        method: HTTPMethod.POST,
        body: category,
      }),
      invalidatesTags: [{ type: PERMISSION_CATEGORY_INVALIDATE_TAG, id: 'LIST' }],
    }),
    
    updatePermissionCategory: builder.mutation<PermissionCategory, Partial<PermissionCategory> & Pick<PermissionCategory, 'id'>>({
      query: ({ id, ...category }) => ({
        url: `${PERMISSIONS.GET_PERMISSION_CATEGORIES}/${id}`,
        method: HTTPMethod.PUT,
        body: category,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: PERMISSION_CATEGORY_INVALIDATE_TAG, id }],
    }),
    
    deletePermissionCategory: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `${PERMISSIONS.GET_PERMISSION_CATEGORIES}/${id}`,
        method: HTTPMethod.DELETE,
      }),
      invalidatesTags: (result, error, id) => [{ type: PERMISSION_CATEGORY_INVALIDATE_TAG, id }],
    }),
  }),
});

export const {
  useGetPermissionCategoriesQuery,
  useGetPermissionCategoryQuery,
  useCreatePermissionCategoryMutation,
  useUpdatePermissionCategoryMutation,
  useDeletePermissionCategoryMutation,
} = permissionsApi; 