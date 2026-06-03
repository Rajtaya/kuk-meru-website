# Project Handoff: KUK MERU Status Report Website

**Date:** 3 June 2026
**Author:** Aarya (Rajtaya@kuk.ac.in)
**Status:** Complete - Ready for Deployment

---

## 1. Project Overview

A static, single-page website presenting the **MERU (Multidisciplinary Education and Research Universities) Status Report** for **Kurukshetra University, Kurukshetra**. The website transforms the 31-page PDF report into an interactive, modern, and fully responsive web experience.

**Source Document:** `FINAL MERU_KKR.pdf` (31 pages, 56.2 MB)

---

## 2. Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Markup      | HTML5 (semantic)                    |
| Styling     | CSS3 (custom properties, grid, flexbox, animations) |
| Scripting   | Vanilla JavaScript (ES5-compatible) |
| Fonts       | Google Fonts (Playfair Display, Inter) |
| Icons       | Inline SVG                          |
| Dependencies| **None** - Zero external libraries  |

---

## 3. Project Structure

```
kuk-meru-website/
├── index.html              (~830 lines)    Main page with all 15 sections
├── style.css               (~1380 lines)   Complete stylesheet
├── script.js               (~62 lines)     Navigation, scroll animations, clickable cards
├── naac-certificate.pdf    (150 KB)        NAAC A++ certificate (linked from hero + rankings)
├── nirf-2025.pdf           (229 KB)        NIRF 2025 ranking report (linked from hero + rankings)
├── images/                                 26 campus photos extracted from PDF
│   ├── university-gate.jpg                 Hero background (cover page)
│   ├── lab-chemistry.jpg                   Research section
│   ├── lab-computer.jpg                    Academics section
│   ├── lab-electronics.jpg                 Infrastructure section
│   ├── lab-pharmacy.jpg                    Research section
│   ├── library.jpg                         Academics section
│   ├── training.jpg                        Academics section
│   ├── research-equip.jpg                  Research section
│   ├── research-lab2.jpg                   Research section
│   ├── building-modern.jpg                 Infrastructure section
│   ├── it-center.jpg                       Infrastructure section
│   ├── hostel.jpg                          Campus Facilities section
│   ├── campus-road.jpg                     Campus Facilities section
│   ├── campus-monument.jpg                 Campus Facilities banner
│   ├── campus-heritage.jpg                 Campus Facilities section
│   ├── stadium.jpg                         Campus Facilities section
│   ├── swimming-pool.jpg                   Campus Facilities section
│   ├── dharohar.jpg                        Campus Facilities section
│   ├── mou-signing.jpg                     Industry Collab banner
│   ├── sports-kabaddi.jpg                  Internationalization section
│   ├── sports-athletics.jpg                Internationalization section
│   ├── sports-shooting.jpg                 Internationalization section
│   ├── cultural-gita.jpg                   NEP section
│   ├── cultural-dance.jpg                  NEP section
│   ├── ratnavali.jpg                       NEP section
│   └── manuscripts.jpg                     NEP section
├── HANDOFF.md              (this file)
└── .claude/
    └── launch.json                         Dev server config
```

**Total Size:** ~1.7 MB (including images and PDFs)

---

## 4. Website Sections (mapped to PDF)

| #  | Section                        | PDF Sections Covered   | HTML id          |
|----|--------------------------------|------------------------|------------------|
| 1  | Hero / Landing                 | Cover Page             | `#home`          |
| 2  | Vision & Mission               | Page 2                 | `#about`         |
| 3  | University Highlights (Stats)  | Section 1              | `#highlights`    |
| 4  | Multidisciplinary Education    | Section 2              | `#academics`     |
| 5  | Digital Infrastructure         | Section 3              | `#infrastructure`|
| 6  | Research Facilities            | Section 4              | `#research`      |
| 7  | Skilling Ecosystem             | Section 5              | (no anchor)      |
| 8  | Industry-Academic Collaboration| Section 6              | (no anchor)      |
| 9  | Internationalization           | Section 7              | (no anchor)      |
| 10 | Entrepreneurship Ecosystem     | Section 8              | (no anchor)      |
| 11 | Accreditation & Rankings       | Section 10             | `#rankings`      |
| 12 | Inclusive Environment          | Section 9              | `#initiatives`   |
| 13 | NEP 2020 Implementation        | Section 11             | (no anchor)      |
| 14 | Campus Facilities              | Sections 12-13         | (no anchor)      |
| 15 | Footer / Contact               | Back Cover             | `#contact`       |

---

## 5. Key Data Points Displayed

| Metric                         | Value               |
|--------------------------------|---------------------|
| Year of Establishment          | 1956                |
| On-Campus Students             | 14,912              |
| Affiliated College Students    | 1,56,032            |
| Distance Education Students    | 17,667              |
| H-Index                        | 107                 |
| Publications (2024-25)         | 894                 |
| Patents Granted                | 41 (37 + 4 design)  |
| Smart Classrooms               | 343                 |
| NAAC Grade                     | A++ (valid to Jan 2031) |
| NIRF Rank (State Public)       | 35                  |
| Education World (Haryana)      | #1                  |
| QS Asia Ranking                | 801-850             |
| Foreign Students               | 435 (178 + 257)     |
| Skill Courses                  | 83+ (regular) + 170 (distance) |
| Industry MoUs                  | 14                  |
| KUTIC Startups                 | 16                  |
| Hostels                        | 25 (6,200 capacity) |
| Library Books                  | 4,01,400            |
| E-Journals                     | 13,000+             |

---

## 6. Design System

### Color Palette

| Name         | Hex       | Usage                              |
|--------------|-----------|-------------------------------------|
| Orange       | `#E8751A` | Primary brand, CTAs, icons          |
| Orange Dark  | `#C4600F` | Hover states, headings              |
| Orange Light | `#F5A623` | Stat numbers, accents               |
| Red          | `#C0392B` | Gradient endpoints, emphasis        |
| Cream        | `#FDF8F0` | Subtle backgrounds                  |
| Dark         | `#1A1A2E` | Dark sections, hero, footer         |
| Dark Blue    | `#16213E` | Dark gradients                      |

### Typography

| Element         | Font              | Weight | Size (desktop)  |
|-----------------|-------------------|--------|-----------------|
| Headings (h1-h4)| Playfair Display  | 700-800| 18px - 4.5rem   |
| Body text       | Inter             | 400-500| 13px - 17px     |
| Labels          | Inter             | 700    | 13px, uppercase  |
| Stats           | Playfair Display  | 800    | 2rem - 2.2rem   |

### Section Backgrounds

- **Light:** White (`#FFFFFF`)
- **Dark:** Dark navy gradient (`#1A1A2E` to `#16213E`)
- **Accent:** Orange-to-red gradient (`#E8751A` to `#C0392B`)
- **Gradient:** Dark with blue tint (`#1A1A2E` to `#0F3460`)

### Responsive Breakpoints

| Breakpoint | Layout Changes                          |
|------------|------------------------------------------|
| > 1024px   | Full multi-column layouts (3-5 columns)  |
| 768-1024px | 2-3 column grids                        |
| < 768px    | Single column, hamburger nav             |
| < 480px    | Simplified single-column everywhere      |

---

## 7. How to Run Locally

### Option A: Python (recommended)
```bash
cd /Users/aarya/Desktop/KUK_Statics/kuk-meru-website
python3 -m http.server 8765
# Open http://localhost:8765
```

### Option B: Direct File
```bash
open /Users/aarya/Desktop/KUK_Statics/kuk-meru-website/index.html
# Works directly in browser (Google Fonts require internet)
```

### Option C: Node.js
```bash
npx serve /Users/aarya/Desktop/KUK_Statics/kuk-meru-website
```

---

## 8. Deployment Options

Since this is a pure static site with zero build step, it can be deployed to:

| Platform        | Method                                        |
|-----------------|-----------------------------------------------|
| **Any Web Server** | Copy all files + `images/` folder to the server root |
| **GitHub Pages** | Push to a repo, enable Pages from Settings    |
| **Netlify**      | Drag and drop the folder                      |
| **Vercel**       | `vercel deploy` from the directory            |
| **University Server** | Upload via FTP/SFTP to kuk.ac.in web root |
| **Railway**      | Connect repo and deploy                       |

No `.env`, no build commands, no node_modules required.

### Current Deployment

| Resource        | URL                                                      |
|-----------------|----------------------------------------------------------|
| **Live Site**   | https://kukmeru.up.railway.app                           |
| **GitHub Repo** | https://github.com/Rajtaya/kuk-meru-website              |

---

## 9. Browser Support

| Browser         | Support |
|-----------------|---------|
| Chrome 80+      | Full    |
| Firefox 78+     | Full    |
| Safari 14+      | Full    |
| Edge 80+        | Full    |
| Mobile Chrome   | Full    |
| Mobile Safari   | Full    |

Uses CSS Grid, Flexbox, `backdrop-filter`, CSS custom properties, `IntersectionObserver`, and `clamp()`. All widely supported.

---

## 10. Features

- **Smooth scroll navigation** with sticky navbar
- **Scroll-triggered animations** (fade-in-up on each card)
- **Responsive design** across all device sizes
- **Hamburger menu** on mobile
- **Alternating section themes** (light/dark/accent/gradient)
- **Hover effects** on all interactive cards
- **Clickable cards** with hover arrow indicator (66 cards across all sections)
- **Inline highlight links** for key terms (37 links with dashed-underline hover effect)
- **Real PDF links** - NAAC certificate and NIRF 2025 report open in new tabs
- **Campus photos** - 26 images extracted from PDF, placed in relevant sections
- **Section image strips** with responsive grid and hover zoom
- **Theme-aware styling** for links/arrows on light, dark, accent, and gradient backgrounds
- **Zero JavaScript frameworks** - fast load, no FOUC
- **SVG icons** - no icon library dependency
- **Google Fonts** loaded asynchronously with `font-display: swap`

---

## 11. Clickable Links & Hover Highlights

### Real Links (from PDF)

| Element                        | Destination                                |
|-------------------------------|--------------------------------------------|
| Hero tag: NAAC A++            | `naac-certificate.pdf` (opens in new tab)  |
| Hero tag: NIRF Rank 35       | `nirf-2025.pdf` (opens in new tab)         |
| Rankings: NAAC A++ card       | `naac-certificate.pdf` (opens in new tab)  |
| Rankings: NIRF #35 card       | `nirf-2025.pdf` (opens in new tab)         |
| Infrastructure: LMS link      | `https://kuk.ac.in/lms/`                   |
| Research: policies link        | `https://kuk.ac.in/policies`               |
| Footer: www.kuk.ac.in         | `https://www.kuk.ac.in`                    |

### Dummy Links (placeholder `#`)

All other highlight links (NEP 2020, IKS, NCrF, NHEQF, KUTIC, KUKAA, BOAT, KUCTIE, ICCASH, WSRC, SWAYAM, IDP 2025, etc.) currently point to `#`. Replace with real URLs when available.

### How to Add Real Links

1. **Inline links**: Search for `class="highlight-link"` in `index.html` and replace `href="#"` with the real URL
2. **Card links**: Add `data-href="https://..."` attribute to any card element; the JS click handler will open it in a new tab

---

## 12. Future Enhancements (if needed)

- Add university logo image (replace the "KU" text logo)
- Replace dummy `#` links with real URLs as they become available
- Add a PDF download button linking to the original report
- Add language toggle (Hindi/English)
- Connect to a CMS for dynamic content updates
- Add Google Analytics or similar tracking
- Add a "Back to Top" floating button
- Add print-friendly CSS stylesheet

---

## 13. Content Accuracy

All data in the website is sourced directly from `FINAL MERU_KKR.pdf` (31 pages). Key data points were cross-verified across sections. The content covers:

- General Information (Section 1)
- Plans for Multidisciplinary Education (Section 2)
- Digital Infrastructure (Section 3)
- Research Facilities (Section 4)
- Skilling (Section 5)
- Industry Academic Collaboration (Section 6)
- Internationalization (Section 7)
- Entrepreneurship Ecosystem (Section 8)
- Inclusive Environment (Section 9)
- Accreditation and Rankings (Section 10)
- NEP Implementation (Section 11)
- Other Initiatives (Section 12)
- Other Notable Points/Facilities (Section 13)

---

## 14. Contact

**Developer:** Aarya
**Email:** Rajtaya@kuk.ac.in
**University Website:** www.kuk.ac.in
