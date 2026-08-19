// Single source of truth for the Dubai availability window. Both /dubai and
// the root hero banner read from this — no hardcoded availability strings
// elsewhere in the codebase. See README.md "Future edits" for the three
// one-line changes this file is designed around (UAE number, visa dates,
// permit expiry).
export const availability = {
  active: true,
  location: 'Dubai',
  // Set to "+971 5X XXX XXXX" once a UAE SIM is active (~25 Sep 2026).
  // Renders nowhere while null — no placeholder, no "TBA".
  uaePhone: null as string | null,
  // Provisional until visa validity dates are confirmed.
  windowLabel: 'Sep–Dec 2026',
  // Printed verbatim on the physical card handed out at AWS Summit Dubai.
  // Must match word for word — do not edit without reprinting the card.
  cardLine1: 'In Dubai now — Job Seeker Visa',
  cardLine2: 'No sponsorship transfer needed',
};
