# Handoff: Real Links & Document Downloads — KUK MERU Website

**Date:** 4 June 2026
**Scope:** Replacing placeholder (`#`) links with real KUK URLs, and adding clickable document resources (PDFs) across the single-page site.
**Repo:** https://github.com/Rajtaya/kuk-meru-website
**Live:** https://kukmeru.up.railway.app
**Local path:** `/Users/aarya/Desktop/KUK_Statics/kuk-meru-website`

---

## 1. Summary

This session wired up real destinations for previously dead links, and added several university documents as clickable resources that **open in a new browser tab with no download popup**. Two Excel files were converted to PDF (because browsers cannot display `.xlsx` inline), and two existing PDFs were renamed to URL-safe names and linked.

A follow-up session added more document links (patent status, international students, chairs, publications, apprenticeships, support to women, Goyal Prize images) and updated the foreign student count from 178 to 196.

All edits were made to `index.html` only (plus new files added to the repo). No CSS or JS changes were required — the styling and click behaviour already existed in `style.css` and `script.js`.

---

## 2. Links added / changed (in `index.html`)

| Element / Section | Destination | Mechanism |
|---|---|---|
| **Patents Granted** stat (University Highlights) | `https://kuk.ac.in/patents/` | `data-href` on `.stat-card` |
| **Library Books** stat (Research Facilities) | `https://kuk.ac.in/library-page/` | inline `<a class="highlight-link">` |
| **Publications (2024-25)** stat | `https://kuk.ac.in/wp-content/uploads/2025/01/3.4.6-Supp-Doc.-2023-24_compressed.pdf` | **NOT applied — see §6** |
| **Integrated University Management System (IUMS)** (Digital Infrastructure) | `https://iums.kuk.ac.in/login.htm` | inline `<a class="highlight-link">` |
| **KUKAA** inline word (Alumni Cell card) | `https://kukaa.kuk.ac.in/` | inline `<a class="highlight-link">` |
| **Alumni Cell (KUKAA)** whole card | `https://kukaa.kuk.ac.in/` | `data-href` on `.collab-card` |
| **Centre for Training, Internships and Employment (KUCTIE)** (Placements card) | `https://kuk.ac.in/placement-cell/` | inline `<a class="highlight-link">` |
| **83+ Skill Courses** card (Skilling Ecosystem) | `https://kuk.ac.in/wp-content/uploads/2024/08/Pool-of-SEC.pdf` | `data-href` on `.skill-card` |
| **Curriculum & Credit Framework** card (NEP / Multidisciplinary) | `https://kuk.ac.in/syllabi/` | `data-href` on `.info-card` |
| **NCrF** inline word (National Credit Framework card) | `ncrf-deans-minutes.pdf` (local) | inline `<a class="highlight-link">` |
| **NHEQF** inline word (NHEQF Adoption card) | `ncrf-deans-minutes.pdf` (local) | inline `<a class="highlight-link">` |
| **14 Industry MoUs** card → "View the full list of MoUs (PDF)" | `kuk-mou-list.pdf` (local) | inline `<a class="highlight-link">` |
| **Skilling Ecosystem** resource line → "View the list of KUTIC-incubated startups (PDF)" | `kutic-incubated-startups.pdf` (local) | inline `<a class="highlight-link">` |
| **Desktops (5:1 ratio)** card (Digital Infrastructure) | `computers-academic.pdf` (local) | `data-href` on `.infra-card` |
| **Laptops for Academics** card (Digital Infrastructure) | `computers-academic.pdf` (local) | `data-href` on `.infra-card` |
| **Patents Granted** label (Research stats) | `kuk-patent-status.pdf` (local) | inline `<a class="highlight-link">` |
| **Patents Published** label (Research stats) | `kuk-patent-status.pdf` (local) | inline `<a class="highlight-link">` |
| **Publications (2024-25)** label (Research stats) | `faculty-publications.pdf` (local) | inline `<a class="highlight-link">` (replaced old external link) |
| **Foreign Students (Regular)** card (Internationalization) | `international-students.pdf` (local) | `data-href` on `.intl-card` |
| **Foreign Students (Regular)** stat | Updated from 178 → **196** | text change |
| **Wheelchairs** inline word (Specially-Abled Support) | `list-of-chairs.pdf` (local) | inline `<a class="highlight-link">` |
| **Support to Women** whole card (Inclusivity) | `support-to-women.pdf` (local) | `data-href` on `.inclusive-card` |
| **Goyal Peace Prize** whole card (Inclusivity) | `images/goyal-prize-1.jpg` | `data-href` on `.inclusive-card` |
| **Goyal Prizes** inline word (Research section) | `images/goyal-prize-1.jpg` | inline `<a class="highlight-link">` |
| **Apprenticeships** whole card (Industry Connect) | `apprenticeship-boat.pdf` (local) | `data-href` on `.collab-card` |
| **AEDP Programmes** whole card (Skilling Ecosystem) | `apprenticeship-boat.pdf` (local) | `data-href` on `.skill-card` |

All external links and document links open in a new tab via `target="_blank" rel="noopener noreferrer"` (inline anchors) or `window.open(href, '_blank')` (card `data-href`, handled by `script.js`).

---

## 3. New files added to the repo

| File in repo | Source (original upload) | Linked from |
|---|---|---|
| `kuk-mou-list.pdf` | `MoU_KUK Form 19.xlsx` (converted) | 14 Industry MoUs card |
| `kutic-incubated-startups.pdf` | `Start-up-Incubation-KUK Form 20 step2_1.xlsx` (converted) | Skilling resource line |
| `ncrf-deans-minutes.pdf` | `Minutes 11.5.26 -Deans- Adoption of National Credit Framework (NCrF) etc..pdf` (renamed) | NCrF + NHEQF links |
| `computers-academic.pdf` | `computer.pdf` (renamed) | Desktops + Laptops cards |
| `kuk-patent-status.pdf` | `KUK Patent status Form 18.pdf` (renamed) | Patents Granted + Patents Published |
| `international-students.pdf` | `List of International Students.docx` (converted via pandoc) | Foreign Students (Regular) card |
| `list-of-chairs.pdf` | `list of chair.docx` (converted via pandoc) | Wheelchairs link |
| `support-to-women.pdf` | `7.1.1-Part-3-2022-23-Upload.pdf` (renamed) | Support to Women card |
| `apprenticeship-boat.pdf` | `ABCD.pdf` (renamed) | Apprenticeships + AEDP cards |
| `faculty-publications.pdf` | `KUK Faculty Publication List - (2022-2025) Form 17.pdf` (renamed) | Publications (2024-25) |
| `images/goyal-prize-1.jpg` | `1 GP.JPG` (compressed from 12MB to 350KB) | Goyal Prizes & Goyal Peace Prize |
| `images/goyal-prize-2.jpg` | `_DSC0389.JPG` (compressed) | Available in repo |
| `images/goyal-prize-3.jpg` | `_DSC0535.JPG` (compressed) | Available in repo |

The two converted PDFs are styled to match the site (orange/cream branded tables):
- **`kutic-incubated-startups.pdf`** — single page, numbered list of 19 incubated ventures.
- **`kuk-mou-list.pdf`** — multi-page (landscape): Functional MoUs table (38 rows), Research & Training Centres, and Ongoing Funded Projects.

---

## 4. Why PDFs, not Excel (key principle)

Browsers render **PDF** inside a tab, but have **no built-in viewer for Office files** (`.xlsx`, `.docx`, `.pptx`). An Excel link therefore *always* triggers a download/hand-off to Excel, regardless of HTML attributes. To get "click → opens in a new tab, no download popup," spreadsheet data must be converted to PDF first.

**Reusable rule for future documents:**
1. **Already a PDF?** Drop it in the repo root and link it: inline `<a href="file.pdf" target="_blank" rel="noopener noreferrer">…</a>`, or `data-href="file.pdf"` on a card.
2. **Excel / Word / PPT?** Convert to PDF first (see §5), then link the PDF.
3. **Always use URL-safe filenames** — no spaces, parentheses, or special characters (e.g. `ncrf-deans-minutes.pdf`, not `Minutes 11.5.26 -Deans- ... (NCrF) etc..pdf`). Spaces/parentheses break links and FTP/SFTP uploads.

---

## 5. Excel → PDF conversion (reusable)

A Python script converts the KUK spreadsheets into branded, browser-viewable PDFs. It reads `*.xlsx` from the current folder and writes matching `*.pdf`. Run it from inside the repo. Requires `reportlab` and `openpyxl`.

```bash
cd ~/Desktop/KUK_Statics/kuk-meru-website
python3 -m venv /tmp/pdfvenv
/tmp/pdfvenv/bin/pip install -q reportlab openpyxl
/tmp/pdfvenv/bin/python /tmp/xlsx_to_pdf.py    # script source provided in chat
```

> Note: `/tmp/xlsx_to_pdf.py` is in a temporary folder and will be cleared on reboot. If conversions will be needed again, save the script into the repo (e.g. `tools/xlsx_to_pdf.py`) so it persists.

---

## 6. How links are wired (mechanics)

Two mechanisms, both pre-existing in the codebase:

**A. Inline text links** — for a word inside a sentence:
```html
<a href="URL" class="highlight-link" target="_blank" rel="noopener noreferrer">Text</a>
```
Renders as the orange dashed-underline style (theme-aware for light/dark/gradient/accent sections).

**B. Whole-card links via `data-href`** — for clickable cards:
```html
<div class="stat-card" data-href="URL"> … </div>
```
`script.js` attaches a click handler to these card classes and calls `window.open(href, '_blank')`. It **ignores clicks on inner `<a>` elements**, so a card can have `data-href` *and* contain its own inline links without conflict.

**Important — only these classes are wired for `data-href`** (the `cardSelectors` list in `script.js`):
`.vm-card, .stat-card, .info-card, .infra-card, .skill-card, .collab-card, .intl-card, .entre-card-large, .entre-card-small, .rank-card, .inclusive-card, .nep-card, .facility-item`

If a future card uses a class **not** in this list, `data-href` alone won't work — either add the class to `cardSelectors` in `script.js`, or use an inline anchor instead.

---

## 7. Open items / not done

- ~~**Publications (2024-25) stat link**~~ — **DONE.** Now links to `faculty-publications.pdf` (local, converted from faculty publication list xlsx).
- **Unused source spreadsheets** — `kuk-mou-list.xlsx` and `kutic-incubated-startups.xlsx` may still be tracked in git after the switch to PDF. Harmless but redundant. To remove: `git rm kuk-mou-list.xlsx kutic-incubated-startups.xlsx && git commit -m "Remove unused xlsx" && git push`. Confirm with `git ls-files | grep xlsx`.
- **Laptops card target** — the Laptops for Academics card currently points to `computers-academic.pdf`, which is a *desktop/computer* count table (totals 2,986, matching the Desktops stat). It fits the Desktops card precisely; it is a looser fit for Laptops. Repoint later if a laptop-specific document becomes available.
- **Goyal Prize images** — `goyal-prize-2.jpg` and `goyal-prize-3.jpg` are in the repo but not yet linked from the HTML. They could be added as an image strip or gallery in the Goyal sections if needed.
- **faculty-publications.pdf is 33MB** — works but is large. Consider compressing it or hosting on a CDN for faster loading.
- **Verify the live PDFs** — after deploy, click-test every document link (patents, publications, international students, chairs, support-to-women, apprenticeship-boat, MoU, startups, NCrF/NHEQF, Pool-of-SEC, computers-academic, Goyal images). Broken file paths 404 silently; the HTML can look correct while the file is missing from the repo. Confirm files are committed with `git ls-files | grep -E 'pdf|jpg'`.

---

## 8. Deployment notes

- Pure static site — copy files to web root, no build step. (See original `HANDOFF.md` §8.)
- The repo is connected to Railway; `git push` triggers an auto-redeploy.
- When committing a newly added PDF, watch the `git push` output for `create mode 100644 <file>.pdf` with a non-zero size — that confirms the binary actually went up (a commit reporting "0 insertions" means the file was not added).
- `.claude/` (local dev config) is untracked and can be left alone or added to `.gitignore`.

---

## 9. Contact

**Developer:** Aarya
**Email:** Rajtaya@kuk.ac.in
**University Website:** www.kuk.ac.in
