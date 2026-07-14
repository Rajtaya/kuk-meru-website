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

## Required Railway settings (do these once, in the Railway dashboard)

1. **Environment variables** (Service → Variables):
   - `JWT_SECRET` = a long random string (e.g. `openssl rand -hex 32`).
     Required — without it, everyone gets logged out on every restart.
   - `NODE_ENV` = `production`  (enables secure cookies behind Railway's proxy).
   - `DATA_DIR` = `/data`

2. **Volume** (Service → Settings → Volumes): add a volume mounted at `/data`.
   User accounts live in `/data/users.json`. **Without a volume, all accounts
   are wiped on every redeploy** (the container filesystem is ephemeral).

That's it — `git push` redeploys as usual.

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
