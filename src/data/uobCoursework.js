// Curated from the real UOB transcript — not the full ~40-course list, just
// the standout ones that actually say something (the cloud specialization
// requirements, the security/algorithms core, and the four major/business
// electives). Codes for elective slots are shown as "Elective" rather than
// invented — UOB's own transcript lists those slots as placeholders
// ("ITCC4xx Or ITCS4xx") until filled, so this matches the source instead
// of guessing. "ITCC3xx" (Cloud Architecture) is similarly a partial code —
// not shown in the transcript excerpt available, kept honest rather than
// invented in full.
export const UOB_COURSEWORK = [
  { code: 'ITCC345', title: 'Cloud Development', ch: 3, pillar: 'cloud' },
  { code: 'ITCC343', title: 'Cloud Operations', ch: 3, pillar: 'cloud' },
  { code: 'ITCC3xx', title: 'Cloud Architecture', ch: 3, pillar: 'cloud' },
  { code: 'Elective', title: 'Cloud Security', ch: 3, pillar: 'cloud' },
  { code: 'ITCC498', title: 'Senior Project', ch: 3, pillar: 'cloud' },
  { code: 'ITCS440', title: 'Intelligent Systems', ch: 3, pillar: 'ai' },
  { code: 'ITCS333', title: 'Internet Software Development', ch: 3, pillar: 'fullstack' },
  { code: 'Elective', title: 'Multimedia Systems', ch: 3, pillar: 'fullstack' },
  { code: 'Elective', title: 'Parallel Systems', ch: 3, pillar: 'cs' },
  { code: 'Elective', title: 'Business Information Systems', ch: 3, pillar: 'cs' },
  { code: 'ITCS411', title: 'Cryptography and Computer Security', ch: 3, pillar: 'cs' },
];

// Distinct categorical hues, not a status-color reuse — the old CS gray
// read as "no color"/disabled rather than a real category, and green was
// double-booked with the site's "operational" status dots elsewhere.
export const PILLAR_COLORS = {
  cloud: '#F2A93B', // amber
  ai: '#2FC2E8', // cyan
  fullstack: '#A78BFA', // violet
  cs: '#F472B6', // rose
};
