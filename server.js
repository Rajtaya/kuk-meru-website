/*
 * server.js — KUK MERU site backend.
 *
 * - Serves the public page (index.html, css, js, images) to everyone.
 * - Blocks ALL direct .pdf URLs (403) so documents can't be grabbed by URL.
 * - Public self sign-up (email + password), sessions via httpOnly JWT cookie.
 * - "Maximum" PDF protection: each page is rendered server-side to a JPEG,
 *   stamped with the *viewer's own email*, and streamed to the browser.
 *   The real PDF file never leaves the server.
 */
'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const canvasLib = require('@napi-rs/canvas');
const { createCanvas } = canvasLib;
// pdfjs renders against browser globals (Path2D, DOMMatrix, …) that Node lacks.
// @napi-rs/canvas provides them — expose on globalThis before any page render.
['Path2D', 'DOMMatrix', 'ImageData', 'DOMPoint', 'DOMRect'].forEach(function (g) {
    if (canvasLib[g] && !globalThis[g]) globalThis[g] = canvasLib[g];
});
// Register a bundled font so watermark text renders even on font-less containers
// (Railway has no system fonts, so ctx.fillText would silently draw nothing).
try {
    canvasLib.GlobalFonts.registerFromPath(path.join(__dirname, 'fonts', 'watermark.ttf'), 'WM');
    canvasLib.GlobalFonts.registerFromPath(path.join(__dirname, 'fonts', 'watermark-bold.ttf'), 'WMBold');
} catch (e) {
    console.warn('[warn] could not register watermark font:', e && e.message);
}

const ROOT = __dirname;
const PORT = process.env.PORT || 4700;
const PROD = !!process.env.RAILWAY_ENVIRONMENT_NAME || process.env.NODE_ENV === 'production';

// --- Secrets & storage ------------------------------------------------------
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
if (!process.env.JWT_SECRET) {
    console.warn('[warn] JWT_SECRET not set — using an ephemeral secret. ' +
        'Sessions will reset on restart. Set JWT_SECRET in production.');
}
// Persist users on a mounted volume in prod (set DATA_DIR=/data + attach a Railway volume).
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function loadUsers() {
    try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
    catch { return {}; }
}
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// --- Document whitelist (auto-discovered .pdf files at repo root) ------------
function listDocs() {
    return fs.readdirSync(ROOT)
        .filter((f) => f.toLowerCase().endsWith('.pdf'))
        .reduce((map, f) => { map[f] = path.join(ROOT, f); return map; }, {});
}
const DOCS = listDocs();

// --- App --------------------------------------------------------------------
const app = express();
if (PROD) app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());

// Block any direct request for a PDF file (public URLs must 403).
app.use((req, res, next) => {
    if (/\.pdf(\?|$)/i.test(req.path)) {
        return res.status(403).json({ error: 'This document is protected. Please sign in to view it.' });
    }
    next();
});

// --- Auth helpers -----------------------------------------------------------
function issueSession(res, email) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('kuk_session', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: PROD,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}
function requireAuth(req, res, next) {
    const token = req.cookies && req.cookies.kuk_session;
    if (!token) return res.status(401).json({ error: 'Login required.' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    }
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Auth routes ------------------------------------------------------------
app.post('/api/auth/signup', async (req, res) => {
    const email = String((req.body.email || '')).trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    const users = loadUsers();
    if (users[email]) return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
    users[email] = { hash: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() };
    saveUsers(users);
    issueSession(res, email);
    res.json({ email });
});

app.post('/api/auth/login', async (req, res) => {
    const email = String((req.body.email || '')).trim().toLowerCase();
    const password = String(req.body.password || '');
    const users = loadUsers();
    const rec = users[email];
    if (!rec || !(await bcrypt.compare(password, rec.hash))) {
        return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    issueSession(res, email);
    res.json({ email });
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('kuk_session');
    res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
    const token = req.cookies && req.cookies.kuk_session;
    if (!token) return res.json({ email: null });
    try { res.json({ email: jwt.verify(token, JWT_SECRET).email }); }
    catch { res.json({ email: null }); }
});

// --- PDF rendering ----------------------------------------------------------
let pdfjs = null;
async function getPdfjs() {
    if (!pdfjs) pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    return pdfjs;
}
const pdfDocCache = new Map();           // name -> loaded pdfjs document (page count / pages)
async function loadPdf(name) {
    if (pdfDocCache.has(name)) return pdfDocCache.get(name);
    const lib = await getPdfjs();
    const data = new Uint8Array(fs.readFileSync(DOCS[name]));
    const doc = await lib.getDocument({
        data,
        useSystemFonts: true,
        isEvalSupported: false,
        standardFontDataUrl: path.join(ROOT, 'node_modules/pdfjs-dist/standard_fonts/'),
    }).promise;
    pdfDocCache.set(name, doc);
    return doc;
}

// Draw a tiled, diagonal, semi-transparent watermark carrying the viewer's email.
function stampWatermark(ctx, w, h, email) {
    const line1 = 'KURUKSHETRA UNIVERSITY';
    const line2 = `${email}  ·  © 2026`;
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = '#C0392B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const step = Math.max(240, Math.round(w / 2.2));
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.translate(-w / 2, -h / 2);
    const big = Math.max(16, Math.round(w / 26));
    for (let y = -h; y < h * 2; y += step) {
        for (let x = -w; x < w * 2; x += step * 1.6) {
            ctx.font = `${big}px WMBold`;
            ctx.fillText(line1, x, y);
            ctx.font = `${Math.round(big * 0.6)}px WM`;
            ctx.fillText(line2, x, y + big * 0.95);
        }
    }
    ctx.restore();
}

app.get('/api/doc/:name/info', requireAuth, async (req, res) => {
    const name = req.params.name;
    if (!DOCS[name]) return res.status(404).json({ error: 'Document not found.' });
    try {
        const doc = await loadPdf(name);
        res.json({ name, pages: doc.numPages, title: name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ') });
    } catch (e) {
        console.error('info error', name, e);
        res.status(500).json({ error: 'Could not open document.' });
    }
});

app.get('/api/doc/:name/page/:n', requireAuth, async (req, res) => {
    const name = req.params.name;
    const n = parseInt(String(req.params.n).replace(/\.jpe?g$/i, ''), 10);
    if (!DOCS[name]) return res.status(404).json({ error: 'Document not found.' });
    try {
        const doc = await loadPdf(name);
        if (!(n >= 1 && n <= doc.numPages)) return res.status(400).json({ error: 'Invalid page.' });
        const page = await doc.getPage(n);
        const scale = 1.6;
        const viewport = page.getViewport({ scale });
        const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        stampWatermark(ctx, canvas.width, canvas.height, req.user.email);
        const buf = await canvas.encode('jpeg', 82);
        res.set('Content-Type', 'image/jpeg');
        res.set('Cache-Control', 'private, no-store');   // never cache the personalised page
        res.send(buf);
    } catch (e) {
        console.error('render error', name, n, e);
        res.status(500).json({ error: 'Could not render page.', detail: String(e && e.stack || e).slice(0, 500) });
    }
});

// --- Static site (public). PDF guard above already blocks .pdf requests. ----
app.use(express.static(ROOT, { extensions: ['html'] }));

app.listen(PORT, () => {
    console.log(`KUK MERU server on :${PORT}  (prod=${PROD}, docs=${Object.keys(DOCS).length})`);
});
