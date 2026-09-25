// `color` is the institution's own identity colour, carried over from the
// original site — Reboot's tiffany and UoB's gold. They mark *whose* entry this
// is, which is a different job from the site's rose accent.
//
// `from`/`to` are years and drive the parallel-tracks figure in Education.jsx;
// the text matches the CV's Education section.
export const EDUCATION = [
  {
    id: 'uob',
    school: 'University of Bahrain',
    short: 'UoB',
    color: '#C9A227',
    degree: 'B.Sc. Computer Science',
    track: 'Cloud Computing',
    period: '2022 — 2026',
    from: 2022,
    to: 2026,
    stats: [
      { value: '30', label: 'courses' },
      { value: '88', label: 'credit hours' },
    ],
    points: [
      'Specialized in cloud architecture, security, networking and distributed systems, on a track built around the AWS Academy curriculum.',
      'Senior capstone: the K9 Pavlov System, which I carried into the AWS Cloud Innovation Center internship.',
    ],
    coursework: true,
  },
  {
    id: 'reboot',
    school: 'Reboot Coding Institute',
    short: 'Reboot01',
    color: '#1CCFC9',
    degree: 'Full Stack Development',
    track: 'DevOps specialization',
    period: '2024 — 2026',
    from: 2024,
    to: 2026,
    // The specialisation phase is still running — rebootJourney.js marks it
    // `active`, which is where the live dot comes from.
    current: true,
    stats: [
      { value: '24', label: 'months' },
      { value: '2', label: 'phases' },
    ],
    points: [
      'Project-based on the 01-edu model: no lectures and no written exams. Every project is reviewed by peers and defended in a live audit before it passes.',
      'Go, algorithms, networking and full-stack web development, studied alongside the degree. Brain-Book was built and audited here.',
    ],
    journey: true,
  },
];
