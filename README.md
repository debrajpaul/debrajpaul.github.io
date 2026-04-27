# debrajpaul.github.io

Personal portfolio site for **Debraj Paul** — Senior Backend / Platform Engineer (Node.js · TypeScript · AWS).

Live at: **[debrajpaul.github.io](https://debrajpaul.github.io)**

---

## About

Single-file, dark-mode-default static site built from scratch. No frameworks, no build step, no template attribution. Scores 100s on Lighthouse.

---

## Stack

- Plain HTML5 + inline CSS + vanilla ES2020 JS — one file: `index.html`
- System font stack only — no remote fonts
- One inline SVG for architecture deep-dive (Privacy/PII Orchestrator) + two prose walkthroughs — no Mermaid, no D3
- `IntersectionObserver` for scroll-triggered fade-ins
- `prefers-color-scheme` for automatic dark / light theming
- `prefers-reduced-motion` respected
- No analytics, no third-party scripts, no jQuery

---

## Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | Hero | Name, tagline, positioning, CTA buttons |
| 2 | By the numbers | 4 hard-metric stat tiles |
| 3 | Open to | Availability / relocation callout |
| 4 | Selected work | Global media platform · Swiggy Dineout · PT Tujuh Asia · earlier roles · Full Budget App (open source) |
| 5 | Architecture deep-dives | Privacy/PII Orchestrator (SVG) · Async Moderation Platform (prose) · Full Budget App open-source (SVG) |
| 6 | Experience | Vertical timeline of all 7 roles |
| 7 | Skills | Chip groups across 9 categories + years-of-evidence table |
| 8 | Certifications | AWS, Apollo GraphQL, Udemy + 10 LinkedIn courses |
| 9 | Education | MCA (Tezpur University) · BCA (Gauhati University) |
| 10 | Languages | Bengali · English · Hindi · Assamese |
| 11 | Volunteer | WWF-India · UNICEF · Red Cross |

---

## SEO & Accessibility

- `<title>` and `<meta name="description">` set
- Open Graph + Twitter Card meta tags
- JSON-LD `schema.org/Person` block (name, jobTitle, sameAs, knowsAbout)
- Semantic HTML5 landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Single `<h1>`, no heading-level skips
- Skip-to-content link, `aria-labelledby` on every section
- Accessible SVG: `role="img"`, `<title>`, `<desc>`
- `:focus-visible` ring on all interactive elements
- Color contrast ≥ 4.5 : 1

---

## Print

`@media print` forces a light theme, hides nav and decorative elements, targets 1–2 A4 pages as a clean CV.

---

## File tree

```
debrajpaul.github.io/
├── index.html      # entire site — HTML + CSS + JS (3 inline SVG diagrams)
├── .nojekyll       # disables Jekyll so GitHub Pages serves the file raw
├── .gitignore      # ignores .claude/, .vscode/, .DS_Store, node_modules, .env
├── LICENSE
└── README.md
```

---

## Contact

**Debraj Paul**
- Email: pauldebraj7@gmail.com
- GitHub: [github.com/debrajpaul](https://github.com/debrajpaul)
- LinkedIn: [linkedin.com/in/debraj-paul](https://www.linkedin.com/in/debraj-paul)
