// @ts-check
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mermaid from 'astro-mermaid';

// /dubai links to this CV. A 404 on that button is the single worst failure
// mode for a QR-code landing page — fail the build loudly instead of
// shipping a dead link.
//
// An existence check alone is not enough: a valid-but-empty PDF stub passes it
// and ships a blank document to everyone who scans the printed card, which is
// worse than a 404 (a 404 makes them email you; a blank CV makes them move on).
// A real multi-page CV is >100KB; the placeholder stub was 846 bytes.
const CV_MIN_BYTES = 20_000;

// Every CV the site links to. Renaming a file in public/ without updating the
// hrefs is silent — the build succeeds and ships 404s — so both are checked
// here rather than only the Dubai one.
const REQUIRED_CVS = [
  {
    file: 'Debraj_Paul_CV.pdf',
    linkedFrom: 'the nav CV button and footer on every page, and the homepage hero',
  },
  {
    file: 'Debraj_Paul_CV_Dubai.pdf',
    linkedFrom: "/dubai's primary CTA (the QR-code landing page)",
  },
];

function requireCvs() {
  return {
    name: 'require-cvs',
    hooks: {
      'astro:build:start'() {
        for (const { file, linkedFrom } of REQUIRED_CVS) {
          const path = fileURLToPath(new URL(`./public/${file}`, import.meta.url));
          if (!existsSync(path)) {
            throw new Error(
              `Missing public/${file} — linked from ${linkedFrom}. ` +
                `If you renamed it, either rename it back or update every href ` +
                `(src/config/profile.ts, src/layouts/BaseLayout.astro, src/components/Hero.astro).`
            );
          }
          const { size } = statSync(path);
          if (size < CV_MIN_BYTES) {
            throw new Error(
              `public/${file} is ${size} bytes — below the ${CV_MIN_BYTES}-byte floor, ` +
                `so it is almost certainly a placeholder stub, not the real CV. ` +
                `It is linked from ${linkedFrom} and would download as a blank document. ` +
                `Replace it before building.`
            );
          }
        }
      },
    },
  };
}

// astro-mermaid's astro:config:setup hook injects the full
// mermaid+cytoscape+katex client runtime on EVERY page unconditionally —
// no per-page/collection scoping option in v2.1.0. Previously left
// disabled because the homepage had zero mermaid content and it bloated
// dist/ from 84KB to 3.6MB. Now re-enabled because four system-design
// entries author real mermaid diagrams (diagramType: 'mermaid') that need
// to render. This reintroduces the sitewide payload cost on every route,
// including the ones with no diagrams — worth revisiting with a scoped
// alternative (e.g. hand-rolled client-side mermaid.render() called only
// from SystemDesignLayout when diagramType === 'mermaid') if the bundle
// size becomes a real problem.
// https://astro.build/config
export default defineConfig({
  site: 'https://debrajpaul.com',
  output: 'static',
  // Canonical URL form is no-trailing-slash (e.g. /dubai, not /dubai/). This is a
  // hard requirement for Cloudflare Web Analytics path segmentation on GitHub
  // Pages, which has no server-side redirects: with the default 'directory'
  // build format (foo/index.html), GitHub Pages' static server resolves BOTH
  // /foo and /foo/ to the same file with a 200 and no redirect either way,
  // silently splitting every page's traffic across two paths in the dashboard.
  // 'file' format (foo.html) breaks that: /foo resolves via GitHub Pages'
  // extensionless-to-.html lookup, while /foo/ has no matching directory or
  // index.html to fall back to and genuinely 404s — so only one form is ever
  // live. trailingSlash: 'never' keeps the dev server's route matching
  // consistent with this (it does not itself affect build output).
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [mermaid(), sitemap(), requireCvs()],
});
