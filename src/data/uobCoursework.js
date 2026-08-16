// Curated from the real UOB transcript — not the full ~40-course list, just
// the standout ones that actually say something (the cloud specialization
// requirements, the security/algorithms core, and the four major/business
// electives). Codes for elective slots are shown as "Elective" rather than
// invented — UOB's own transcript lists those slots as placeholders
// ("ITCC4xx Or ITCS4xx") until filled, so this matches the source instead
// of guessing at a real course code.
export const UOB_COURSEWORK = [
  { code: 'ITCC345', title: 'Cloud Development', ch: 3, pillar: 'cloud' },
  { code: 'ITCC343', title: 'Cloud Operations', ch: 3, pillar: 'cloud' },
  { code: 'Elective', title: 'Cloud Security', ch: 3, pillar: 'cloud' },
  { code: 'ITCC498', title: 'Senior Project', ch: 3, pillar: 'cloud' },
  { code: 'ITCS440', title: 'Intelligent Systems', ch: 3, pillar: 'ai' },
  { code: 'Elective', title: 'Multimedia Systems', ch: 3, pillar: 'fullstack' },
  { code: 'Elective', title: 'Parallel Systems', ch: 3, pillar: 'cs' },
  { code: 'Elective', title: 'Business Information Systems', ch: 3, pillar: 'cs' },
  { code: 'ITCS411', title: 'Cryptography and Computer Security', ch: 3, pillar: 'cs' },
];

// Color per pillar for the credit-distribution bar. Deliberately not the
// FocusPanel's uniform green status-dot — here color has to distinguish
// four categories from each other, so each pillar gets its own token.
export const PILLAR_COLORS = {
  cloud: '#F2A93B', // amber
  ai: '#2FC2E8', // cyan
  fullstack: '#3FB950', // green
  cs: '#5E6B7A', // muted gray
};
