import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "@/features/editor/editorSlice";
import { authApi } from "@/features/auth/authApi";
import { documentsApi } from "@/features/documents/documentsApi";
import { templatesApi } from "@/features/templates/templatesApi";
import { medicinesApi } from "@/features/medicines/medicinesApi";
import { fieldOptionsApi } from "@/features/field-options/fieldOptionsApi";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    [authApi.reducerPath]: authApi.reducer,
    [documentsApi.reducerPath]: documentsApi.reducer,
    [templatesApi.reducerPath]: templatesApi.reducer,
    [medicinesApi.reducerPath]: medicinesApi.reducer,
    [fieldOptionsApi.reducerPath]: fieldOptionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      documentsApi.middleware,
      templatesApi.middleware,
      medicinesApi.middleware,
      fieldOptionsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
