import type { APIRoute } from 'astro';
import { profile, SITE } from '../config/profile';
import { availability } from '../config/availability';

// Markdown twin of /dubai, served at /dubai.md. The availability lines come from
// config/availability.ts — the same source the printed card was set from. Do not
// hardcode them here.
export const prerender = true;

export const GET: APIRoute = () => {
  const lines = [
    `# ${profile.name} — Dubai`,
    '',
    `**${profile.title}**`,
    '',
    profile.stack.join(' · '),
    '',
    ...(availability.active
      ? [
          '## Availability',
          '',
          `- ${availability.cardLine1}`,
          `- ${availability.cardLine2}`,
          `- Window: ${availability.windowLabel}`,
          `- Location: ${availability.location}`,
          ...(availability.uaePhone ? [`- UAE phone: ${availability.uaePhone}`] : []),
          '',
          'A UAE Job Exploration Entry Permit allows an employer to convert status to a',
          'work permit without leaving the country — no sponsorship transfer, and no',
          'notice period from an overseas move.',
          '',
        ]
      : ['## Availability', '', 'The Dubai availability window has closed. See ' + SITE + '.', '']),
    '## Contact',
    '',
    `- Email: ${profile.contact.email}`,
    `- WhatsApp: ${profile.contact.whatsapp}`,
    `- LinkedIn: ${profile.contact.linkedin}`,
    `- GitHub: ${profile.contact.github}`,
    '',
    '## CV',
    '',
    `- Dubai variant (PDF): ${profile.cv.dubai}`,
    `- General (PDF): ${profile.cv.general}`,
    '',
    '## Background',
    '',
    profile.summary,
    '',
    '## Highlights',
    '',
    ...profile.highlights.map((h) => `- ${h}`),
    '',
    '## Open to',
    '',
    profile.openTo,
    '',
    `Full profile: ${SITE}/index.md · Everything in one file: ${SITE}/llms-full.txt`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
