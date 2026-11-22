import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DischargeDocumentData, DocumentFilterParams } from "@/types/document";

export const documentsApi = createApi({
  reducerPath: "documentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/documents" }),
  tagTypes: ["Document"],
  endpoints: (builder) => ({
    getDocuments: builder.query<DischargeDocumentData[], DocumentFilterParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.set("search", params.search);
        if (params?.patientName) queryParams.set("patientName", params.patientName);
        if (params?.admissionNumber) queryParams.set("admissionNumber", params.admissionNumber);
        if (params?.billNumber) queryParams.set("billNumber", params.billNumber);
        if (params?.dischargeDate) queryParams.set("dischargeDate", params.dischargeDate);
        const qs = queryParams.toString();
        return qs ? `?${qs}` : "";
      },
      transformResponse: (res: { data: DischargeDocumentData[] }) => res.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Document" as const, id })),
              { type: "Document", id: "LIST" },
            ]
          : [{ type: "Document", id: "LIST" }],
    }),
    getDocumentById: builder.query<DischargeDocumentData, string>({
      query: (id) => `/${id}`,
      transformResponse: (res: { data: DischargeDocumentData }) => res.data,
      providesTags: (result, error, id) => [{ type: "Document", id }],
    }),
    createDocument: builder.mutation<DischargeDocumentData, Partial<DischargeDocumentData>>({
      query: (document) => ({
        url: "",
        method: "POST",
        body: document,
      }),
      invalidatesTags: [{ type: "Document", id: "LIST" }],
    }),
    updateDocument: builder.mutation<
      DischargeDocumentData,
      { id: string; data: Partial<DischargeDocumentData> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Document", id },
        { type: "Document", id: "LIST" },
      ],
    }),
    deleteDocument: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Document", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApi;
