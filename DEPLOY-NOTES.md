# Deploy notes — v2 (login-gated PDF viewer)

The site is no longer a static site. It's a small Node/Express app:
`npm start` → `node server.js`. Railway runs this automatically.

## What changed
- **Page stays public.** index.html / css / js / images serve to everyone.
- **PDFs are gated.** Direct `.pdf` URLs now return **403**. PDFs are only
  viewable inside the in-page viewer, after sign-up/login, one page at a time.
- **Maximum protection.** Each page is rendered **server-side** to a JPEG and
  stamped with the **viewer's own email** (watermark). The real PDF file never
  reaches the browser — so a leaked screenshot is traceable to an account.
- **Auth.** Public self sign-up (email + password). Passwords are bcrypt-hashed.
  Sessions are httpOnly JWT cookies (7-day).

## Required Railway settings — ✅ DONE (configured via Railway CLI)

These were applied to the `kuk-meru-website` service (production) and verified
(an account created before a redeploy still logged in after it):

1. **Environment variables** — set:
   - `JWT_SECRET` = 64-char random hex (set via `openssl rand -hex 32`).
   - `NODE_ENV` = `production`  (secure cookies behind Railway's proxy).
   - `DATA_DIR` = `/data`

2. **Volume** — `kuk-meru-website-volume` attached at `/data` (5 GB).
   User accounts live in `/data/users.json` and now persist across redeploys.

`git push` redeploys as usual. To rotate the JWT secret later:
`railway variables --set "JWT_SECRET=$(openssl rand -hex 32)"` (logs everyone out once).

## Files
- `server.js` — Express app: static hosting, auth, PDF→image rendering + watermark.
- `viewer.js` — front-end modal: intercepts PDF clicks, login/signup UI, page nav.
- `style.css` — viewer styling appended at the bottom (`.pdfv-*`).
- `protect.js` — the earlier copy-deterrent layer (right-click/copy/keys).

## Known follow-ups (optional, not blocking)
- **No rate-limiting** on login/signup yet — add `express-rate-limit` if abuse appears.
- **Open sign-up** means anyone can register. If you later want approval-based
  access, switch the account model to admin-created accounts.
- First render of the 183-page `faculty-publications.pdf` page is a touch slower
  (large file); subsequent pages are fine (document stays cached in memory).
