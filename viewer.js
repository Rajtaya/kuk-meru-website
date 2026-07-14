/*
 * viewer.js — in-page, login-gated PDF viewer for the KUK MERU site.
 *
 * Intercepts clicks on local .pdf links/cards and, instead of opening the file,
 * opens a modal that (a) asks the visitor to sign up / log in, then
 * (b) shows the document one server-rendered, watermarked page at a time
 * with Prev / Next controls. The real PDF file is never sent to the browser.
 */
(function () {
    'use strict';

    var state = { name: null, page: 1, pages: 0, email: null };

    // ---- Build modal DOM ----------------------------------------------------
    var overlay = document.createElement('div');
    overlay.className = 'pdfv-overlay';
    overlay.innerHTML = [
        '<div class="pdfv-modal" role="dialog" aria-modal="true">',
        '  <div class="pdfv-head">',
        '    <span class="pdfv-title">Document</span>',
        '    <div class="pdfv-head-right">',
        '      <span class="pdfv-user"></span>',
        '      <button class="pdfv-logout" type="button" hidden>Log out</button>',
        '      <button class="pdfv-close" type="button" aria-label="Close">&times;</button>',
        '    </div>',
        '  </div>',
        '  <div class="pdfv-body">',
        // Auth panel
        '    <div class="pdfv-auth">',
        '      <h3 class="pdfv-auth-title">Sign in to view this document</h3>',
        '      <p class="pdfv-auth-sub">University documents require a free account.</p>',
        '      <form class="pdfv-form">',
        '        <input class="pdfv-email" type="email" placeholder="Email address" autocomplete="email" required>',
        '        <input class="pdfv-pass" type="password" placeholder="Password (min 6 characters)" autocomplete="current-password" required>',
        '        <div class="pdfv-error" hidden></div>',
        '        <button class="pdfv-submit" type="submit">Sign in</button>',
        '      </form>',
        '      <p class="pdfv-toggle-line"><span class="pdfv-toggle-text">New here?</span> <a href="#" class="pdfv-toggle">Create an account</a></p>',
        '    </div>',
        // Viewer panel
        '    <div class="pdfv-viewer" hidden>',
        '      <div class="pdfv-stage"><img class="pdfv-img" alt="Document page"><div class="pdfv-spin">Loading…</div></div>',
        '      <div class="pdfv-nav">',
        '        <button class="pdfv-prev" type="button">&larr; Previous</button>',
        '        <span class="pdfv-count">Page 1 of 1</span>',
        '        <button class="pdfv-next" type="button">Next &rarr;</button>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>'
    ].join('');
    document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(overlay); });

    var $ = function (sel) { return overlay.querySelector(sel); };
    var mode = 'login'; // or 'signup'

    // ---- Helpers ------------------------------------------------------------
    function api(path, opts) {
        return fetch(path, Object.assign({ credentials: 'same-origin' }, opts))
            .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, data: j }; }); });
    }
    function showError(msg) { var e = $('.pdfv-error'); e.textContent = msg; e.hidden = !msg; }
    function setMode(m) {
        mode = m;
        $('.pdfv-auth-title').textContent = m === 'signup' ? 'Create your account' : 'Sign in to view this document';
        $('.pdfv-submit').textContent = m === 'signup' ? 'Create account & view' : 'Sign in';
        $('.pdfv-toggle-text').textContent = m === 'signup' ? 'Already have an account?' : 'New here?';
        $('.pdfv-toggle').textContent = m === 'signup' ? 'Sign in' : 'Create an account';
        $('.pdfv-pass').setAttribute('autocomplete', m === 'signup' ? 'new-password' : 'current-password');
        showError('');
    }
    function openModal() { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeModal() { overlay.classList.remove('open'); document.body.style.overflow = ''; }

    function showAuth() { $('.pdfv-auth').hidden = false; $('.pdfv-viewer').hidden = true; }
    function showViewer() { $('.pdfv-auth').hidden = true; $('.pdfv-viewer').hidden = false; }
    function setUser(email) {
        state.email = email;
        $('.pdfv-user').textContent = email || '';
        $('.pdfv-logout').hidden = !email;
    }

    // ---- Document loading ---------------------------------------------------
    function openDoc(name) {
        state.name = name; state.page = 1;
        openModal();
        api('/api/auth/me').then(function (r) {
            setUser(r.data.email);
            if (r.data.email) { loadInfoAndShow(); }
            else { setMode('login'); showAuth(); $('.pdfv-email').focus(); }
        });
    }
    function loadInfoAndShow() {
        showViewer();
        $('.pdfv-title').textContent = 'Loading…';
        api('/api/doc/' + encodeURIComponent(state.name) + '/info').then(function (r) {
            if (!r.ok) { setMode('login'); showAuth(); showError(r.data.error || 'Please sign in.'); return; }
            state.pages = r.data.pages;
            $('.pdfv-title').textContent = titleCase(r.data.title);
            renderPage();
        });
    }
    function renderPage() {
        var img = $('.pdfv-img'), spin = $('.pdfv-spin');
        spin.hidden = false; img.style.visibility = 'hidden';
        img.onload = function () { spin.hidden = true; img.style.visibility = 'visible'; };
        img.onerror = function () { spin.textContent = 'Could not load page.'; };
        img.src = '/api/doc/' + encodeURIComponent(state.name) + '/page/' + state.page + '.jpg?t=' + Date.now();
        $('.pdfv-count').textContent = 'Page ' + state.page + ' of ' + state.pages;
        $('.pdfv-prev').disabled = state.page <= 1;
        $('.pdfv-next').disabled = state.page >= state.pages;
    }
    function titleCase(s) { return s.replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }

    // ---- Events -------------------------------------------------------------
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('DOMContentLoaded', function () {
        $('.pdfv-close').addEventListener('click', closeModal);
        $('.pdfv-prev').addEventListener('click', function () { if (state.page > 1) { state.page--; renderPage(); } });
        $('.pdfv-next').addEventListener('click', function () { if (state.page < state.pages) { state.page++; renderPage(); } });
        $('.pdfv-toggle').addEventListener('click', function (e) { e.preventDefault(); setMode(mode === 'login' ? 'signup' : 'login'); });
        $('.pdfv-logout').addEventListener('click', function () {
            api('/api/auth/logout', { method: 'POST' }).then(function () { setUser(null); setMode('login'); showAuth(); });
        });
        $('.pdfv-form').addEventListener('submit', function (e) {
            e.preventDefault();
            showError('');
            var email = $('.pdfv-email').value.trim();
            var password = $('.pdfv-pass').value;
            var ep = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
            $('.pdfv-submit').disabled = true;
            api(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, password: password }) })
                .then(function (r) {
                    $('.pdfv-submit').disabled = false;
                    if (!r.ok) { showError(r.data.error || 'Something went wrong.'); return; }
                    setUser(r.data.email);
                    loadInfoAndShow();
                });
        });
    });
    document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('open')) return;
        if (e.key === 'Escape') closeModal();
        else if (e.key === 'ArrowLeft' && !$('.pdfv-viewer').hidden && state.page > 1) { state.page--; renderPage(); }
        else if (e.key === 'ArrowRight' && !$('.pdfv-viewer').hidden && state.page < state.pages) { state.page++; renderPage(); }
    });

    // ---- Intercept local PDF clicks (capture phase, before other handlers) --
    function localPdfName(ref) {
        if (!ref) return null;
        if (/^https?:\/\//i.test(ref) || ref.charAt(0) === '#') return null; // external / anchor
        var m = ref.match(/([^/]+\.pdf)(\?.*)?$/i);
        return m ? m[1] : null;
    }
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href$=".pdf" i]');
        var card = e.target.closest('[data-href$=".pdf" i]');
        var ref = a ? a.getAttribute('href') : (card ? card.getAttribute('data-href') : null);
        var name = localPdfName(ref);
        if (!name) return;
        e.preventDefault();
        e.stopImmediatePropagation();   // stop script.js window.open + anchor default
        openDoc(name);
    }, true);
})();
