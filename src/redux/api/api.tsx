import { fetchBaseQuery, FetchBaseQueryError, retry } from '@reduxjs/toolkit/query/react';

/**
 * Retry condition for the RTK API
 * Skips retries for authentication errors and not found errors
 * Retries other errors (network issues, 500s, etc.)
 */
const retryCondition = (error: FetchBaseQueryError, _args: any) => {
    // Skip retry for authentication errors
    if ('status' in error) {
        if (error.status === 401 || error.status === 403) {
            return false;
        }
        // Skip retry for not found
        if (error.status === 404) {
            return false;
        }
    }
    // Retry other errors (network issues, 500s, etc.)
    return true;
}

/**
 * Global setup of the redux toolkit RTK API
 * Setup provides retries with a basic exponential backoff.
 */
export const baseQuery = retry(fetchBaseQuery({
    baseUrl: 'http://localhost:3001/api/',
    credentials: 'include',
    headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true'
    },
}), {
    retryCondition: retryCondition as any,
    maxRetries: 5 // default 5
});
