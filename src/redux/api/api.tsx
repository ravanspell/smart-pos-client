import { fetchBaseQuery, FetchBaseQueryError, retry } from '@reduxjs/toolkit/query/react';
import { StatusCodes } from 'http-status-codes';
/**
 * Retry condition for the RTK API
 * Skips retries for authentication errors and not found errors
 * Retries other errors (network issues, 500s, etc.)
 */
const retryCondition = (error: FetchBaseQueryError, _args: any) => {
    // Skip retry for authentication errors
    if ('status' in error) {
        if (error.status === StatusCodes.UNAUTHORIZED || error.status === StatusCodes.FORBIDDEN) {
            return false;
        }
        // Skip retry for not found
        if (error.status === StatusCodes.NOT_FOUND) {
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
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/`,
    credentials: 'include',
    headers: {
        'Access-Control-Allow-Origin': `${process.env.NEXT_PUBLIC_ALLOWED_ORIGIN}`,
        'Access-Control-Allow-Credentials': 'true'
    },
}), {
    retryCondition: retryCondition as any,
    maxRetries: 5 // default 5
});
