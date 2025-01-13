import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

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
    maxRetries: 5, // default 5
});
