# PDF Quick Tools

> Free, fast, mobile-friendly PDF utilities with 100% in-browser processing, zero server uploads, and complete data privacy.

PDF Quick Tools is a client-authoritative PDF manipulation suite built with React, Vite, Tailwind CSS, `pdf-lib`, and `JSZip`. It empowers privacy-conscious users in the US, UK, and worldwide to manipulate sensitive PDF documents directly within their web browser.

---

## Features

- **Merge PDF (`/merge-pdf`)**: Combine multiple PDF files with drag-and-drop sequencing and zero quality degradation.
- **Split PDF (`/split-pdf`)**: Separate multi-page PDFs using custom ranges (`1-3; 4-6`) or explode into individual pages with instant ZIP export.
- **Compress PDF (`/compress-pdf`)**: Optimize documents using Deflate object stream consolidation and metadata stripping with honest byte-by-byte reporting.
- **Image to PDF (`/image-to-pdf`)**: Convert JPG, PNG, and WebP images to standardized PDF files with configurable page formats (A4 / US Letter) and margins.
- **Extract Pages (`/extract-pdf-pages`)**: Pull specific page numbers or chapters with an interactive page selector grid.
- **Rotate PDF (`/rotate-pdf`)**: Permanently correct 90°, 180°, and 270° orientation in PDF page catalogs.
- **In-Depth Editorial Guides (`/pdf-guides/*`)**: Practical, original guides on merging, compressing, and splitting PDFs.
- **Trust & Compliance (`/privacy`, `/terms`, `/advertising-disclosure`, `/contact`)**: Complete disclosure of zero-server processing architecture.
- **Optional Adsterra Smartlink Support**: Configurable, non-intrusive sponsored resource placement strictly disabled unless `VITE_ADSTERRA_SMARTLINK_URL` is provided.

---

## Architecture & Privacy Guarantee

- **Zero Server Uploads**: 100% of binary parsing, stream copying, and document generation executes on the client device via JavaScript and WebAssembly.
- **Data Residency**: Confidential contracts, medical forms, and tax documents never leave the user's browser.
- **In-Memory Revocation**: Memory Blobs are automatically freed upon tab closure or tool reset.
- **No Account Barriers**: Zero sign-up walls, paywalls, or artificial download throttles.

---

## Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/pdf-quick-tools.git
cd pdf-quick-tools

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Testing & Quality Assurance

Run the test suite powered by Vitest:

```bash
# Run unit tests
npm test

# Run TypeScript type check
npm run lint

# Build production bundle
npm run build
```

The test suite covers:
- Merging multiple synthetic PDF documents
- Page range parsing and validation (`1-3, 5-8`)
- Splitting into multiple independent PDF documents
- Page rotation angle validation
- Deflate structural compression verification
- File validation & format byte formatting
- Adsterra Smartlink URL validation and disabled state

---

## Vercel Deployment Instructions

PDF Quick Tools is built as a static, client-authoritative Single Page Application and is 100% optimized for deployment on Vercel.

### Method 1: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Method 2: Deploy via GitHub Integration
1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project**.
3. Import your GitHub repository.
4. Set the following build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. *(Optional)* Under **Environment Variables**, add:
   - `VITE_ADSTERRA_SMARTLINK_URL`: Your verified publisher Smartlink URL (leave unset to disable).
6. Click **Deploy**.

### SPA Routing on Vercel
A `vercel.json` configuration file is included in this repository to route all paths (e.g. `/merge-pdf`, `/split-pdf`) to `index.html` for client-side routing.

---

## Custom Domain & HTTPS Setup

1. In your Vercel project settings, go to **Domains**.
2. Add your custom apex domain (e.g., `pdfquicktools.com`) and `www.pdfquicktools.com`.
3. Configure your DNS provider:
   - **A Record**: Point `@` to `76.76.21.21`
   - **CNAME Record**: Point `www` to `cname.vercel-dns.com`
4. Vercel automatically provisions and renews free SSL certificates via Let's Encrypt.

---

## Google Search Console & Sitemap Submission

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your domain property (`pdfquicktools.com`).
3. Verify ownership via DNS TXT record or HTML tag.
4. Navigate to **Sitemaps** in the left sidebar.
5. Enter `sitemap.xml` and click **Submit**.
   - The sitemap is located at `https://pdfquicktools.com/sitemap.xml` and lists all 14 routes.
6. Verify indexing status for all core tool URLs.

---

## Post-Deployment Smoke Test Checklist

After deployment, verify the following:
- [ ] Homepage loads in under 1.5 seconds.
- [ ] Navigation links route correctly to `/merge-pdf`, `/split-pdf`, `/compress-pdf`, etc.
- [ ] Drag-and-drop a multi-page PDF into `/merge-pdf`: merge succeeds and downloads a valid file.
- [ ] Test `/split-pdf` with range `1-2`: creates downloadable output or ZIP.
- [ ] Test `/compress-pdf`: reports honest original vs new byte sizes without layout glitches.
- [ ] Verify that without `VITE_ADSTERRA_SMARTLINK_URL` set, no sponsored banners appear.
- [ ] Inspect DevTools Network tab: verify **zero file data packets** are transmitted to any external backend.
- [ ] Test mobile viewport layout on iOS Safari and Android Chrome.

---

## License

Apache-2.0 License.
