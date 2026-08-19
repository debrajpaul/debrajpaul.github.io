// Single source of truth for identity/positioning prose that is consumed by more
// than one output: llms.txt, llms-full.txt, and the /index.md + /dubai.md
// markdown twins. Rendered HTML pages still own their own presentational copy
// (Hero, AvailabilityCallout) — keep this file in sync when that copy changes.
//
// Availability strings live in ./availability.ts, not here. That file is the
// one designed for one-line edits (UAE number, visa dates, permit expiry).

export const SITE = 'https://debrajpaul.com';

/**
 * One-line note for index/listing formats (llms.txt, /index.md). Full bodies
 * live in the linked .md files.
 *
 * Do NOT split on sentence boundaries: several summaries contain "Warner Bros."
 * and get cut mid-name. Cap by length at a word boundary instead, and always
 * return terminal punctuation so a following "HTML:" / "Markdown:" never runs
 * on from the last word.
 *
 * Shared deliberately — this logic previously existed twice and only one copy
 * got fixed.
 */
const NOTE_MAX = 150;

export const note = (s: string) => {
  const flat = s.trim().replace(/\s+/g, ' ');
  if (flat.length <= NOTE_MAX) return /[.!?]$/.test(flat) ? flat : `${flat}.`;
  const clipped = flat.slice(0, NOTE_MAX);
  const atWord = clipped.slice(0, clipped.lastIndexOf(' '));
  return `${atWord.replace(/[,;:—-]$/, '')}…`;
};

export const profile = {
  name: 'Debraj Paul',
  title: 'Technical Lead II — Backend / Platform Engineer',
  stack: ['Node.js', 'TypeScript', 'AWS', 'Distributed Systems'],

  /** One-line positioning. Used in llms.txt header and both markdown twins. */
  tagline:
    'Technical Lead II — Backend / Platform Engineer (Node.js, TypeScript, AWS). ' +
    '11+ years building distributed, event-driven backend systems across media, ' +
    'fintech, and consumer platforms.',

  /** Longer blurb for llms-full.txt and /index.md. */
  summary: [
    'Backend and platform technical lead with 11+ years designing, building, and',
    'operating distributed systems across media, fintech, food-tech, and travel.',
    'Deep hands-on expertise in Node.js/TypeScript, AWS-native architectures',
    '(Lambda, ECS, Glue, OpenSearch), Kafka-based event-driven pipelines, and',
    'GraphQL Backend-for-Frontend patterns. Architect of compliance-grade systems:',
    'GDPR/CCPA privacy-request orchestration across 6+ microservices, multi-brand',
    'async content moderation, and production-aware backfill data pipelines.',
  ].join(' '),

  contact: {
    email: 'debraj@debrajpaul.com',
    whatsapp: 'https://wa.me/919435221271',
    github: 'https://github.com/debrajpaul',
    linkedin: 'https://www.linkedin.com/in/debraj-paul',
  },

  cv: {
    general: `${SITE}/Debraj_Paul_CV.pdf`,
    dubai: `${SITE}/Debraj_Paul_CV_Dubai.pdf`,
  },

  highlights: [
    '11+ years building distributed backend systems (media, fintech, food-tech, travel)',
    '~50% transaction-latency reduction — Swiggy Dineout POS event pipelines',
    '~95% credit-workflow automation — PT Tujuh Asia P2P lending platform',
    'GDPR/CCPA orchestration across 6+ microservices via OneTrust',
  ],

  certifications: [
    'AWS Certified Developer – Associate (2024–2027)',
    'Apollo GraphQL Developer – Associate (2025)',
  ],

  openTo:
    'Senior / Staff / Principal Engineer · Technical Architect. ' +
    'Remote-first globally · Hybrid · Open to relocation.',
};
