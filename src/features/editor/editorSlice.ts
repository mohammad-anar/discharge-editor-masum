import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EditorState {
  currentDocumentId: string | null;
  documentName: string;
  mode: "view" | "edit";
  topSpacePx: number;
  guidesVisible: boolean;
  billNumber: string;
  activeSectionId: string | null;
  unsavedChanges: boolean;
  isPrintPreview: boolean;
  statusMessage: string;
}

const initialState: EditorState = {
  currentDocumentId: null,
  documentName: "",
  mode: "view",
  topSpacePx: 280,
  guidesVisible: false,
  billNumber: "",
  activeSectionId: null,
  unsavedChanges: false,
  isPrintPreview: false,
  statusMessage: "",
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setCurrentDocumentId: (state, action: PayloadAction<string | null>) => {
      state.currentDocumentId = action.payload;
    },
    setDocumentName: (state, action: PayloadAction<string>) => {
      state.documentName = action.payload;
      state.unsavedChanges = true;
    },
    setMode: (state, action: PayloadAction<"view" | "edit">) => {
      state.mode = action.payload;
    },
    toggleMode: (state) => {
      state.mode = state.mode === "edit" ? "view" : "edit";
    },
    setTopSpacePx: (state, action: PayloadAction<number>) => {
      state.topSpacePx = action.payload;
      state.unsavedChanges = true;
    },
    setGuidesVisible: (state, action: PayloadAction<boolean>) => {
      state.guidesVisible = action.payload;
    },
    toggleGuides: (state) => {
      state.guidesVisible = !state.guidesVisible;
    },
    setBillNumber: (state, action: PayloadAction<string>) => {
      state.billNumber = action.payload;
      state.unsavedChanges = true;
    },
    setActiveSectionId: (state, action: PayloadAction<string | null>) => {
      state.activeSectionId = action.payload;
    },
    setUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.unsavedChanges = action.payload;
    },
    setIsPrintPreview: (state, action: PayloadAction<boolean>) => {
      state.isPrintPreview = action.payload;
      if (action.payload) {
        state.mode = "view";
        state.guidesVisible = false;
      }
    },
    setStatusMessage: (state, action: PayloadAction<string>) => {
      state.statusMessage = action.payload;
    },
    resetEditorState: (state) => {
      state.currentDocumentId = null;
      state.documentName = "";
      state.mode = "edit";
      state.topSpacePx = 280;
      state.billNumber = "";
      state.unsavedChanges = false;
      state.isPrintPreview = false;
      state.statusMessage = "New document";
    },
  },
});

export const {
  setCurrentDocumentId,
  setDocumentName,
  setMode,
  toggleMode,
  setTopSpacePx,
  setGuidesVisible,
  toggleGuides,
  setBillNumber,
  setActiveSectionId,
  setUnsavedChanges,
  setIsPrintPreview,
  setStatusMessage,
  resetEditorState,
} = editorSlice.actions;

export default editorSlice.reducer;
