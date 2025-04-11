import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './api';
import { APP } from '@/constants/api';
import HTTPMethod from 'http-method-enum';
import { ApiResponse } from './types/file-mgt';

interface WakeupCheckResponse {
    status: 'pending' | 'ok';
}

interface UpdateActivityResponse extends ApiResponse<any> { }

export const appAPI = createApi({
    reducerPath: 'appAPI',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        wakeupCheck: builder.query<WakeupCheckResponse, void>({
            query: () => ({
                url: APP.WAKEUP,
                method: HTTPMethod.GET,
            }),
        }),
        updateActivity: builder.mutation<UpdateActivityResponse, void>({
            query: () => ({
                url: APP.UPDATE_ACTIVITY,
                method: HTTPMethod.POST,
            }),
        }),
    }),
});

export const {
    useWakeupCheckQuery,
    useUpdateActivityMutation 
} = appAPI; 