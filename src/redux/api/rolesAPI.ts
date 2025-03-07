import { PaginatedResponse, QueryParams } from '@/types';
import { Role } from '@/types/roles';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import HTTPMethod from 'http-method-enum';

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // mock api
  tagTypes: ['Role'],
  endpoints: (builder) => ({
    getRoles: builder.query<PaginatedResponse<Role>, QueryParams<Role>>({
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
          url: `roles?${queryParams.toString()}`,
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Role' as const, id })),
              { type: 'Role', id: 'LIST' },
            ]
          : [{ type: 'Role', id: 'LIST' }],
    }),
    
    getRole: builder.query<Role, string>({
      query: (id) => `roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),
    
    createRole: builder.mutation<Role, Partial<Role>>({
      query: (role) => ({
        url: 'roles',
        method: HTTPMethod.POST,
        body: role,
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
    
    updateRole: builder.mutation<Role, Partial<Role> & Pick<Role, 'id'>>({
      query: ({ id, ...role }) => ({
        url: `roles/${id}`,
        method: HTTPMethod.PUT,
        body: role,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }],
    }),
    
    deleteRole: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `roles/${id}`,
        method: HTTPMethod.DELETE,
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Role', id }],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;