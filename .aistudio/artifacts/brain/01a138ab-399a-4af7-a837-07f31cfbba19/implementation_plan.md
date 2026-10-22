# PDF Quick Tools

A high-performance, privacy-first web platform for fast, zero-upload PDF utilities (Merge, Split, Compress, Image to PDF, Extract Pages, Rotate) running entirely in the browser with responsive UI, detailed technical guides, and configurable Adsterra monetization.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed during Phase 1:
> - **Architecture**: Vite React SPA with client-side path routing, browser-authoritative processing, zero file uploads to servers, and static SEO artifacts.
> - **Compression Strategy**: Hybrid optimization combining lossless PDF stream rewrite / metadata cleanup with optional canvas-based image downsampling for high-density scanned files.
> - **Adsterra Smartlink Mode**: Placements remain strictly disabled unless the `ADSTERRA_SMARTLINK_URL` environment variable is explicitly supplied, ensuring zero intrusive or deceptive ads.

- **Confirmed Decision 1**: Client-side execution via `pdf-lib` and `pdfjs-dist` ensuring 100% data privacy (no server-side uploads or file retention risk).
- **Confirmed Decision 2**: Multi-page output options (ZIP download via `jszip` or individual document extraction) for Split PDF operations.
- **Confirmed Decision 3**: Complete set of 14 indexable routes including 6 dedicated tool interfaces, 3 in-depth editorial guides, a guides directory, and trust/legal pages.

---

## 1. Overview & Core Concept

- **What It Does**: PDF Quick Tools empowers everyday users, business professionals, and students to perform essential PDF modifications directly in their web browser without file size caps, queue delays, email signups, or uploading sensitive documents to third-party cloud servers.
- **Target Audience / Persona**: US and UK privacy-conscious professionals, remote workers, students, legal/finance staff, and mobile users needing instant, trustworthy PDF manipulation.
- **Key Value**: Instantaneous client-side execution, zero data leakage, and a clean productivity interface with no dark patterns or fake download buttons.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Tool Selection**: User arrives at the homepage or direct tool route (`/merge-pdf`, `/split-pdf`, `/compress-pdf`, `/image-to-pdf`, `/extract-pdf-pages`, `/rotate-pdf`), greeted by a focused header, tool summary, and drag-and-drop dropzone.
2. **File Staging & Validation**: Files dropped or picked via file browser are immediately inspected using byte magic signatures (`%PDF-`, PNG/JPEG signatures), displaying page count, file size, and thumbnail previews.
3. **Interactive Configuration**:
   - *Merge*: Drag or use keyboard up/down arrows to reorder documents in the merge sequence.
   - *Split / Extract*: Input page ranges (e.g. `1-3, 5, 8-10`) with live validation against total document pages.
   - *Compress*: Select between lossless structural cleanup or aggressive scanned downsampling with projected results.
   - *Image to PDF*: Set page orientation (Portrait / Landscape / Auto), page size (A4 / US Letter / Fit), and margin padding.
   - *Rotate*: Select 90°, 180°, or 270° clockwise rotation for all or selected pages.
4. **Processing & Immediate Output**: The action button triggers synchronous or chunked Web Worker execution with an honest progress indicator, resulting in direct in-memory Blob generation, instant download trigger, and size savings reporting.

### Visual Identity & Theme
- **Aesthetic Direction**: Restrained, editorial productivity tool inspired by high-end Swiss typography and minimalist desktop utilities.
- **Color Palette**:
  - Neutral Canvas: Off-white / zinc-50 (`#FAFAFA` and `#FFFFFF`) with subtle slate borders (`#E2E8F0`).
  - Typography: Charcoal and deep slate (`#0F172A` headings, `#334155` body text).
  - Accent: Restrained crimson / vermilion (`#DC2626` and `#B91C1C`) for focal CTAs, active dropzones, and brand marks.
  - Success / Warning: Emerald (`#16A34A`) for compression reductions; Amber (`#D97706`) for negligible changes.
- **Typography & Hierarchy**:
  - Primary UI & Display: `Plus Jakarta Sans` / modern system sans stack.
  - Tabular & Technical Data: `JetBrains Mono` / `tabular-nums` for file sizes, page counts, and byte counters.
- **Anti-Slop Discipline**:
  - No decorative pulsing dots, no fake AI scorecards, no candy pill badges.
  - Metadata rendered as clean unboxed text separated by typographic middots (`·`).
  - Top navigation strictly adheres to the 3-Zone Contract: Brand Wordmark — Navigation Links — Primary Action.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Zero-Server Processing Architecture**
  - *Chosen Approach*: Execute 100% of PDF inspection, merging, splitting, rasterization, and assembly in the client's browser using `pdf-lib`, `pdfjs-dist`, and `jszip`.
  - *Why*: Eliminates security vulnerabilities, server storage costs, privacy leaks, and GDPR/CCPA data controller compliance overhead.
  - *Trade-Off*: Constrained by client device RAM for multi-gigabyte files; mitigated with client-side file size guards (100MB per file warning).

- **Decision 2: Transparent PDF Compression Reporting**
  - *Chosen Approach*: Honest size comparisons before and after processing. If structural rewriting yields negligible savings or increases size due to embedded streams, the user is honestly informed with options to apply canvas-based image downsampling.
  - *Why*: Avoids deceptive progress bars and misleading claims common to low-quality utility sites.

- **Decision 3: Non-Deceptive Monetization Architecture**
  - *Chosen Approach*: Clean, isolated `<AdsterraPlacement />` component that checks `ADSTERRA_SMARTLINK_URL`. If unset, nothing is rendered. When active, it renders as a distinctly labeled "Sponsored Resource" external link, never spoofing a download button or gating file processing.
  - *Why*: Conforms strictly to Google Search Quality Rater Guidelines, Better Ads Standards, and Adsterra compliance policies.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PDF Quick Tools Frontend                        │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Wordmark · Tools · Guides · Privacy)            │
├────────────────────────────────────────────────────────────────────────┤
│  Active Route View                                                     │
│   ├── Tool Workspace (Merge / Split / Compress / ImageToPdf / Rotate)  │
│   │    ├── FileDropzone (Signature verification, drag-and-drop)        │
│   │    ├── ItemList / ReorderControls / PageSelector                   │
│   │    ├── ProcessingEngine (pdf-lib, pdfjs-dist, jszip)               │
│   │    └── ResultDownloadCard (Direct Blob stream, byte stats)         │
│   ├── SEO Guides & Educational Articles (/pdf-guides/*)                │
│   ├── Legal & Trust (Privacy Policy, Terms, Ad Disclosure, Contact)    │
│   └── SponsoredResourceSlot (Optional Adsterra Smartlink, conditional) │
├────────────────────────────────────────────────────────────────────────┤
│  Browser Memory & Execution Sandbox (Zero Server Upload)               │
│   ├── ArrayBuffer / Uint8Array PDF parsing                             │
│   ├── HTML5 Canvas rasterization & JPEG re-encoding                   │
│   └── In-memory Object URL creation and automatic revocation           │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & State Mapping
- `usePdfTools`: Encapsulates file reading, array buffer caching, and error normalization.
- `FileDropzone`: Handles `dragenter`, `dragleave`, `drop`, and `<input type="file">` change events; inspects file headers (`%PDF-`, `\xFF\xD8\xFF`, `\x89PNG`).
- `ReorderableFileList`: Supports mouse drag-and-drop and accessible keyboard buttons (move up / down / remove).
- `PageRangeParser`: Parses and validates tokens like `1-4, 7, 9-12` against `doc.getPageCount()`, catching out-of-bound or inverted ranges with clear user feedback.
- `CompressEngine`: Attempts structural object rewrite first; if high-DPI image reduction is toggled, renders pages to offscreen canvas and recompresses with configurable JPEG quality.
- `AnalyticsModule`: Privacy-conscious aggregate event tracker that never logs filenames, personal data, or file contents.

### Routes to Implement
1. `/` – Platform Homepage & Tool Hub
2. `/merge-pdf` – Merge PDF Files
3. `/split-pdf` – Split PDF by Ranges & Individual Pages
4. `/compress-pdf` – Honest Hybrid PDF Compressor
5. `/image-to-pdf` – Convert JPG/PNG to Configurable PDF
6. `/extract-pdf-pages` – Extract Specific Pages into New PDF
7. `/rotate-pdf` – Rotate Pages 90°/180°/270°
8. `/pdf-guides` – Guides Index
9. `/pdf-guides/how-to-merge-pdf-files` – Editorial Merge Guide
10. `/pdf-guides/how-to-compress-a-pdf` – Editorial Compression Guide
11. `/pdf-guides/how-to-split-a-pdf` – Editorial Split Guide
12. `/privacy` – Transparent Privacy Policy (Zero Upload guarantee)
13. `/terms` – Terms of Service
14. `/advertising-disclosure` – Adsterra & Advertising Disclosure
15. `/contact` – Contact & Feedback Information

---

## 5. Verification & Testing Plan

### Automated Unit Tests (`npm test` / vitest)
1. **PDF Merging**: Merging multiple synthetic PDFs into a single valid document with verified combined page count.
2. **Page Range Parsing**: Validating complex string formats (`1-3, 5, 8`), syntax errors, out-of-range indexes, and negative values.
3. **Page Splitting & Extraction**: Generating independent PDF documents containing only requested pages.
4. **Page Rotation**: Applying 90°, 180°, and 270° rotation tags and validating `page.getRotation().angle`.
5. **Image to PDF**: Converting JPEG/PNG binary data into standard PDF pages with correct dimensions.
6. **Compression Analysis**: Verifying accurate byte calculation, percentage calculation, and fallback states.
7. **Adsterra Smartlink Security**: Verifying that without `ADSTERRA_SMARTLINK_URL` configured, no ad element or outbound link is rendered.

### Production Build & Linting
- Run `npm run build` to verify Vite bundle compilation and strict TypeScript typechecking.
- Validate sitemap and robots.txt generation.
