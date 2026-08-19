import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { profile, SITE } from '../config/profile';
import { availability } from '../config/availability';

// The whole corpus in one fetch: profile, Dubai positioning, and the full body
// of every system-design entry. Bodies come from the same content collection
// the .md routes serve, so this cannot drift from them.
export const prerender = true;

export const GET: APIRoute = async () => {
  const entries = await getCollection('systemDesign');
  const byOrder = (a: (typeof entries)[number], b: (typeof entries)[number]) =>
    a.data.order - b.data.order;

  const live = entries.filter((e) => e.data.status === 'live').sort(byOrder);
  const wip = entries.filter((e) => e.data.status === 'wip').sort(byOrder);

  const section = (entry: (typeof entries)[number]) =>
    [
      `## ${entry.data.title}`,
      '',
      `Source: ${SITE}/system-design/${entry.id}`,
      `Stack: ${entry.data.stack.join(', ')}`,
      `Patterns: ${entry.data.patterns.join(', ')}`,
      ...(entry.data.role ? [`Role: ${entry.data.role}`] : []),
      '',
      entry.data.summary,
      '',
      (entry.body ?? '').trim(),
      '',
      '---',
      '',
    ].join('\n');

  const lines = [
    `# ${profile.name} — full profile`,
    '',
    `> ${profile.tagline}`,
    '',
    `Generated from ${SITE}. Index: ${SITE}/llms.txt`,
    '',
    '---',
    '',
    '## Profile',
    '',
    `**${profile.title}**`,
    '',
    profile.summary,
    '',
    `Core stack: ${profile.stack.join(' · ')}`,
    '',
    'Highlights:',
    '',
    ...profile.highlights.map((h) => `- ${h}`),
    '',
    'Certifications:',
    '',
    ...profile.certifications.map((c) => `- ${c}`),
    '',
    `Open to: ${profile.openTo}`,
    '',
    'Contact:',
    '',
    `- Email: ${profile.contact.email}`,
    `- WhatsApp: ${profile.contact.whatsapp}`,
    `- GitHub: ${profile.contact.github}`,
    `- LinkedIn: ${profile.contact.linkedin}`,
    `- Resume (PDF): ${profile.cv.general}`,
    '',
    '---',
    '',
    ...(availability.active
      ? [
          '## Current availability — Dubai',
          '',
          `Source: ${SITE}/dubai`,
          '',
          `- ${availability.cardLine1}`,
          `- ${availability.cardLine2}`,
          `- Window: ${availability.windowLabel}`,
          ...(availability.uaePhone ? [`- UAE phone: ${availability.uaePhone}`] : []),
          `- Dubai CV (PDF): ${profile.cv.dubai}`,
          '',
          'A UAE Job Exploration Entry Permit allows an employer to convert status to a',
          'work permit without leaving the country — no sponsorship transfer, and no',
          'notice period from an overseas move.',
          '',
          '---',
          '',
        ]
      : []),
    '# System design deep-dives',
    '',
    ...live.map(section),
    ...(wip.length ? ['# Additional deep-dives', '', ...wip.map(section)] : []),
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
