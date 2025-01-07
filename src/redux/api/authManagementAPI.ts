import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './api';
import { HTTPMethod } from 'http-method-enum';
import { setUserAuthInfo } from '../slices/authSlice';

export type UserCredentials = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
};

export type ScopesResponse = {
  status: 'SUCCESS' | 'FAILURE';
  data: {
    scopes: string[];
  };
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
    getUserAuthInfo: builder.query<ScopesResponse, void>({
      query: () => ({
        url: '/auth/info',
        method: HTTPMethod.GET,
      }),
      // set the user scopes in the store
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setUserAuthInfo(data.data.scopes));
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyGetUserAuthInfoQuery
} = authManagementApi;
