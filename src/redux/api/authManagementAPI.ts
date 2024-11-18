import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './api';
import { HTTPMethod } from 'http-method-enum';

export type UserCredentials = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
};

export const authManagementApi = createApi({
  reducerPath: 'authManagementApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<User, UserCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: HTTPMethod.POST,
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authManagementApi;
