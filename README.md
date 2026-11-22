# Hospital Discharge Certificate Management System

A production-ready, database-driven hospital discharge certificate generator converted from a precision desktop-publishing HTML application into a full-stack Next.js web application with **MongoDB Atlas**, **Prisma ORM**, **Redux Toolkit**, **RTK Query**, **React Hook Form**, and **Tailwind CSS**.

---

## 1. Overview & Architecture

This application preserves 100% of the visual typography, layout spacing, dotted borders, and Bengali/English clinical certificate design from the original system while upgrading the underlying architecture to:
- **Database Persistence**: MongoDB Atlas using Prisma ORM with indexed models for documents, templates, medicines, and field options.
- **Enterprise Authentication**: Secure password hashing with `bcryptjs`, JWT session cookies signed with `jose` (HttpOnly, SameSite Lax), and strict resource ownership verification on all routes.
- **Dynamic Multi-page Pagination**: Automatic A4 page calculation ensuring headers (with dual CODE128 barcodes) and footers (with verification signoff and print timestamp) repeat cleanly on every page without content clipping.
- **Clinical Data Management**: Searchable medicine combobox with auto-learning suggestions, reusable section templates (O.T Note, Treatment, Advice, Services), and dynamic field option popovers.

---

## 2. Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, TypeScript)
- **Frontend & State**: React 19, Redux Toolkit, RTK Query, React Hook Form, Tailwind CSS, Lucide React, Sonner
- **Database & ORM**: MongoDB Atlas, Prisma ORM 6
- **Security & Auth**: `jose` (JWT), `bcryptjs`, HttpOnly cookies
- **Barcodes & Print**: `bwip-js` (CODE128 format), `@media print`, custom standalone HTML export

---

## 3. Project File Structure

```
d:\masu/
├── prisma/
│   └── schema.prisma                  # Prisma MongoDB Atlas schema
├── public/                            # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx         # Secure clinical login
│   │   ├── (protected)/
│   │   │   └── editor/page.tsx        # Document editor page
│   │   ├── api/
│   │   │   ├── auth/                  # login, logout, me
│   │   │   ├── documents/             # list, create, get, update, delete
│   │   │   ├── templates/             # template management
│   │   │   ├── medicines/             # medicine autocomplete & suggestions
│   │   │   ├── field-options/         # dropdown options
│   │   │   └── barcode/[billNumber]/  # dynamic CODE128 SVG endpoint
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                   # Main entry point (Editor)
│   ├── components/
│   │   ├── editor/                    # Toolbar, Canvas, Page, Header, Footer, Controls
│   │   ├── sections/                  # PatientInfo, OTNote, BabyInfo, Treatment, Advice, Services
│   │   └── medicines/                 # Searchable Medicine Combobox
│   ├── features/                      # RTK Query APIs & Redux slices
│   ├── hooks/                         # useDocumentPagination, custom hooks
│   ├── lib/                           # prisma client, auth, barcode, validators, utils
│   ├── services/                      # Database business logic & ownership layer
│   ├── store/                         # Redux Toolkit store & typed hooks
│   ├── styles/                        # document.css (original print & screen styles)
│   ├── types/                         # TypeScript definitions
│   └── middleware.ts                  # Edge JWT session route protection
├── legacy-discharge.html              # Original source preserved for reference
├── PROJECT_AUDIT.md                   # Complete 15-point HTML audit & feature matrix
├── IMPLEMENTATION_PLAN.md             # Phased transformation roadmap
└── package.json
```

---

## 4. Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```bash
# MongoDB Atlas Connection URL
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/discharge_db?retryWrites=true&w=majority"

# JWT Secret (minimum 32 characters)
AUTH_SECRET="your-32-char-or-longer-secure-random-jwt-secret-key"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 5. Local Setup & Installation

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Default Login Credentials

The application auto-seeds the default admin account on first login when matching the original HTML demo:
- **Email**: `admin@gmail.com`
- **Password**: `12345678`

Upon successful authentication, an HttpOnly session cookie is established and authenticated access is granted.

---

## 7. Document Design & Standards

- **Paper Size**: Standard A4 Portrait (`210mm x 297mm` / `595.3pt x 841.9pt`)
- **Top Whitespace**: 280px default (adjustable in real-time from the toolbar)
- **Margins**: Left 60px (45pt), Right 60px (45pt), Bottom 30px (22.5pt)
- **Header**: Repeated on every page with dual CODE128 barcodes driven by the Bill Number and centered bordered title `DISCHARGE CERTIFICATE`.
- **Footer**: Repeated on every page with Doctor/Hospital signoff on the right and print date/time on the left.
- **Typography**: Constantia, Cambria, Sylfaen, Times New Roman, Algerian, Nirmala UI (Bengali), and Arial Black.

---

## 8. Production Build & Deployment to Vercel

### Step 1: Verify TypeScript & Build Locally
```bash
npx tsc --noEmit
npm run build
```

### Step 2: Deploy to Vercel
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. Set the Environment Variables in Vercel Project Settings:
   - `DATABASE_URL`: Your production MongoDB Atlas connection string.
   - `AUTH_SECRET`: A secure random 64-character secret.
   - `NEXT_PUBLIC_APP_URL`: Your Vercel production domain (e.g., `https://your-domain.vercel.app`).
4. Vercel will automatically execute `npm run build` (which includes `prisma generate && next build`) and deploy the application serverlessly.

---

## 9. Troubleshooting & Common Questions

1. **Why does double-clicking the page switch modes?**
   - Double-clicking anywhere on the document enters **Edit Mode**, allowing inline direct editing of text, dates, and medicines. Clicking **✓ Save (view mode)** switches back to clean presentation mode.
2. **How does automatic pagination work?**
   - The pagination engine measures block units (such as individual medicine rows and advice points) against the printable page height limit (`LIM = FT - 6 - (topPt + 62)`). Content that exceeds the page limit flows onto subsequent pages with repeated headers and footers.
3. **How do I print or export?**
   - Click **👁 Print Preview** in the toolbar to enter preview mode.
   - Click **🖨 Print Document** to trigger the browser print dialog with pre-configured A4 CSS margins.
   - Click **⬇ Download HTML** to export a self-contained, standalone HTML certificate file with embedded styling and auto-print triggers.
