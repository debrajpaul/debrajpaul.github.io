// @ts-check
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mermaid from 'astro-mermaid';

// /dubai links to this CV. A 404 on that button is the single worst failure
// mode for a QR-code landing page — fail the build loudly instead of
// shipping a dead link.
function requireDubaiCv() {
  return {
    name: 'require-dubai-cv',
    hooks: {
      'astro:build:start'() {
        const path = fileURLToPath(new URL('./public/Debraj_Paul_CV_Dubai.pdf', import.meta.url));
        if (!existsSync(path)) {
          throw new Error(
            `Missing public/Debraj_Paul_CV_Dubai.pdf — /dubai links to this file. ` +
              `Add the real CV (or a placeholder) before building.`
          );
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
  integrations: [mermaid(), sitemap(), requireDubaiCv()],
});
