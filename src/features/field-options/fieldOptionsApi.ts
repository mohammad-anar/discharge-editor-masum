import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FieldOptionData } from "@/types/fieldOption";

export const fieldOptionsApi = createApi({
  reducerPath: "fieldOptionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/field-options" }),
  tagTypes: ["FieldOption"],
  endpoints: (builder) => ({
    getFieldOptions: builder.query<FieldOptionData[], string | void>({
      query: (category) => (category ? `?category=${category}` : ""),
      transformResponse: (res: { data: FieldOptionData[] }) => res.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "FieldOption" as const, id })),
              { type: "FieldOption", id: "LIST" },
            ]
          : [{ type: "FieldOption", id: "LIST" }],
    }),
    createFieldOption: builder.mutation<FieldOptionData, { category: string; value: string }>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "FieldOption", id: "LIST" }],
    }),
    deleteFieldOption: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "FieldOption", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFieldOptionsQuery,
  useCreateFieldOptionMutation,
  useDeleteFieldOptionMutation,
} = fieldOptionsApi;
