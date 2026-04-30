# QR Generator Project Workflow

## 1) Project Purpose

This project is a branded QR code generator built with Next.js (App Router) and Tailwind CSS.

Core capabilities:
- Generate a styled QR code from a URL.
- Apply brand color to QR dots and finder patterns.
- Optionally include/remove a center emblem.
- Download generated QR as JPG or PDF.
- Deploy as a static site to GitHub Pages.

---

## 2) High-Level Architecture

### Frontend stack
- Next.js (App Router, static export mode)
- React client components
- Tailwind CSS utility styling
- Canvas 2D drawing for QR rendering

### Main files
- `src/app/layout.tsx`  
  Root HTML shell, fonts, metadata.
- `src/app/page.tsx`  
  Main page orchestration and state management.
- `src/components/controls-panel.tsx`  
  URL input, color picker, remove-emblem toggle, download buttons.
- `src/components/qr-preview.tsx`  
  QR drawing logic on canvas.
- `src/components/download-buttons.tsx`  
  JPG/PDF export actions.
- `next.config.ts`  
  Static export + GitHub Pages base path behavior.
- `public/*`  
  Brand assets (`select-logo-clean.png`, `center-emblem.jpg`, etc).

---

## 3) Runtime Logical Flow

## 3.1 App initialization
1. `Home` component mounts in `src/app/page.tsx`.
2. Initial state is set:
   - `url` default value
   - `color` default brand color
   - `removeEmblem` default `false`
   - `isGenerating` default `false`
3. Dark mode class is added on mount.

## 3.2 Input and validation flow
1. User updates URL/color/toggle in `ControlsPanel`.
2. `Home` owns these values and updates local state via callbacks.
3. URL validation (`isValidUrl`) runs through memoized error state:
   - Empty URL -> "URL is required."
   - Invalid URL/protocol -> validation message
4. If URL is invalid, QR value passed to preview is blank and download is disabled.

## 3.3 QR render pipeline
Triggered when any dependency changes (`url`, `color`, `removeEmblem`, `canvasRef`):

1. `QRPreview` effect starts and marks loading = true.
2. Creates QR matrix using `qrcode` library with error correction `H`.
3. Clears canvas and paints light background.
4. Iterates matrix modules:
   - Skips false modules.
   - Skips finder areas (top-left, top-right, bottom-left).
   - Draws circular dots for remaining modules in selected color.
5. Draws custom rounded finder patterns.
6. If emblem is enabled:
   - Computes center safe area.
   - Leaves center area clear (prevents overlap artifacts).
   - Draws center emblem in a subtle square badge.
7. Ends loading state.

Error handling:
- Any rendering error clears canvas gracefully.

## 3.4 Download workflow
In `download-buttons.tsx`:

- JPG:
  1. Read canvas as JPEG data URL.
  2. Trigger browser file download.

- PDF:
  1. Dynamically import `jspdf`.
  2. Read canvas JPEG data URL.
  3. Create PDF sized to canvas.
  4. Embed image and save file.

Downloads are disabled when:
- URL validation fails, or
- QR is currently generating.

---

## 4) Component Responsibility Map

- `Home` (`page.tsx`)
  - Owns all shared state.
  - Validates URL.
  - Passes props/callbacks to child components.
  - Controls top-level layout and branding.

- `ControlsPanel`
  - Emits user actions only.
  - Does not own business state.
  - Hosts download controls in same panel section.

- `QRPreview`
  - Pure rendering engine for the visual QR style.
  - Handles loading and draw lifecycle.

- `DownloadButtons`
  - Pure export utility actions for current canvas.

---

## 5) Styling and Responsiveness Workflow

- Tailwind classes define all layout and breakpoints.
- Main page uses a responsive two-column grid on large screens.
- Stacked order on smaller screens.
- Card components provide consistent visual language (glass/blur border style).
- Canvas is constrained with responsive max widths to preserve scan quality and UI fit.

---

## 6) Asset Workflow

Brand assets in `public/` are served as static files:
- Main logo: `select-logo-clean.png`
- QR center emblem: `center-emblem.jpg`

Important:
- If a logo visual still looks old, update file name/query string to bust browser cache.

---

## 7) Build and Deployment Workflow

## 7.1 Local development
- Run `npm run dev`
- App runs locally (configured host/port in scripts).

## 7.2 Production build
- Run `npm run build`
- Next.js exports static site output (`out/`).

## 7.3 GitHub Pages deployment
Workflow file:
- `.github/workflows/deploy-pages.yml`

Pipeline:
1. Checkout code
2. Install dependencies (`npm ci`)
3. Build static export
4. Upload `out/` artifact
5. Deploy to Pages

Config behavior:
- `next.config.ts` uses GitHub Pages repo `basePath` only during CI builds (`GITHUB_ACTIONS=true`).
- Local dev stays at root path.

Published URL:
- `https://rashid-droi.github.io/QR-Code-generator-with-logo/`

---

## 8) Operational Checklist (for stable releases)

Before pushing:
1. `npm run build`
2. Ensure no broken imports or missing files.
3. Verify logo/emblem paths exist in `public/`.
4. Confirm `next.config.ts` Pages basePath logic is unchanged.

After pushing:
1. Verify GitHub Actions deploy status is green.
2. Open Pages URL with hard refresh.
3. Confirm:
   - Styled UI is loaded (not plain HTML fallback)
   - QR renders
   - Downloads work
   - Logo/emblem visual is correct

---

## 9) Common Failure Modes and Root Causes

- Plain/raw HTML UI on Pages  
  Usually CSS/JS `_next` assets not loading due to wrong basePath/deploy source.

- Missing logo/emblem  
  Wrong static path, stale cache, or missing file in `public/`.

- Download buttons not visible  
  Layout placement issue or component not mounted where expected.

- QR blank  
  Invalid URL state or canvas draw error.

---

## 10) Suggested Next Improvements

- Add automated smoke checks for Pages path correctness.
- Add unit tests for URL validation and download disabled logic.
- Add visual regression snapshots for key breakpoints.
- Add explicit runtime error banner for failed QR rendering.
