# Claude Code Prompts — Astro Migration for debrajpaul.github.io

Run these **one at a time**. Each prompt ends with an explicit stop instruction so Claude Code doesn't cascade into the next phase unsupervised — hold it to that. Review the diff after each phase before running the next prompt.

Status: prompts 0–8b are done and verified live at debrajpaul.com (homepage now correctly shows all 6 live system-design cards after a redeploy cleared a stale cache). Prompt 9 below is the final cutover — retire the old static site, fix two leftover stale-copy strings, and replace README.md.

---

## Prompt 9 — Cutover

Only run this after you've personally confirmed the live site is fully correct (done —
6 cards showing, llms.txt correct, CV link working). This is the one-way step — sequence
the manual part below carefully, it's easy to get a broken interim state if done out of
order.

```
The Astro migration is verified live and I've reviewed it page-by-page. Time to retire
the old static site and prepare the cutover — but do NOT merge to main or touch any
GitHub repo settings; that stays manual.

1. Re-verify one more time before deleting anything: `pnpm astro check` and
   `pnpm astro build` must both pass clean. If either fails, stop and report — do not
   proceed to deletion.

2. Delete the now-superseded pre-Astro files: index.html (root) and the root-level
   assets/ directory (its one file, Debraj_Paul_CV.pdf, already lives in public/ and is
   served from there — confirm that before deleting the root copy).

3. Fix two leftover copy strings that no longer describe the site accurately:

   a. In src/pages/index.astro, the "arch-intro" paragraph above the system-design
      cards currently hardcodes a count ("Two systems built at Warner Bros.
      Discovery... Plus one open-source personal project with a full diagram.") — now
      stale (6 live entries, not 3) and will go stale again every time a block is added
      or its status changes. Replace with count-independent copy:

      Selected architecture patterns from production systems at Warner Bros. Discovery
      and personal open-source projects — each with a full diagram and a problem →
      decision → trade-off walkthrough.

   b. In src/layouts/BaseLayout.astro, the footer still reads "Built from scratch in
      plain HTML, CSS, and a little JS." — no longer true post-migration. Replace with:

      Built with Astro, TypeScript, and a little JS.

4. Replace README.md entirely with the content below, exactly — written to match the
   actual current architecture, not paraphrased or reinterpreted:

   ---BEGIN README.md---
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
   ---END README.md---

5. Re-run the sanitization grep guard once more — confirm zero matches after these
   changes.

6. Commit everything on the astro-migration branch with a clear message (e.g. "chore:
   retire pre-Astro static site, generic arch-intro copy, update README for Astro
   architecture").

7. Push the branch. If the `gh` CLI is available and authenticated, open a PR from
   astro-migration into main with a description summarizing the full migration
   (scaffold → content collections → 7 system-design blocks → llms.txt → CI/CD →
   cutover). If `gh` isn't available, just confirm the branch is pushed and give me the
   compare URL.

Stop here. Do not merge the PR, do not touch GitHub repo Settings. Both are on me.
```

### Manual steps — yours, not Claude Code's (order matters)

1. **Review the PR diff** yourself, focusing on the README rewrite and the two deletions.
2. Pages source is already switched to "GitHub Actions" — that step's done, no action
   needed here this time.
3. **Merge the PR.**
4. Watch the **Actions tab** for the `Deploy to GitHub Pages` workflow to go green.
5. Once deployed, reload `https://debrajpaul.com` in an incognito window and click
   through: hero CTAs, CV download, all system-design pages, nav anchors, footer links,
   and `/llms.txt` directly. Confirm the footer copy and the arch-intro line read
   correctly.
6. Keep the `astro-migration` branch around for a little while as a rollback reference
   before deleting it.

---

## After Claude Code finishes

Come back with the branch/diff before merging — I want to see the two copy fixes and the actual README.md content it wrote, not just confirmation it did it.
