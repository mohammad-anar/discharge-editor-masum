import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthUser, LoginResponse } from "@/types/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/auth" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query<{ user: AuthUser | null }, void>({
      query: () => "/me",
      transformResponse: (response: { data: { user: AuthUser } }) => ({
        user: response.data.user,
      }),
      providesTags: ["User"],
    }),
    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi;
