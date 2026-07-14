/*
 * protect.js — content-copy deterrent layer for the KUK MERU site.
 *
 * IMPORTANT: this only stops CASUAL copying. It cannot stop anyone who
 * opens DevTools, disables JavaScript, uses Reader Mode, or screenshots.
 * The PDFs opened in a new tab are NOT covered by this (the browser's own
 * PDF viewer controls save/print). Real protection is legal (© + DMCA).
 */
(function () {
    'use strict';

    var notice = '© Kurukshetra University. Content is protected. ' +
        'For permission to reuse, contact Rajtaya@kuk.ac.in';

    // 1. Block the right-click context menu.
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    // 2. Block text selection (belt-and-suspenders with the CSS rule).
    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
        return false;
    });

    // 3. Block copy / cut — and drop the notice onto the clipboard if it slips through.
    ['copy', 'cut'].forEach(function (evt) {
        document.addEventListener(evt, function (e) {
            e.preventDefault();
            if (e.clipboardData) {
                e.clipboardData.setData('text/plain', notice);
            }
        });
    });

    // 4. Block dragging images out to the desktop / another tab.
    document.addEventListener('dragstart', function (e) {
        if (e.target && e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // NOTE: We intentionally do NOT block keyboard shortcuts (F12, Ctrl+U,
    // Ctrl+S, Ctrl+Shift+I/J/C). They annoy honest users (can't save the
    // page, can't use the browser normally) while doing nothing to stop a
    // real copier, who can open DevTools from the browser menu regardless.
})();
