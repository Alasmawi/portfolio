// `track` and `stats` drive the accent treatment in Education.jsx. Both are
// read from real sources — the degree's own specialisation, the course list in
// uobCoursework.js (30 courses, 88 credit hours), and the 01Edu phase data in
// rebootJourney.js — so the accents state facts rather than decorate.
export const EDUCATION = [
  {
    id: 'uob',
    school: 'University of Bahrain',
    degree: 'B.Sc. Computer Science — Cloud Computing',
    period: '2022 — 2026',
    track: 'Cloud Computing track',
    stats: [
      { value: '30', label: 'courses' },
      { value: '88', label: 'credit hours' },
    ],
    description:
      'Specialized cloud computing track, benchmarked against AWS curriculum guidelines.',
    coursework: true,
  },
  {
    id: 'reboot',
    school: 'Reboot Coding Institute',
    degree: 'Full Stack Development — powered by 01Edu',
    period: '2024 — 2026',
    track: 'Cloud DevOps & Cybersecurity',
    stats: [
      { value: '24', label: 'months' },
      { value: '2', label: 'phases' },
    ],
    // The 01Edu specialisation phase is still running — rebootJourney.js
    // marks it `active`, which is where the live dot comes from.
    current: true,
    description:
      'Peer-to-peer, project-based training with no lectures and no given answers — the 01Edu model, run in Bahrain with Tamkeen backing. Overlaps the final two years of the CS degree.',
    coursework: false,
    journey: true,
  },
];
