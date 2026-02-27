import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hn.algolia.com/api/v1/',
  }),
  tagTypes: ['News'],
  endpoints: () => ({}),
});
