"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "sonner";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" richColors />
    </Provider>
  );
}
