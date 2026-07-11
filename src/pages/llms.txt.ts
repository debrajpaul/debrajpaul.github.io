import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const entries = await getCollection('systemDesign');

  const live = entries
    .filter((entry) => entry.data.status === 'live')
    .sort((a, b) => a.data.order - b.data.order);

  const wip = entries.filter((entry) => entry.data.status === 'wip');

  const toLine = (entry: (typeof entries)[number]) =>
    `- [${entry.data.title}](https://debrajpaul.com/system-design/${entry.id}/): ${entry.data.summary}`;

  const lines = [
    '# Debraj Paul',
    '',
    '> Technical Lead II — Backend / Platform Engineer (Node.js, TypeScript, AWS).',
    '> 11+ years building distributed, event-driven backend systems across media,',
    '> fintech, and consumer platforms. Open to remote / hybrid roles globally.',
    '',
    'Site: https://debrajpaul.com',
    'Resume (PDF): https://debrajpaul.com/Debraj_Paul_CV.pdf',
    '',
    '## System Design Deep-Dives',
    '',
    ...live.map(toLine),
    '',
    '## Optional',
    '',
    ...wip.map(toLine),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
