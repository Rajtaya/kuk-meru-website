# Handoff: Content Protection + Login-Gated Watermarked PDF Viewer — KUK MERU Website

**Date:** 14 July 2026
**Scope:** Stop casual content copying, and put the PDF documents behind sign-up with server-side, per-viewer watermarking.
**Repo:** https://github.com/Rajtaya/kuk-meru-website
**Live:** https://kukmeru.up.railway.app
**Local path:** none on disk — `git clone` from GitHub to work on it.

---

## 1. Summary

This session did two things:

1. **Added a content-copy deterrent layer** to the public page (right-click / copy / selection / image-drag / devtools-shortcut blocking) plus a visible `© 2026` footer.
2. **Converted the site from a pure static site into a small Node/Express app** so the PDFs can be gated behind a login and served as **server-rendered, watermarked page images** instead of raw files.

**The public page is unchanged for visitors** — it still loads for everyone. What changed is that the ~13 PDF documents are no longer downloadable files; they open in an in-page viewer that requires a free account, one watermarked page at a time.

> ⚠️ **Reality check that was repeated to the stakeholder:** none of this "completely" stops copying — a logged-in user can still screenshot their own view. The point of the maximum-tier design is that every rendered page carries **the viewer's own email**, so any leak is traceable to an account, and the raw PDF file is never exposed.

**Architecture change:** `npm start` used to be `npx serve -s .` (static). It is now `node server.js` (Express). Railway runs `npm start`, so the switch was automatic on push.

---

## 2. Content-copy deterrent layer (public page)

Files: `protect.js` (new), CSS block at top + bottom of `style.css`, one `<script>` tag in `index.html`.

`protect.js` cancels browser events:

| Blocked | Event / mechanism |
|---|---|
| Right-click menu | `contextmenu` → `preventDefault` |
| Copy / Cut | `copy`,`cut` → `preventDefault` + overwrite clipboard with a `©` notice |
| Text selection | CSS `user-select:none` **+** `selectstart` handler |
| Image drag-to-save | `dragstart` on `IMG` + CSS `-webkit-user-drag:none` |
| iOS long-press menu | CSS `-webkit-touch-callout:none` |
| F12 / Ctrl+U / Ctrl+S / Ctrl+Shift+I,J,C | `keydown` → `preventDefault` |

Also added a visible footer line in `index.html`: `© 2026 Kurukshetra University. All rights reserved.`

These are **deterrents only** (bypassable via JS-disable, reader mode, screenshots). They stop casual copying, nothing more.

---

## 3. Login-gated watermarked PDF viewer (the main feature)

Chosen options (per stakeholder): **page public, PDFs gated · public self sign-up · maximum protection tier.**

### 3.1 Backend — `server.js` (Express)
- Serves the static site to everyone (`express.static`).
- **Blocks every direct `.pdf` URL with 403** (guard middleware before static). PDFs are read from disk server-side only.
- **Auth:** public self sign-up (`POST /api/auth/signup`), login, logout, `me`. Passwords hashed with `bcryptjs`. Session = httpOnly JWT cookie (`kuk_session`, 7-day). Accounts stored in `DATA_DIR/users.json`.
- **PDF endpoints (auth required):**
  - `GET /api/doc/:name/info` → `{ pages, title }`
  - `GET /api/doc/:name/page/:n.jpg` → renders page *n* to a JPEG, **stamps a diagonal watermark carrying `req.user.email`**, returns the image. `Cache-Control: private, no-store`.
- Rendering: `pdfjs-dist` (legacy build) draws the page onto an `@napi-rs/canvas` canvas; the watermark is drawn on the same canvas; `canvas.encode('jpeg', 82)`.
- Document whitelist auto-discovered by scanning repo root for `*.pdf` at startup (prevents path traversal — only real files render).

### 3.2 Front-end — `viewer.js` + `.pdfv-*` CSS in `style.css`
- **Intercepts** clicks on any local `.pdf` link/card in **capture phase** (`preventDefault` + `stopImmediatePropagation`), so the file never opens and `script.js`'s `window.open` is suppressed. External `https://` links (kuk.ac.in) are left alone.
- Opens a themed modal:
  - Not logged in → login / sign-up form (toggle).
  - Logged in → single-page image viewer with **Prev / Next**, `Page X of N`, email + Log out in the header. Arrow keys + Esc supported.
- Images come from `/api/doc/:name/page/:n.jpg` (cookie sent automatically).

### 3.3 Wiring in `index.html`
Scripts at the bottom, in order: `script.js`, `viewer.js`, `protect.js`.

---

## 4. Watermark

Drawn server-side in `server.js` → `stampWatermark(ctx, w, h, email)`:
- Tiled, diagonal (−30°), semi-transparent (`globalAlpha 0.16`), red (`#C0392B`).
- Two lines per tile: `KURUKSHETRA UNIVERSITY` (bold) and `<viewer-email> · © 2026`.
- Uses a **bundled font** (see §7 gotcha #2), not `sans-serif`.

To change wording/opacity/size, edit `stampWatermark`. It re-renders on every request (no cached watermarked images — the email is per-user).

---

## 5. New files & dependencies

**New files:** `server.js`, `viewer.js`, `protect.js`, `fonts/watermark.ttf`, `fonts/watermark-bold.ttf`, `DEPLOY-NOTES.md`, `package-lock.json`.
**Modified:** `index.html` (script tags + footer), `style.css` (deterrent + `.pdfv-*` viewer styles), `package.json` (start script + deps), `.gitignore` (`node_modules/`, `data/`, `.env`).

**Dependencies** (`package.json`): `express`, `cookie-parser`, `bcryptjs`, `jsonwebtoken`, `pdfjs-dist`, `@napi-rs/canvas`.
`fonts/watermark*.ttf` are Liberation Sans (SIL OFL, copied from `pdfjs-dist/standard_fonts/`) — safe to redistribute.

---

## 6. Deployment / running

**Local:**
```bash
git clone https://github.com/Rajtaya/kuk-meru-website.git
cd kuk-meru-website
npm install
JWT_SECRET=devsecret PORT=4700 node server.js   # http://localhost:4700
```

**Railway** (auto-deploy on push to `main`). Config is **already done** (via Railway CLI, 14 Jul 2026) and verified — an account created before a redeploy still logged in after it:
- Env vars: `JWT_SECRET` (64-hex), `NODE_ENV=production`, `DATA_DIR=/data`.
- Volume `kuk-meru-website-volume` mounted at `/data` (accounts persist here).

Rotate the JWT secret (logs everyone out once):
`railway variables --set "JWT_SECRET=$(openssl rand -hex 32)"`

> Note: repo has `.github/workflows/node.js.yml` (default Node CI). It does not affect Railway deploys but may show a failing check if it runs `npm test` (there are no tests). Remove or adjust if the red check is noise.

---

## 7. Gotchas learned (both only surfaced in prod, not locally)

1. **`Path2D is not defined`** — pdfjs's canvas renderer needs browser globals (`Path2D`, `DOMMatrix`, …) that Node lacks. Fixed by assigning them from `@napi-rs/canvas` onto `globalThis` at the top of `server.js`.
2. **Invisible watermark on Railway** — the container has **no system fonts**, so `ctx.fillText` silently drew nothing (PDF body text still rendered because pdfjs handles its own fonts). Fixed by bundling Liberation Sans under `fonts/` and registering it via `GlobalFonts.registerFromPath(..., 'WM'/'WMBold')`, then using those families in `stampWatermark`.

Locally on macOS both were fine (mac provides `Path2D` + fonts), so **always test rendering against the live Railway deploy**, not just local.

---

## 8. Open items / follow-ups (not blocking)

- **No rate-limiting** on `/api/auth/*` — add `express-rate-limit` if brute-force/abuse appears.
- **Open sign-up** — anyone can register (viewer-only, no privileges). If access should be controlled, switch to admin-created/approved accounts (needs a small admin page + a role flag in `users.json`).
- **No delete-user / admin UI.** A leftover test account exists in prod: `persist-check@kuk.ac.in` / `persist123` (harmless, viewer-only).
- **First render of `faculty-publications.pdf`** (183 pages, 11 MB) is a touch slower; the document stays cached in memory after first open.
- **`iks-courses.pdf` Hindi text** still renders Devanagari as blocks (pre-existing, see the 4 June handoff §7).

---

## 9. Contact

**Developer:** Aarya
**Email:** Rajtaya@kuk.ac.in
**University Website:** www.kuk.ac.in
