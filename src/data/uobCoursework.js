// Every IT-prefixed course (ITCS/ITCC/ITNE/ITIS/ITSE) from the official
// study plan — required courses plus the confirmed electives. Deliberately
// excludes non-IT general education (English, Math, Physics, Arabic,
// Islamic Culture, Human Rights, History) since those aren't "IT courses,"
// and excludes unconfirmed major electives beyond the three already
// verified. Codes cross-checked against the official BSc Computer Science
// - Cloud Computing (2020) study plan PDF.
export const UOB_COURSEWORK = [
  // Cloud specialization + networking foundation
  { code: 'ITNE110', title: 'Introduction to Computer and Network Technology', ch: 3, pillar: 'cloud' },
  { code: 'ITNE231', title: 'Computer Network I', ch: 3, pillar: 'cloud' },
  { code: 'ITCC240', title: 'Fundamental of Cloud Computing', ch: 3, pillar: 'cloud' },
  { code: 'ITCC341', title: 'Cloud Computing Architecture', ch: 3, pillar: 'cloud' },
  { code: 'ITCC345', title: 'Cloud Development', ch: 3, pillar: 'cloud' },
  { code: 'ITCC343', title: 'Cloud Operations', ch: 3, pillar: 'cloud' },
  { code: 'ITCC442', title: 'Cloud Security', ch: 3, pillar: 'cloud' },
  { code: 'ITCC481', title: 'Industrial Training', ch: 1, pillar: 'cloud' },
  { code: 'ITCC498', title: 'Senior Project', ch: 3, pillar: 'cloud' },
  // AI
  { code: 'ITCS440', title: 'Intelligent Systems', ch: 3, pillar: 'ai' },
  // Full-stack / applications / data
  { code: 'ITCS113', title: 'Computer Programming I', ch: 3, pillar: 'fullstack' },
  { code: 'ITCS114', title: 'Computer Programming II', ch: 3, pillar: 'fullstack' },
  { code: 'ITIS103', title: 'Fundamentals of Information Systems', ch: 3, pillar: 'fullstack' },
  { code: 'ITSE201', title: 'Introduction to Software Engineering', ch: 3, pillar: 'fullstack' },
  { code: 'ITCS285', title: 'Database Management Systems', ch: 3, pillar: 'fullstack' },
  { code: 'ITCS316', title: 'Human-Computer Interaction', ch: 3, pillar: 'fullstack' },
  { code: 'ITCS333', title: 'Internet Software Development', ch: 3, pillar: 'fullstack' },
  { code: 'ITCS453', title: 'Multimedia and Hypermedia Systems', ch: 3, pillar: 'fullstack' },
  // Computer science theory / systems
  { code: 'ITCS214', title: 'Data Structures', ch: 3, pillar: 'cs' },
  { code: 'ITCS254', title: 'Discrete Structures I', ch: 3, pillar: 'cs' },
  { code: 'ITCS255', title: 'Discrete Structures II', ch: 3, pillar: 'cs' },
  { code: 'ITCS222', title: 'Computer Organization', ch: 3, pillar: 'cs' },
  { code: 'ITCS325', title: 'Operating Systems', ch: 3, pillar: 'cs' },
  { code: 'ITCS347', title: 'Analysis and Design of Algorithms', ch: 3, pillar: 'cs' },
  { code: 'ITCS411', title: 'Cryptography and Computer Security', ch: 3, pillar: 'cs' },
  { code: 'ITCS441', title: 'Parallel and Distributed Computing', ch: 3, pillar: 'cs' },
  { code: 'ITCS396', title: 'Professional Issues and Ethics', ch: 3, pillar: 'cs' },
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
