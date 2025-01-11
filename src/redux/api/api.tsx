import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({ 
    baseUrl: 'http://localhost:3001/api/',
    credentials: 'include',
});
