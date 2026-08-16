// The four things the site is actually about, replacing the old
// Cloud/IoT/Backend framing. This is the single source of truth: Hero's
// focus panel reads it directly, and each project in projects.js carries a
// `pillars` array of these ids so the two stay linked without duplicating
// the taxonomy anywhere.
export const FOCUS_PILLARS = [
  {
    id: 'cloud',
    label: 'Cloud Computing',
    blurb:
      'AWS end to end — IoT Core, Lambda, DynamoDB, S3. K9 Pavlov\u2019s whole backend runs on it, and I\u2019m working toward the Solutions Architect Associate cert next.',
    tools: ['AWS', 'Lambda', 'DynamoDB', 'IoT Core', 'S3'],
  },
  {
    id: 'ai',
    label: 'AI',
    blurb:
      'Amazon Bedrock for anomaly detection in K9 Pavlov, YOLOv8 for real-time person counting in detecto, and retrieval-augmented answers with sources attached in guidely.',
    tools: ['Amazon Bedrock', 'YOLOv8', 'RAG', 'FAISS'],
  },
  {
    id: 'fullstack',
    label: 'Full-Stack Development',
    blurb:
      'React front ends, Go and Python back ends, real-time features built on raw WebSockets rather than a framework doing the hard part for me.',
    tools: ['React', 'Go', 'Python', 'WebSockets'],
  },
  {
    id: 'cs',
    label: 'Computer Science',
    blurb:
      'First-principles work: an HTTP server, a Unix shell, a ray tracer \u2014 each built from scratch, no framework or standard library shortcut doing the hard part.',
    tools: ['Systems Programming', 'Networking', 'Algorithms'],
  },
];
