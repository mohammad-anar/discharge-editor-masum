import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MedicineData } from "@/types/medicine";

export const medicinesApi = createApi({
  reducerPath: "medicinesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/medicines" }),
  tagTypes: ["Medicine"],
  endpoints: (builder) => ({
    getMedicines: builder.query<MedicineData[], string | void>({
      query: (search) => (search ? `?search=${encodeURIComponent(search)}` : ""),
      transformResponse: (res: { data: MedicineData[] }) => res.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Medicine" as const, id })),
              { type: "Medicine", id: "LIST" },
            ]
          : [{ type: "Medicine", id: "LIST" }],
    }),
    createMedicine: builder.mutation<MedicineData, { name: string }>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Medicine", id: "LIST" }],
    }),
    deleteMedicine: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Medicine", id: "LIST" }],
    }),
  }),
});

export const { useGetMedicinesQuery, useCreateMedicineMutation, useDeleteMedicineMutation } =
  medicinesApi;
