# debrajpaul.github.io

Personal portfolio site for **Debraj Paul** — Senior Backend / Platform Engineer (Node.js · TypeScript · AWS).

Live at: **[debrajpaul.com](https://debrajpaul.com)**

---

## About

Astro-based portfolio site, statically built with zero client-side framework overhead. Architecture deep-dives are content-collection-driven — adding a new system design write-up is a matter of dropping a Markdown file into `src/content/system-design/`, nothing else needs to change. Dark-mode-default. Scores 100s on Lighthouse (enforced in CI, see below).

---

## Stack

- **Astro 7** (static output, `output: 'static'`) — TypeScript throughout, strict mode
- **Content Layer API** (`astro:content` + `glob()` loaders) with Zod-validated frontmatter schemas for system-design entries, experience, and projects
- **Mermaid** (via `astro-mermaid`) for architecture diagrams authored inline in Markdown — no hand-drawn SVG required for new entries (the original 2 hand-drawn SVGs from the pre-Astro site are preserved for the original deep-dives that already had them)
- `@astrojs/sitemap` — auto-generated `sitemap.xml`, picks up new system-design pages automatically
- A dynamically generated `/llms.txt` (`src/pages/llms.txt.ts`) — a plain-text site summary for LLM-based tools, built from the same content collection as the HTML pages, so it can't drift out of sync
- System font stack only — no remote fonts
- `IntersectionObserver` for scroll-triggered fade-ins
- `prefers-color-scheme` for automatic dark / light theming, `prefers-reduced-motion` respected
- No analytics, no third-party scripts

---

## Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | Hero | Name, tagline, positioning, CTA buttons |
| 2 | By the numbers | 4 hard-metric stat tiles |
| 3 | Open to | Availability / relocation callout |
| 4 | Selected work | Warner Bros. Discovery · Swiggy Dineout · PT Tujuh Asia · Full Budget App (open source) |
| 5 | Architecture deep-dives | Content-collection-driven — every `status: 'live'` entry in `src/content/system-design/` renders as a card here and gets its own `/system-design/[slug]/` page |
| 6 | Experience | Vertical timeline — 7 roles from 2015 to present |
| 7 | Skills | Chip groups across 9 categories + years-of-evidence collapsible table |
| 8 | Certifications | AWS Developer Associate · Apollo GraphQL · Udemy + 10 additional courses (collapsible) |
| 9 | Education | MCA (Tezpur University) · BCA (Gauhati University) |
| 10 | Volunteer | WWF-India · UNICEF · Red Cross Blood Services |

---

## Adding a new architecture deep-dive

Drop a new Markdown file into `src/content/system-design/`, matching the schema in `src/content.config.ts` (title, summary, stack, patterns, order, status, diagramType). Set `status: 'live'` to have it appear as a card on the homepage and get its own page at `/system-design/{filename}/` — nothing else needs editing. Set `status: 'wip'` to keep it off the homepage while still being directly linkable and listed under "Optional" in `/llms.txt`.

---

## AI / LLM discoverability

- JSON-LD `schema.org/Person` block in `<head>` (name, jobTitle, sameAs, knowsAbout)
- `sitemap.xml`, auto-updated on every new content-collection entry
- `/llms.txt` — a structured plain-text summary aimed at LLM-based tools, generated at build time from the same `system-design` collection that powers the HTML pages

---

## Availability

- Remote-first globally
- Hybrid in India
- Open to relocation

---

## SEO & Accessibility

- `<title>` and `<meta name="description">` set per page (including each system-design deep-dive)
- Open Graph + Twitter Card meta tags
- JSON-LD `schema.org/Person` block
- Semantic HTML5 landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Single `<h1>` per page, no heading-level skips
- Skip-to-content link, `aria-labelledby` on every section
- Accessible SVGs: `role="img"`, `<title>`, `<desc>`
- `:focus-visible` ring on all interactive elements
- Color contrast ≥ 4.5 : 1

---

## Print

`@media print` forces a light theme, hides nav and decorative elements, targets 1–2 A4 pages as a clean CV.

---

## CI/CD

- `.github/workflows/checks.yml` — on every PR: `astro check` (type/schema validation) and a Lighthouse budget (Performance / Accessibility / Best Practices / SEO ≥ 95) against the homepage and one system-design page, auto-discovered from the build output
- `.github/workflows/deploy.yml` — on push to `main`: builds with `withastro/action` and deploys to GitHub Pages

---

## Local development

```
pnpm install
pnpm dev        # local dev server, localhost:4321
pnpm astro check
pnpm build      # production build to dist/
pnpm preview    # serve the production build locally
```

---

## File tree

```
debrajpaul.github.io/
├── astro.config.mjs
├── src/
│   ├── content.config.ts       # Zod schemas: systemDesign, experience, projects
│   ├── content/
│   │   ├── system-design/      # one .md per architecture deep-dive
│   │   ├── experience/         # reserved, not yet wired into Timeline.astro
│   │   └── projects/           # reserved, not yet populated
│   ├── layouts/                 # BaseLayout, SystemDesignLayout
│   ├── components/              # Hero, Timeline, SkillsMatrix, etc.
│   ├── pages/
│   │   ├── index.astro
│   │   ├── system-design/[slug].astro
│   │   └── llms.txt.ts
│   └── assets/diagrams/         # hand-drawn SVGs for the original deep-dives
├── public/                      # favicons, Debraj_Paul_CV.pdf
├── .github/workflows/           # checks.yml, deploy.yml
├── CNAME
├── LICENSE
└── README.md
```

---

## Contact

**Debraj Paul**
- Email: debraj@debrajpaul.com
- GitHub: [github.com/debrajpaul](https://github.com/debrajpaul)
- LinkedIn: [linkedin.com/in/debraj-paul](https://www.linkedin.com/in/debraj-paul)
