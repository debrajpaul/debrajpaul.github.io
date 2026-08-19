import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { profile, note, SITE } from '../config/profile';
import { availability } from '../config/availability';

// Markdown twin of the homepage, served at /index.md. Advertised from llms.txt
// and from a <link rel="alternate" type="text/markdown"> on / itself, so an
// agent that lands on the HTML can fetch clean prose instead of parsing the
// page (which ships the mermaid client runtime on every route).
export const prerender = true;

export const GET: APIRoute = async () => {
  const entries = await getCollection('systemDesign');
  const sorted = [...entries].sort((a, b) => a.data.order - b.data.order);

  const lines = [
    `# ${profile.name}`,
    '',
    `**${profile.title}**`,
    '',
    profile.summary,
    '',
    '## Contact',
    '',
    `- Email: ${profile.contact.email}`,
    `- WhatsApp: ${profile.contact.whatsapp}`,
    `- GitHub: ${profile.contact.github}`,
    `- LinkedIn: ${profile.contact.linkedin}`,
    `- Site: ${SITE}`,
    `- Resume (PDF): ${profile.cv.general}`,
    '',
    '## Open to',
    '',
    profile.openTo,
    ...(availability.active
      ? ['', `Currently: ${availability.cardLine1}. ${availability.cardLine2}.`,
         `See ${SITE}/dubai (markdown: ${SITE}/dubai.md).`]
      : []),
    '',
    '## Highlights',
    '',
    ...profile.highlights.map((h) => `- ${h}`),
    '',
    '## Core stack',
    '',
    profile.stack.join(' · '),
    '',
    '## System design deep-dives',
    '',
    'Full text of each is available as markdown at the `.md` URL — prefer those over the HTML pages.',
    '',
    ...sorted.map(
      (e) =>
        `- [${e.data.title}](${SITE}/system-design/${e.id}) — ${note(e.data.summary)} ` +
        `Markdown: ${SITE}/system-design/${e.id}.md`
    ),
    '',
    '## Certifications',
    '',
    ...profile.certifications.map((c) => `- ${c}`),
    '',
    `Everything on this site in one file: ${SITE}/llms-full.txt`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
