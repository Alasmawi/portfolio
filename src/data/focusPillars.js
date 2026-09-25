// The four kinds of work the site is about, in the order the headline puts
// them: full-stack first, cloud as the depth under it. Each project in
// projects.js carries a `pillars` array of these ids, and the UoB coursework is
// filed under them too, so one taxonomy runs through the whole page.
//
// `proof` is the evidence, named rather than counted. A count made the pillar
// with the fewest repos look weakest, which for Cloud was backwards: its
// evidence is two internships, not a pile of repos. Each item either opens a
// project (`project`) or jumps to a section (`href`).
export const FOCUS_PILLARS = [
  {
    id: 'fullstack',
    label: 'Full-stack products',
    blurb:
      'The interface, the API, the data model and the deploy, owned as one piece of work rather than handed across a wall.',
    proof: [
      { label: 'Bayyan', project: 'bayyan' },
      { label: 'Brain-Book', project: 'brain-book' },
      { label: 'K9 dashboard', project: 'k9-pavlov' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud on AWS',
    blurb:
      'Serverless backends and IoT ingestion on AWS, and moving production systems between AWS and on-premises without losing data.',
    proof: [
      { label: 'K9 backend', project: 'k9-pavlov' },
      { label: 'RDS → on-prem migration', href: '#experience' },
      { label: 'DRS replication fix', href: '#experience' },
    ],
  },
  {
    id: 'ai',
    label: 'Applied AI',
    blurb:
      'Models put to work inside products — retrieval, detection, anomaly explanations — with the evidence shown to whoever relies on the answer.',
    proof: [
      { label: 'Guidely', project: 'guidely' },
      { label: 'Detecto', project: 'detecto' },
      { label: 'Bedrock in K9', project: 'k9-pavlov' },
    ],
  },
  {
    id: 'cs',
    label: 'Systems from scratch',
    blurb:
      'An HTTP server on epoll, a Unix shell, a ray tracer: built without a framework, to know what the frameworks are doing for me.',
    proof: [
      { label: 'localhost', project: 'localhost' },
      { label: '0-shell', project: '0-shell' },
      { label: 'rt', project: 'rt' },
    ],
  },
];
