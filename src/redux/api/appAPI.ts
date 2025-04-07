import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './api';
import { APP } from '@/constants/api';
import HTTPMethod from 'http-method-enum';
import { ApiResponse } from './types/file-mgt';

interface HealthCheckResponse extends ApiResponse<{
    status: string;
    info: {
        database: {
            status: string;
        };
    };
    error: Record<string, any>;
    details: {
        database: {
            status: string;
        };
    };
}> { }

interface WakeupResponse extends ApiResponse<any> { }

export const appAPI = createApi({
    reducerPath: 'appAPI',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        healthCheck: builder.query<HealthCheckResponse, void>({
            query: () => APP.HEALTH_CHECK,
        }),
        wakeup: builder.mutation<WakeupResponse, void>({
            query: () => ({
                url: APP.WAKEUP,
                method: HTTPMethod.POST,
            }),
        }),
    }),
});

export const { useHealthCheckQuery, useWakeupMutation } = appAPI; 