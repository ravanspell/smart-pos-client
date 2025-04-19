import { PaginatedResponse, QueryParams } from '@/types';
import { createApi } from '@reduxjs/toolkit/query/react';
import HTTPMethod from 'http-method-enum';
import { baseQuery } from './api';

// Define the PermissionCategory type
export interface PermissionCategory {
  id: string;
  name: string;
  description: string;
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
    getPermissionCategories: builder.query<PaginatedResponse<PermissionCategory>, QueryParams<PermissionCategory>>({
      query: (params) => {
        // Construct the query string
        const queryParams = new URLSearchParams();
        
        // Add pagination params
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        
        // Add sorting params
        if (params.sortBy) queryParams.append('sortBy', params.sortBy.toString());
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        
        // Add filter params
        if (params.filter) {
          Object.entries(params.filter).forEach(([key, value]) => {
            if (value) {
              queryParams.append(`filter[${key}]`, value.toString());
            }
          });
        }
        
        return {
          url: `permission-categories?${queryParams.toString()}`,
        };
      },
    }),
    
    getPermissionCategory: builder.query<PermissionCategory, string>({
      query: (id) => `permission-categories/${id}`,
      providesTags: (result, error, id) => [{ type: PERMISSION_CATEGORY_INVALIDATE_TAG, id }],
    }),
    
    createPermissionCategory: builder.mutation<PermissionCategory, CreatePermissionCategoryRequest>({
      query: (category) => ({
        url: 'v1/permission-categories',
        method: HTTPMethod.POST,
        body: category,
      }),
      invalidatesTags: [{ type: PERMISSION_CATEGORY_INVALIDATE_TAG, id: 'LIST' }],
    }),
    
    updatePermissionCategory: builder.mutation<PermissionCategory, Partial<PermissionCategory> & Pick<PermissionCategory, 'id'>>({
      query: ({ id, ...category }) => ({
        url: `permission-categories/${id}`,
        method: HTTPMethod.PUT,
        body: category,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: PERMISSION_CATEGORY_INVALIDATE_TAG, id }],
    }),
    
    deletePermissionCategory: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `permission-categories/${id}`,
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