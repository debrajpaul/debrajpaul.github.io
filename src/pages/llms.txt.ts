import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { profile, note, SITE } from '../config/profile';
import { availability } from '../config/availability';

// https://llmstxt.org — index of fetchable resources, not a content dump.
// Every entry links its clean-markdown twin alongside the HTML page, because
// the HTML ships the sitewide mermaid runtime and is expensive to parse.
// The expanded corpus lives at /llms-full.txt, listed under "## Optional"
// per the spec's meaning of that heading: skippable when context is tight.

export const GET: APIRoute = async () => {
  const entries = await getCollection('systemDesign');
  const byOrder = (a: (typeof entries)[number], b: (typeof entries)[number]) =>
    a.data.order - b.data.order;

  const live = entries.filter((e) => e.data.status === 'live').sort(byOrder);
  const wip = entries.filter((e) => e.data.status === 'wip').sort(byOrder);

  const toLine = (entry: (typeof entries)[number]) =>
    `- [${entry.data.title}](${SITE}/system-design/${entry.id}.md): ` +
    `${note(entry.data.summary)} ` +
    `HTML: ${SITE}/system-design/${entry.id}`;

  const lines = [
    `# ${profile.name}`,
    '',
    `> ${profile.tagline}`,
    `> ${profile.openTo}`,
    '',
    'Markdown versions of every page are linked below and are the preferred format —',
    'the HTML pages load a client-side diagram runtime that adds no information.',
    '',
    '## Pages',
    '',
    `- [Home](${SITE}/index.md): Full profile — experience, stack, metrics, certifications. HTML: ${SITE}`,
    ...(availability.active
      ? [
          `- [Dubai availability](${SITE}/dubai.md): ` +
            `${availability.cardLine1}. ${availability.cardLine2}. ` +
            `On the ground ${availability.windowLabel}. HTML: ${SITE}/dubai`,
        ]
      : []),
    '',
    '## Documents',
    '',
    `- [Resume (PDF)](${profile.cv.general}): General CV.`,
    ...(availability.active
      ? [`- [Resume — Dubai variant (PDF)](${profile.cv.dubai}): Gulf-market positioning and visa availability.`]
      : []),
    '',
    '## System Design Deep-Dives',
    '',
    ...live.map(toLine),
    '',
    '## Additional Deep-Dives',
    '',
    ...wip.map(toLine),
    '',
    '## Optional',
    '',
    `- [Everything in one file](${SITE}/llms-full.txt): Profile plus the full text of every deep-dive inlined. Skip if context is limited — the individual .md files above cover the same ground.`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
