# Claude Code Prompts — Astro Migration for debrajpaul.github.io

Run these **one at a time**. Each prompt ends with an explicit stop instruction so Claude Code doesn't cascade into the next phase unsupervised — hold it to that. Review the diff after each phase before running the next prompt.

Note: prompts 0–7 already ran (scaffold → port → system-design collection → 4 new blocks → SEO pass → testing scaffolding → CI/CD scaffolding). Prompt 8 below is a cleanup pass covering everything flagged in review, plus the actual verification run that hadn't been confirmed to pass yet.

---

## Prompt 8 — Resolve TODOs, cleanup, and full verification pass

```
Three facts are now confirmed — apply them directly to the content, don't re-ask:

1. Service registry storage (src/content/system-design/service-registry-fan-out.md):
   the registry is backed by a SEPARATE service/store, not the same DynamoDB table as
   the orchestrator's own state. Update "The design decision" paragraph to state this
   explicitly (the registry is intentionally separate storage, not shared with the
   orchestrator's state DB). Remove the <!-- TODO: confirm --> comment.

2. Backfill ETL trigger (src/content/system-design/backfill-search-indexing.md): the
   downstream ETL step is S3-EVENT-TRIGGERED — an S3 event fires the ETL pickup
   automatically when the DynamoDB export lands, not scheduled or manual. Update "The
   design decision" paragraph to state this explicitly. Remove the TODO comment.

3. Resort-Booking MCP phase (src/content/system-design/resort-booking-mcp.md): the
   project is currently in PHASE 0 — containerising the local Docker/HTTP-SSE server
   itself, nothing built on top yet. Update the frontmatter summary and "The design
   decision" section to say Phase 0 specifically, not just "work in progress." Remove
   the TODO comment.

Now the schema/tooling cleanup flagged in review:

4. In src/content.config.ts, drop the frontmatter `slug` field from the systemDesign
   schema entirely (it duplicates the loader-derived `id` from the filename — two
   sources of truth for the same route param). Remove `slug:` from all 7
   src/content/system-design/*.md files' frontmatter. Update
   src/pages/system-design/[slug].astro to use `entry.id` in getStaticPaths() instead
   of `entry.data.slug`, and update src/pages/index.astro +
   src/components/SystemDesignCard.astro to use `entry.id` instead of
   `entry.data.slug` wherever they build links or pass the slug prop.

5. In src/content.config.ts, tighten `projects.status` from `z.string()` to
   `z.enum(['active', 'wip', 'archived'])` to match the systemDesign collection's
   pattern. Leave the `experience` and `projects` collections otherwise as unused
   scaffolding — Timeline.astro stays a static component and content/projects/ stays
   empty. Do not migrate Timeline or author project entries in this prompt.

6. Fix the sanitization grep guard in .claude/CLAUDE.md so it stops false-positiving on
   lockfile hashes (confirmed: pnpm-lock.yaml currently contains a coincidental "FnK"
   substring inside a base64 integrity hash, which trips the "fnk" codename pattern).
   Update the guard command to:

   grep -riE 'motif|mercury|hollywood|chitter|saves v2|sauce|itk-api|crisp|gigya|ds-community-broker|fnk|food\.com|hgtv\.com|cookingchannel|diy\.com' \
     --exclude=pnpm-lock.yaml --exclude-dir=dist --exclude-dir=node_modules --exclude-dir=.astro .

   Confirm it now returns zero matches for real (not just "should").

Now actually run the verification pass — the CI workflow files and lighthouse script
already exist from the prior phase, but I want to see them pass locally, not just exist:

7. Run `pnpm install`, then `pnpm astro check` — report the exact output, pass or fail.
8. Run `pnpm astro build` — report success/failure and any warnings verbatim.
9. Run `pnpm astro preview` in the background, then run
   `node scripts/lighthouse-budget.mjs` against it — report the actual score table it
   prints (Performance/Accessibility/Best Practices/SEO per page), not a summary.
10. Run a broken-link check across dist/ — internal links, /Debraj_Paul_CV.pdf, all 7
    system-design detail pages, external profile links (GitHub/LinkedIn/mailto). Report
    any failures with the exact URL that failed.
11. Re-run the fixed grep guard from step 6 as a final gate — confirm zero matches.

Report back:
(a) explicit confirmation each of items 1–6 is done, with a one-line diff summary per
    item,
(b) the real, unsummarized output of steps 7–11.

Stop here. Do not merge to main, do not touch the GitHub Actions deploy trigger. I still
need to flip the Pages source to "GitHub Actions" manually in repo Settings before
anything can go live — that's on me, not something to script.
```

---

## Prompt 8b — Add an auto-generated llms.txt

```
Add an /llms.txt file following the llms.txt convention (llmstxt.org) — a plain-text
summary of the site aimed at LLM-based tools, similar in spirit to robots.txt but
descriptive rather than a rule set. Generate it dynamically from the existing content
collection instead of hand-writing a static file, so it never drifts from what
system-design/[slug].astro actually serves.

1. Create src/pages/llms.txt.ts as an Astro endpoint (not a static file in public/) that
   exports a GET handler returning `text/plain`.

2. Pull all entries from getCollection('systemDesign'), split into two groups:
   - status === 'live', sorted by `order` — these go under an H2 section called
     "System Design Deep-Dives".
   - status === 'wip' — these go under an H2 section called "Optional" (this matches
     the llms.txt spec's convention of an "Optional" section for secondary/in-progress
     links a reader can skip).

3. Format per the llms.txt spec:

   # Debraj Paul

   > Technical Lead II — Backend / Platform Engineer (Node.js, TypeScript, AWS).
   > 11+ years building distributed, event-driven backend systems across media,
   > fintech, and consumer platforms. Open to remote / hybrid roles globally.

   Site: https://debrajpaul.com
   Resume (PDF): https://debrajpaul.com/Debraj_Paul_CV.pdf

   ## System Design Deep-Dives

   - [{title}](https://debrajpaul.com/system-design/{entry.id}/): {summary}
     (one line per live entry, in `order`)

   ## Optional

   - [{title}](https://debrajpaul.com/system-design/{entry.id}/): {summary}
     (one line per wip entry)

   Use entry.id (not a frontmatter slug field — that was removed in Prompt 8) to build
   each URL.

4. Run `pnpm astro build` and confirm dist/llms.txt exists. Print its full generated
   contents in your report so I can read the actual output, not a description of it.

5. Do not add llms.txt to the sitemap — sitemap.xml is for HTML pages meant for search
   indexing; llms.txt is a separate, directly-fetched convention and doesn't belong
   there.

Stop here once dist/llms.txt is generated and printed — same rule as before, no merge,
no touching the Pages setting.
```

---

## Prompt 9 — Cutover

Only run this after Prompt 8 and 8b are done, you've personally walked every page in
`astro preview` and compared against the live site, and step 7–11's output actually
passed (not "should pass"). This is the one-way step — sequence the manual part below
carefully, it's easy to get a broken interim state if done out of order.

```
The Astro migration is verified and I've reviewed it page-by-page. Time to retire the
old static site and prepare the cutover — but do NOT merge to main or touch any GitHub
repo settings; that stays manual.

1. Re-verify one more time before deleting anything: `pnpm astro check` and
   `pnpm astro build` must both pass clean. If either fails, stop and report — do not
   proceed to deletion.

2. Delete the now-superseded pre-Astro files: index.html (root) and the root-level
   assets/ directory (its one file, Debraj_Paul_CV.pdf, already lives in public/ and is
   served from there — confirm that before deleting the root copy).

3. Update README.md — it currently describes a "single-file, no build step, no
   framework" site, which is no longer true. Rewrite it to describe: Astro + Content
   Collections architecture, the pnpm scripts (dev/build/preview/check), the
   src/content/system-design/*.md pattern for adding a new architecture deep-dive
   (this should read as "drop in a new .md file, nothing else" per how [slug].astro and
   the index.astro loop are wired), the llms.txt endpoint, and the GitHub Actions
   deploy/checks workflows. Keep the Contact section and Availability section as-is —
   only the Stack/Sections/File-tree parts need rewriting.

4. Re-run the sanitization grep guard once more — confirm zero matches after these
   changes.

5. Commit everything on the astro-migration branch with a clear message
   (e.g. "chore: retire pre-Astro static site, update README for Astro architecture").

6. Push the branch. If the `gh` CLI is available and authenticated, open a PR from
   astro-migration into main with a description summarizing the full migration
   (scaffold → content collections → 7 system-design blocks → llms.txt → CI/CD →
   cutover). If `gh` isn't available, just confirm the branch is pushed and give me the
   compare URL.

Stop here. Do not merge the PR, do not touch GitHub repo Settings. Both are on me.
```

### Manual steps — yours, not Claude Code's (order matters)

1. **Review the PR diff** yourself, focusing on the README rewrite and the two deletions.
2. **Before merging**, go to the repo's Settings → Pages and switch the source from
   "Deploy from a branch" to "GitHub Actions". Do this *before or at the same moment as*
   the merge — not after. If `index.html` disappears from `main` while Pages is still
   configured to deploy the branch directly, the site will briefly try to serve raw
   Astro source with no build step and break. Flipping the source first means the
   `deploy.yml` workflow (from Prompt 7) takes over cleanly the moment `main` updates.
3. **Merge the PR.**
4. Watch the **Actions tab** for the `Deploy to GitHub Pages` workflow to go green.
5. Once deployed, load `https://debrajpaul.com` for real and click through: hero CTAs,
   CV download, all 7 `/system-design/[slug]/` pages, nav anchors, footer links, and
   `/llms.txt` directly.
6. Keep the `astro-migration` branch around for a little while as a rollback reference
   before deleting it.

---

## After Claude Code finishes

Come back with the branch/diff and the real step 7–11 output (not a "should be fine" summary — I want to see the actual pass/fail), plus the generated `llms.txt` contents from 8b. I'll do a final review before you touch the GitHub Pages setting or merge anything. Same applies to Prompt 9 — bring me the PR diff before you go near the Pages setting or the merge button.
