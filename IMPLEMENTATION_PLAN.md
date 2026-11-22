# IMPLEMENTATION PLAN: Hospital Discharge Certificate Management System

## Overview
This document guides the end-to-end transformation of the audited single-file HTML discharge certificate generator into a production-grade full-stack Next.js web application with Prisma ORM and MongoDB Atlas.

---

## Phase Breakdown

### Phase 1: HTML Audit & Technical Specification (COMPLETED)
- [x] Inspect original HTML file.
- [x] Save `legacy-discharge.html`.
- [x] Create comprehensive `PROJECT_AUDIT.md`.
- [x] Create this `IMPLEMENTATION_PLAN.md`.

### Phase 2: Next.js Project Architecture & Dependencies Setup
- Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
- Install required packages:
  - `@reduxjs/toolkit`, `react-redux`
  - `react-hook-form`, `@hookform/resolvers`, `zod`
  - `@prisma/client`, `prisma` (dev)
  - `bwip-js` (CODE128 barcode)
  - `bcryptjs`, `@types/bcryptjs`, `jose`
  - `date-fns`, `clsx`, `tailwind-merge`, `class-variance-authority`
  - `lucide-react`, `sonner`
  - `@radix-ui/react-dialog`, `@radix-ui/react-popover`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-select`, `@radix-ui/react-tabs`, etc.
- Configure `tsconfig.json`, `tailwind.config.ts`, and path aliases (`@/*`).
- Configure `.env.example` and local `.env`.

### Phase 3: Database & Prisma Modeling (MongoDB Atlas)
- Configure `prisma/schema.prisma` with MongoDB provider.
- Define models:
  - `User`: `id` (ObjectId), `name`, `email`, `passwordHash`, `role`, timestamps.
  - `DischargeDocument`: `id` (ObjectId), `ownerId`, `documentName`, `patientName`, `admissionNumber`, `billNumber`, `dischargeDate`, `sections` (Json), `footer` (Json), `pageSettings` (Json), timestamps.
  - `SectionTemplate`: `id` (ObjectId), `ownerId`, `name`, `sectionType`, `data` (Json), timestamps.
  - `Medicine`: `id` (ObjectId), `ownerId`, `name`, `normalizedName`, timestamps.
  - `FieldOption`: `id` (ObjectId), `ownerId`, `category`, `value`, `normalizedValue`, timestamps.
- Add indexes on `ownerId`, `patientName`, `admissionNumber`, `billNumber`, `dischargeDate`, `normalizedName`, etc.
- Run `prisma generate` and test connection scripts.

### Phase 4: Backend API & Service Layer
- Implement JWT session utilities in `src/lib/auth.ts` using `jose` with HttpOnly cookie support.
- Implement API response wrappers and Zod validation schemas.
- Build Next.js Route Handlers:
  - `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
  - `/api/documents`, `/api/documents/[id]` (CRUD with ownership enforcement)
  - `/api/templates`, `/api/templates/[id]` (CRUD with ownership enforcement)
  - `/api/medicines`, `/api/medicines/[id]` (CRUD with ownership enforcement)
  - `/api/field-options`, `/api/field-options/[id]` (CRUD with ownership enforcement)
  - `/api/barcode/[billNumber]` (CODE128 generation via `bwip-js`)

### Phase 5: Redux Toolkit & RTK Query Store Architecture
- Setup Redux store in `src/store/store.ts`.
- Create `editorSlice.ts` to manage:
  - `mode`: `"view"` | `"edit"`
  - `currentDocumentId`: string | null
  - `topSpacePx`: number (default 280)
  - `guidesVisible`: boolean
  - `unsavedChanges`: boolean
- Build RTK Query API slices:
  - `authApi`
  - `documentsApi`
  - `templatesApi`
  - `medicinesApi`
  - `fieldOptionsApi`
- Integrate `ReduxProvider` in application layout.

### Phase 6: Document UI Components & Section Converters
- Convert all visual styling and typography into clean CSS & React components:
  - `DocumentCanvas.tsx`: Page wrapper and viewport scaling.
  - `DocumentPage.tsx`: Standard A4 page container (210mm x 297mm) with pixel/pt matching.
  - `PageHeader.tsx`: Left CODE128 barcode + bordered title `DISCHARGE CERTIFICATE` + right CODE128 barcode.
  - `PageFooter.tsx`: Left timestamp + right Medical Officer & hospital block.
  - `SectionRenderer.tsx`: Dynamic section loader dispatching to individual section components.
  - `PatientInformation.tsx`: Dotted border 2-column patient info.
  - `OTNote.tsx`: Underlined header, 8-row table with field options popovers.
  - `BabyInformation.tsx`: 4-column dotted table + Investigation text.
  - `Treatment.tsx`: Multi-item medicine list with dotted leader lines (`.ld`), dosage, note, duration, inline formats.
  - `Advice.tsx`: Dynamic array with dual-gradient star SVG icons.
  - `HospitalServices.tsx`: Dynamic array with star SVG icons.

### Phase 7: Dynamic Editor, Field Arrays & Templates
- React Hook Form integration with `useFieldArray` for:
  - Sections array (reorder, add, remove).
  - Medicines array inside Treatment (reorder, add, delete, inline toggle).
  - Advice array (add, remove, edit).
  - Services array (add, remove, edit).
- Real-time inline editing in Edit Mode, clean typography rendering in View Mode.
- Template management system:
  - Save current section as template (modal dialog with template name).
  - Load template into active section.
  - Manage/delete saved templates.
- Field options popover with search and "+ Add new" dynamic option generator.
- Medicine autocomplete combobox with RTK Query medicine suggestion and automatic addition.

### Phase 8: Automatic Pagination Engine & Print System
- Implement `useDocumentPagination` hook replicating `#ms` measurement logic.
- Break content into multiple pages dynamically avoiding breaking individual medicine rows.
- Ensure Header and Footer repeat seamlessly on every single A4 page.
- Print styles (`@media print`, `@page { size: A4 portrait; margin: 0; }`).
- Print Preview mode (`PrintPreview.tsx`) and HTML export functionality (`downloadHtml()`).

### Phase 9: Verification, Testing, Polishing & Deployment Guide
- TypeScript typecheck (`tsc --noEmit`).
- Production build validation (`next build`).
- Verify authentication flow, document CRUD, template CRUD, medicine combobox, multi-page print preview, and barcode scanning.
- Provide comprehensive `README.md` with MongoDB Atlas setup, environment configuration, and Vercel deployment instructions.
