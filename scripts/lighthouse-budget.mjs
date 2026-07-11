#!/usr/bin/env node
// Runs Lighthouse against the homepage plus one representative system-design
// page, and fails (exit 1) if Performance/Accessibility/Best Practices/SEO
// drop below LH_MIN_SCORE. The system-design page is discovered from dist/
// rather than hardcoded, so new system-design content picks up this same
// gate automatically without editing this script or the CI workflow.

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE_URL = process.env.LH_BASE_URL || 'http://localhost:4321';
const MIN_SCORE = Number(process.env.LH_MIN_SCORE || 95);
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

function discoverSystemDesignSlug() {
  const sdDir = path.resolve('dist', 'system-design');
  if (!fs.existsSync(sdDir)) return null;
  const entries = fs
    .readdirSync(sdDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  return entries[0] ?? null;
}

const paths = ['/'];
const sdSlug = discoverSystemDesignSlug();
if (sdSlug) paths.push(`/system-design/${sdSlug}/`);

const rows = [];
let failed = false;

for (const p of paths) {
  const url = `${BASE_URL}${p}`;
  const outPath = path.join(os.tmpdir(), `lh-${p.replace(/[^a-z0-9]/gi, '_') || 'root'}.json`);
  console.log(`\nRunning Lighthouse against ${url} ...`);
  execSync(
    `npx --yes lighthouse "${url}" --output=json --output-path="${outPath}" ` +
      `--chrome-flags="--headless=new --no-sandbox" ` +
      `--only-categories=${CATEGORIES.join(',')} --quiet`,
    { stdio: 'inherit' },
  );
  const report = JSON.parse(fs.readFileSync(outPath, 'utf-8'));
  for (const category of CATEGORIES) {
    const score = Math.round(report.categories[category].score * 100);
    const pass = score >= MIN_SCORE;
    if (!pass) failed = true;
    rows.push({ path: p, category, score, pass: pass ? 'PASS' : 'FAIL' });
  }
}

console.log(`\nLighthouse budget report (minimum score: ${MIN_SCORE})`);
console.table(rows);

if (failed) {
  console.error(`\nFAIL: one or more categories scored below ${MIN_SCORE}.`);
  process.exit(1);
}

console.log('\nPASS: all categories meet the budget.');
