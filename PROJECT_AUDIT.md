# PROJECT AUDIT: Hospital Discharge Certificate Management System

**Original Source File**: `legacy-discharge.html`  
**Audit Date**: November 2026  
**Auditor**: Senior Full-Stack Software Architect & UI/UX Engineer  

---

## 1. Executive Summary & Purpose

This audit dissects the complete source code of the single-file HTML application `Discharge Certificate Generator v2`. The goal is to accurately convert this rich, desktop-publishing-style hospital discharge certificate generator into a production-ready, database-driven Next.js application (using Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Redux Toolkit, RTK Query, React Hook Form, Prisma ORM, and MongoDB Atlas) without losing any visual styling, layout precision, or functionality.

---

## 2. Inventory of Existing HTML Sections

The original application structures document sections via section identifiers (`s.t`) with data blocks `s.data`:

| Section ID (`t`) | Section Name in UI | Data Schema | Visual Structure & Notes |
|---|---|---|---|
| `pi` | Patient Info | `{ no, dd, name, ad, gender, age, cabin, guardian, rel, addr, mobile }` | Rendered in a fixed dotted border box (`522pt x 91.5pt`), 2-column key-value layout with colons aligned, plus Age on left. Contains date picker triggers for Admission Date (`ad`) and Discharge Date (`dd`). |
| `ot` | O.T Note | `{ time, date, ind, op, surg, asst, anes, child }` | Underlined title (`Algerian` font). 8 rows with label (99.9pt width Constantia), colon (13.5pt), value (Times New Roman or Constantia). Dropdown triggers for `op`, `surg`, `ind`, `asst`, `anes`. Date/time pickers for `time` and `date`. |
| `birth` | Birth Table + Investigation | `{ birth, baby, sex, weight, inv }` | Top part: 4-column dotted border box (`522pt x 37.5pt`) with columns Birth, Baby, Sex, Weight (130.5pt each) with option dropdowns. Bottom part: `Investigation: {inv}` text line. |
| `rx` | Treatment on Discharge | `{ items: [{ m, d, n, u, inline? }] }` | Underlined title (`Algerian` font). Supports standard multi-line medicine item (Medicine name with dropdown/autocomplete, Dosage, Dotted leader line, Note, Dotted leader line, Duration) and inline style (e.g. Cream/ointments with note in parens + duration). |
| `advice` | উপদেশ | `{ items: string[] }` | Bold Bengali header (`Nirmala UI`). List items prefixed with a dual-gradient star SVG icon (`viewBox="0 0 10 10"`). |
| `services` | আমাদের সেবা-সমূহ | `{ items: string[] }` | Bold Bengali header (`Nirmala UI`). List items prefixed with the same dual-gradient star SVG icon. |

---

## 3. Inventory of Every Editable Field

| Section / Block | Field Key (`k`) | Label / Description | Type / Editor Mechanism |
|---|---|---|---|
| **Patient Info** | `pi.no` | Admission No | Inline contenteditable text (`.f`) |
| | `pi.dd` | Discharge Date | Date/time picker popup (`.dt` with `data-m="dt"`) |
| | `pi.name` | Patient Name | Inline text (`.f`) |
| | `pi.ad` | Admission Date | Date/time picker popup (`.dt` with `data-m="dt"`) |
| | `pi.gender` | Gender | Inline text (`.f`) |
| | `pi.age` | Age | Inline text (`.f`) |
| | `pi.cabin` | Cabin/Bed | Inline text (`.f`) |
| | `pi.guardian` | Guardian | Inline text (`.f`) |
| | `pi.rel` | Relation | Inline text (`.f`) |
| | `pi.addr` | Address | Inline text (`.f`) |
| | `pi.mobile` | Mobile | Inline text (`.f`) |
| **O.T Note** | `ot.time` | Time | Time picker popup (`data-m="time"`) |
| | `ot.date` | Date | Date picker popup (`data-m="date"`) |
| | `ot.ind` | Indication | Inline text (`.f`) + dropdown popup (`.db`, `opt="ind"`) |
| | `ot.op` | Operation Name | Inline text (`.f`) + dropdown popup (`.db`, `opt="op"`) |
| | `ot.surg` | Surgeon Name | Inline text (`.f`) + dropdown popup (`.db`, `opt="surg"`) |
| | `ot.asst` | Asst. Surgeon | Inline text (`.f`) + dropdown popup (`.db`, `opt="asst"`) |
| | `ot.anes` | Anesthesiologist | Inline text (`.f`) + dropdown popup (`.db`, `opt="anes"`) |
| | `ot.child` | Child Specialist | Inline text (`.f`) |
| **Birth Table** | `birth.birth` | Birth status (Alive/Still) | Inline text (`.f`) + dropdown popup (`.db`, `opt="birth"`) |
| | `birth.baby` | Baby count (Single/Twin) | Inline text (`.f`) + dropdown popup (`.db`, `opt="baby"`) |
| | `birth.sex` | Sex (Male/Female/-) | Inline text (`.f`) + dropdown popup (`.db`, `opt="sex"`) |
| | `birth.weight` | Weight (e.g. 3.2 kg) | Inline text (`.f`) + dropdown popup (`.db`, `opt="weight"`) |
| | `birth.inv` | Investigation | Inline text (`.f`) |
| **Treatment** | `rx.items[i].m` | Medicine Name | Inline text (`.f.mf`) + search dropdown + `.db` (`opt="med"`) |
| | `rx.items[i].d` | Dosage (e.g. 1+0+1) | Inline text (`.f`) |
| | `rx.items[i].n` | Note (e.g. খাওয়ার আগে) | Inline text (`.f`) (optional; hidden in view/print if empty) |
| | `rx.items[i].u` | Duration (e.g. 14 দিন।) | Inline text (`.f.u`) |
| **Advice** | `advice.items[i]` | Advice item text | Inline text (`.f`) |
| **Services** | `services.items[i]`| Service item text | Inline text (`.f`) |
| **Footer** | `F.bill` | Bill Number | Toolbar input (`#bill`) and page header barcode label |
| | `F.by` | Verified By | Inline text (`.f`, e.g. "Check By.......") |
| | `F.role` | Doctor Role / Designation | Inline text (`.f`, e.g. "Medical Officer") |
| | `F.hosp` | Hospital Name | Inline text (`.f`, e.g. "Nirapad Specialized Hospital.") |
| | `F.print` | Print Time & Date | DateTime picker popup (`.dt` with `data-m="us"`) |
| **Toolbar** | `#top` | Top White Space (px) | Number input (default 280) |
| | `#tn` | Template Name | Text input |
| | `#dn` | Document Name | Text input (defaults to patient name or "Untitled") |

---

## 4. Inventory of JavaScript Functions

| Function Name | Parameters | Purpose |
|---|---|---|
| `$` | `s` | Shorthand DOM query selector (`document.querySelector(s)`) |
| `L` | `k, d` | Safe JSON parse from localStorage with fallback to `d` |
| `Sv` | `k, v` | Safe JSON stringify to localStorage |
| `uid` | none | Generates random 6-character alphanumeric identifier (`Math.random().toString(36).slice(2,8)`) |
| `esc` | `s` | Escapes `&`, `<`, `>` for HTML injection |
| `DEF` | dictionary | Returns default empty state objects for each section type (`pi`, `ot`, `birth`, `rx`, `advice`, `services`) |
| `sample` | none | Returns rich initial seed document state with authentic Bengali and English clinical data |
| `nowStr` | none | Formats current timestamp as `"MM/DD/YYYY H:MM AM/PM"` |
| `R` | none | Aggregates document data mapping `s.id -> s.data` and `F -> F` into a flat lookup dictionary |
| `getp` | `k` | Resolves dot-notated path in `R()` (e.g. `"id.name"`, `"F.bill"`) |
| `setp` | `k, v` | Mutates dot-notated path in `R()` |
| `fs` | `k, o` | Returns field HTML with dropdown trigger button (`.db`) |
| `fd` | `k, m` | Returns field HTML with date/time modal trigger (`.dt`) |
| `f` | `k, c=""` | Returns inline editable span (`.f`) |
| `A` | `c, l, t, h, st=""` | Generates absolute-positioned container div (`.a`) |
| `bar` | `v` | Renders Code39 barcode as SVG using precomputed barcode pattern lookup table `C39` |
| `bill` | none | Returns current bill number `F.bill || ""` |
| `blocks` | `s` | Generates array of renderable blocks `{ html, gap, sec, keep?, head?, row?, sub? }` for any given section |
| `render` | none | Core layout engine: measures block heights via `#ms`, calculates page breaks against `LIM`, generates HTML for all pages with headers, barcodes, section controls, row controls, and footers |
| `setMode` | `m` | Switches mode between `"view"` and `"edit"`, then invokes `render()` |
| `msg` | `t` | Updates status indicators `#st` and `#pvm` |
| `showDd` | `el` | Displays autocomplete dropdown for medicine names near element `el` |
| `fillDocs` | none | Populates `#od` document dropdown from localStorage key `dc_docs` |
| `stdHTML` | none | Produces a clean, standalone, printable HTML document clone stripped of editing controls |
| `dl` | `h` | Triggers download of generated HTML file as a blob |
| `printDoc` | none | Orchestrates browser printing with fallback to new popup window or file download |
| `tm` | `t, pad` | Converts `"HH:mm"` time string into 12-hour format with AM/PM |
| `fmtDT` | `v, m` | Formats ISO or time strings into localized clinical display formats |
| `seedOpts` | none | Seeds initial dropdown options for `op`, `surg`, `ind`, `asst`, `anes`, `birth`, `baby`, `sex`, `weight`, `med` |
| `getOpts` | none | Retrieves saved options from localStorage `dc_opts` or falls back to `seedOpts()` |
| `closePop` | none | Closes `#pop` modal popup |
| `openPop` | `html, el` | Positions and opens floating `#pop` container adjacent to target element |
| `openOpt` | `b` | Opens searchable options picker with inline "+ Add new" option creator |
| `openDate` | `d` | Opens date/time input modal with HTML5 native picker and "Clear" button |
| `gate` | none | Shows or hides the `#lg` login card based on `dc_auth` state |
| `fit` | none | Rescales `#wrap` via CSS `zoom` according to current window inner width |

---

## 5. Inventory of Event Handlers

| Target | Event | Action / Handler Logic |
|---|---|---|
| `#wrap` | `dblclick` | If mode is not `"edit"`, activates edit mode (`setMode("edit")`) |
| `#wrap` | `input` | Catches input inside `.f`, calls `setp(k, text)`, sets `dirty = true`, triggers `showDd` if `.mf` |
| `#wrap` | `keydown` | Enter key on `.f` calls `preventDefault()` and `blur()` (prevents multi-line in single line fields) |
| `#wrap` | `paste` | Intercepts paste, strips newlines, executes clean text insertion |
| `#wrap` | `focusin` | If focused on `.mf`, triggers medicine autocomplete dropdown |
| `#wrap` | `focusout` | Hides `#dd`, persists new medicine to `dc_med` if not present, triggers debounced re-render |
| `#dd` | `mousedown` | Selecting medicine from dropdown sets value via `setp`, hides dropdown, re-renders |
| `#wrap` | `click` | Handles toolbar controls on sections and rows: `up`, `dn`, `del`, `ts` (save template), `ra` (add row), `rd` (delete row), `.db` (open options popup), `.dt` (open date picker) |
| `#wrap` | `change` | Handles template load dropdown `select[data-act="tl"]` |
| `#bm` | `click` | Toggles edit/view mode |
| `#top` | `input` | Re-renders document with new top whitespace |
| `#bill` | `input` | Updates `F.bill` and re-renders barcodes and bill text |
| `#addT` | `change` | Adds selected section type (`pi`, `ot`, `birth`, `rx`, `advice`, `services`) with default schema to `S` and enters edit mode |
| `#sd` | `click` | Saves document under `#dn` into `dc_docs`, refreshes `#od`, enters view mode |
| `#od` | `change` | Loads selected document from `dc_docs` into `S` and `F`, enters view mode |
| `#nw` | `click` | Creates blank document with all default sections, resets bill and document name, enters edit mode |
| `#pr` | `click` | Toggles print preview mode (`.pv`), switches to view mode, unchecks guides, triggers re-render |
| `#gd` | `change` | Toggles red alignment guides overlay on/off |
| `#pvb` | `click` | Exits print preview mode |
| `#pvp` | `click` | Invokes `printDoc()` |
| `#pvd` | `click` | Invokes `dl(stdHTML())` (HTML download) |
| `#lgb` | `click` | Checks demo credentials (`admin@gmail.com` / `12345678`), sets `dc_auth = 1`, dismisses login overlay |
| `#lp` | `keydown` | Enter key triggers `#lgb.click()` |
| `#lo` | `click` | Sets `dc_auth = 0`, calls `gate()` to display login overlay |
| `window` | `resize` | Calls `fit()` to compute zoom scale `min(1, (innerWidth - 16)/816)` |
| `window` | `beforeprint` | Sets `pf = 1` flag |
| `window` | `mousedown` | Closes popup `#pop` if click is outside `#pop`, `.db`, `.dt` |

---

## 6. Inventory of Toolbar Actions

1. **Edit / Save View Toggle** (`#bm`): switches between `mode === "edit"` and `mode === "view"`.
2. **Top Spacing Input** (`#top`): sets physical top margin offset in px (converted via `*.75` to pt).
3. **Bill Number Input** (`#bill`): updates Bill No and triggers dynamic barcode generation.
4. **Add Section Dropdown** (`#addT`): dynamically appends a new section (`pi`, `ot`, `birth`, `rx`, `advice`, `services`).
5. **Template Name Input** (`#tn`): specifies name when saving section template.
6. **Document Name Input** (`#dn`): name for document save (defaults to patient name).
7. **Save Document Button** (`#sd`): saves entire `{ S, F }` payload.
8. **Open Document Select** (`#od`): lists and loads saved documents.
9. **New Document Button** (`#nw`): resets to a clean blank certificate.
10. **Print Preview Button** (`#pr`): switches UI to full print preview mode with top preview bar.
11. **Guides Checkbox** (`#gd`): toggles visual alignment guidelines (`.gd`).
12. **Logout Button** (`#lo`): terminates session and opens login gate.

---

## 7. Inventory of LocalStorage Keys & Data Structures

| Key | Existing Data Structure | New MongoDB Collection & Prisma Model |
|---|---|---|
| `dc_docs` | `{ [docName: string]: { S: Section[], F: FooterData } }` | `DischargeDocument` collection (`ownerId`, `documentName`, `patientName`, `admissionNumber`, `billNumber`, `dischargeDate`, `sections`, `footer`, `pageSettings`) |
| `dc_tpl` | `{ [sectionType: string]: Array<{ name: string, data: any }> }` | `SectionTemplate` collection (`ownerId`, `name`, `sectionType`, `data`) |
| `dc_med` | `string[]` (list of medicine names) | `Medicine` collection (`ownerId`, `name`, `normalizedName`) |
| `dc_opts` | `{ [category: string]: string[] }` | `FieldOption` collection (`ownerId`, `category`, `value`, `normalizedValue`) |
| `dc_auth` | `0` or `1` | Real authentication session (JWT cookie via `jose`, bcryptjs password hash in `User` model) |

---

## 8. Pagination Engine, Measurements & CSS Dimensions

### Physical Measurements
- Document Page Size: `612pt x 835.2pt` (standard conversion from 8.5" x 11.6", standard A4 target is `210mm x 297mm` = `595.28pt x 841.89pt`).
- At 96 DPI: `1pt = 1.3333px`, `1px = 0.75pt`.
  - Top white space: 280px * 0.75 = `210pt`.
  - Left margin: 60px * 0.75 = `45pt`.
  - Right margin: 60px * 0.75 = `45pt`.
  - Content width: `612pt - 45pt - 45pt = 522pt` (or for A4: `595.3pt - 45pt - 45pt = 505.3pt`, or using 522pt layout safely centered/proportioned).
  - Footer bottom spacing: 30px * 0.75 = `22.5pt`.
  - Footer content height: `40.5pt`.
  - `FT = 835.2 - 22.5 - 40.5 = 772.2pt`.
  - Printable Content Limit (`LIM`): `FT - 6 - (top + 62)`.

### Automatic Page Break Logic
- Renders each block invisibly in `#ms` (`width: 522pt`).
- Reads `offsetHeight * 0.75` to compute block height `b.h`.
- Adds `GAP = 8pt` between different sections.
- Evaluates `if (c.length && y + need > LIM)` where `need = g + b.h + (b.keep && n ? n.gap + n.h : 0)`.
- If overflow occurs, creates a new page in `pages = [[]]`.
- Keeps headings with their first content row (`keep: 1`).
- Every page repeats:
  - Header barcodes (left at 45pt, right at 612-45-92 = 475pt) generated from Bill Number.
  - Bordered centered title: `DISCHARGE CERTIFICATE`.
  - Footer containing Print Time & Date on left, and Doctor/Hospital signoff on right.

---

## 9. Comprehensive Feature & Migration Checklist

| Feature | Original Implementation | React / Next.js Implementation | API Endpoint | DB Requirement | Status |
|---|---|---|---|---|---|
| User Authentication | `dc_auth` (localStorage) | `authApi`, `jose` JWT cookie, bcryptjs, login page | `/api/auth/login`, `/api/auth/me`, `/api/auth/logout` | `User` collection | Planned |
| Document CRUD | `dc_docs` (localStorage) | `documentsApi`, React Hook Form, Redux editor slice | `GET/POST /api/documents`, `GET/PATCH/DELETE /api/documents/[id]` | `DischargeDocument` collection | Planned |
| O.T Note Templates | `dc_tpl.ot` | `templatesApi`, Template selector & save modal | `GET/POST /api/templates`, `PATCH/DELETE /api/templates/[id]` | `SectionTemplate` collection | Planned |
| Treatment Templates | `dc_tpl.rx` | `templatesApi`, Template selector & save modal | Same as above | `SectionTemplate` collection | Planned |
| Advice Templates | `dc_tpl.advice` | `templatesApi`, Template selector & save modal | Same as above | `SectionTemplate` collection | Planned |
| Services Templates | `dc_tpl.services` | `templatesApi`, Template selector & save modal | Same as above | `SectionTemplate` collection | Planned |
| Medicine Autocomplete | `dc_med` | `medicinesApi`, `MedicineCombobox` (RTK Query + debounced search) | `GET/POST /api/medicines` | `Medicine` collection | Planned |
| Field Option Popups | `dc_opts`, `#pop` | `fieldOptionsApi`, custom Shadcn Popover/Combobox | `GET/POST /api/field-options` | `FieldOption` collection | Planned |
| Barcode Generation | Custom Code39 SVG | `bwip-js` (CODE128 format, high-res SVG/Canvas) | `/api/barcode/[billNumber]` + client renderer | Derived from `billNumber` | Planned |
| Automatic Pagination | `#ms` height measurement | Dynamic measurement hook (`useDocumentPagination`) | Client-side DOM measurement | Document `pageSettings` | Planned |
| Print Preview | `.pv` CSS class toggle | Dedicated Print Preview component & print styles | Client-side | N/A | Planned |
| HTML Export | Blob download `stdHTML()` | Clean HTML exporter utility function | Client-side export | N/A | Planned |
| Section Reorder/Delete | `data-act="up/dn/del"` | `useFieldArray` / dynamic section manager buttons | Client-side + Save | `sections` JSON array | Planned |
| Item Reorder/Delete | `data-act="ra/rd"` | `useFieldArray` actions for rx, advice, services | Client-side + Save | `sections` JSON array | Planned |
| Inline Document Editing | `contentEditable="true"` | React Hook Form controlled inline editable inputs | Client-side + Save | Form state | Planned |
| Date/Time Picker | HTML5 picker modal | Native / Shadcn popover date/time picker | Client-side + Save | Date strings | Planned |

---

## 10. Architectural Integrity Principles

1. **Zero Redesign**: The generated A4 document must have identical typography (`Constantia`, `Cambria`, `Times New Roman`, `Sylfaen`, `Algerian`, `Nirmala UI`, `Arial Black`), borders (dotted `1.4pt` boxes, solid `1pt` title), and spacing.
2. **Clean State Separation**: Form state lives in React Hook Form; UI mode, current document ID, top spacing, and guidelines live in Redux Toolkit; server data cache lives in RTK Query.
3. **Multi-page Strict Integrity**: The repeated header (double CODE128 barcodes + centered title) and repeated footer (verification signoff + print timestamp) must appear on every page without content clipping.
4. **Vercel & MongoDB Atlas Ready**: 100% serverless compatible, strict ownership validation on all routes, no plain text credentials.
