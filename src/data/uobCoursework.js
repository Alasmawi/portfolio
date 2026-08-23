// Curated from the real UOB transcript — the cloud specialization
// requirements, the security/algorithms/systems core, and the confirmed
// electives. Codes cross-checked against the official BSc Computer
// Science - Cloud Computing (2020) study plan PDF. The additions beyond
// the original 10 are all required courses (MR/CR, "Major GPA: Yes"),
// not electives — every student on this track takes them, so no guessing
// involved in adding them.
export const UOB_COURSEWORK = [
  { code: 'ITCC345', title: 'Cloud Development', ch: 3, pillar: 'cloud' },
  { code: 'ITCC343', title: 'Cloud Operations', ch: 3, pillar: 'cloud' },
  { code: 'ITCC341', title: 'Cloud Computing Architecture', ch: 3, pillar: 'cloud' },
  { code: 'ITCC442', title: 'Cloud Security', ch: 3, pillar: 'cloud' },
  { code: 'ITCC240', title: 'Fundamental of Cloud Computing', ch: 3, pillar: 'cloud' },
  { code: 'ITNE231', title: 'Computer Network I', ch: 3, pillar: 'cloud' },
  { code: 'ITCC498', title: 'Senior Project', ch: 3, pillar: 'cloud' },
  { code: 'ITCS440', title: 'Intelligent Systems', ch: 3, pillar: 'ai' },
  { code: 'ITCS333', title: 'Internet Software Development', ch: 3, pillar: 'fullstack' },
  { code: 'ITCS453', title: 'Multimedia and Hypermedia Systems', ch: 3, pillar: 'fullstack' },
  { code: 'ITCS285', title: 'Database Management Systems', ch: 3, pillar: 'fullstack' },
  { code: 'ITCS316', title: 'Human-Computer Interaction', ch: 3, pillar: 'fullstack' },
  { code: 'ITSE201', title: 'Introduction to Software Engineering', ch: 3, pillar: 'fullstack' },
  { code: 'ITCS441', title: 'Parallel and Distributed Computing', ch: 3, pillar: 'cs' },
  { code: 'ITCS411', title: 'Cryptography and Computer Security', ch: 3, pillar: 'cs' },
  { code: 'ITCS214', title: 'Data Structures', ch: 3, pillar: 'cs' },
  { code: 'ITCS347', title: 'Analysis and Design of Algorithms', ch: 3, pillar: 'cs' },
  { code: 'ITCS325', title: 'Operating Systems', ch: 3, pillar: 'cs' },
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
