import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './api';
import { HTTPMethod } from 'http-method-enum';
import { setUserAuthInfo } from '../slices/authSlice';
import { AUTH } from '@/constants/api';

export type UserCredentials = {
  email: string;
  password: string;
  notificationToken?: string;
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

export type ForgotPasswordRequest = {
  email: string;
};

export const authManagementApi = createApi({
  reducerPath: 'authManagementApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<User, UserCredentials>({
      query: (credentials) => ({
        url: AUTH.LOGIN,
        method: HTTPMethod.POST,
        body: credentials,
      }),
    }),
    logOut: builder.query<any, void>({
      query: () => ({
        url: AUTH.LOGOUT,
        method: HTTPMethod.GET,
      })
    }),
    getUserAuthInfo: builder.query<ScopesResponse, void>({
      query: () => ({
        url: AUTH.AUTH_INFO,
        method: HTTPMethod.GET,
      }),
      // set the user scopes in the store
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setUserAuthInfo(data.data.scopes));
      },
    }),
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (data) => ({
        url: AUTH.FORGOT_PASSWORD,
        method: HTTPMethod.POST,
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyGetUserAuthInfoQuery,
  useGetUserAuthInfoQuery,
  useLazyLogOutQuery,
  useForgotPasswordMutation
} = authManagementApi;
