import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SectionTemplateData } from "@/types/template";

export const templatesApi = createApi({
  reducerPath: "templatesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/templates" }),
  tagTypes: ["Template"],
  endpoints: (builder) => ({
    getTemplates: builder.query<SectionTemplateData[], string | void>({
      query: (sectionType) => (sectionType ? `?sectionType=${sectionType}` : ""),
      transformResponse: (res: { data: SectionTemplateData[] }) => res.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Template" as const, id })),
              { type: "Template", id: "LIST" },
            ]
          : [{ type: "Template", id: "LIST" }],
    }),
    createTemplate: builder.mutation<SectionTemplateData, Partial<SectionTemplateData>>({
      query: (template) => ({
        url: "",
        method: "POST",
        body: template,
      }),
      invalidatesTags: [{ type: "Template", id: "LIST" }],
    }),
    updateTemplate: builder.mutation<
      SectionTemplateData,
      { id: string; data: Partial<SectionTemplateData> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Template", id: "LIST" }],
    }),
    deleteTemplate: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Template", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templatesApi;
