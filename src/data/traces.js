// The hero's data-path panel: one real flow through each of three projects,
// drawn as a trace waterfall. Hops and their order come from the project
// descriptions in projects.js — nothing here is a component those systems don't
// have.
//
// `start` and `width` are positions on the panel's time axis (0–1), not
// measurements. They set the order hops light up in and which ones run side by
// side; the panel prints no durations, because it has none to print.
//
// `kind`: 'gate' is the hop every request passes through (amber, the same rule
// the K9 architecture diagram uses), 'live' is where a person sees the result
// (the teal status dot), anything else is a plain hop.
export const TRACES = [
  {
    id: 'k9-pavlov',
    tab: 'K9 Pavlov',
    event: 'a collar reading, to the handler',
    result: 'A flagged reading reaches the handler as plain care guidance, not a raw number.',
    spans: [
      { name: 'ESP32 collar', detail: 'heart rate, temperature', start: 0, width: 0.12 },
      { name: 'Pi 5 gateway', detail: 'Greengrass, in the kennel', start: 0.1, width: 0.12, kind: 'gate' },
      { name: 'AWS IoT Core', detail: 'MQTT', start: 0.2, width: 0.14 },
      { name: 'Lambda', detail: 'detection rules', start: 0.32, width: 0.16 },
      { name: 'DynamoDB', detail: 'reading and event', start: 0.46, width: 0.12 },
      { name: 'Amazon Bedrock', detail: 'explains the flag', start: 0.46, width: 0.28 },
      { name: 'React dashboard', detail: 'Cognito, handler view', start: 0.74, width: 0.24, kind: 'live' },
    ],
  },
  {
    id: 'bayyan',
    tab: 'Bayyan',
    event: 'a contract saved, its renewal watched',
    result: 'Each obligation turns warning, then critical, as its renewal date approaches.',
    spans: [
      { name: 'React · EN / عربي', detail: 'record saved', start: 0, width: 0.12 },
      { name: 'nginx', detail: 'reverse proxy', start: 0.1, width: 0.08, kind: 'gate' },
      { name: 'NestJS API', detail: 'derives the renewal date', start: 0.16, width: 0.22 },
      { name: 'Prisma → PostgreSQL', detail: 'record stored', start: 0.34, width: 0.14 },
      { name: 'MinIO', detail: 'attachment kept', start: 0.34, width: 0.18 },
      { name: 'Renewal check', detail: 'warning → critical', start: 0.52, width: 0.22 },
      { name: 'PDF and Excel', detail: 'WeasyPrint, ExcelJS', start: 0.74, width: 0.24, kind: 'live' },
    ],
  },
  {
    id: 'guidely',
    tab: 'Guidely',
    event: 'a policy question, answered with sources',
    result: 'Finds the right passage for 94% of test questions, and cites every one it used.',
    spans: [
      { name: 'Question', detail: 'plain language', start: 0, width: 0.08 },
      { name: 'FastAPI', detail: 'the service', start: 0.06, width: 0.1, kind: 'gate' },
      { name: 'sentence-transformers', detail: 'embeds the question', start: 0.14, width: 0.14 },
      { name: 'FAISS', detail: 'nearest passages', start: 0.26, width: 0.14 },
      { name: 'Ollama or OpenAI', detail: 'answers from them only', start: 0.38, width: 0.36 },
      { name: 'Answer and sources', detail: 'file, section, score', start: 0.74, width: 0.24, kind: 'live' },
    ],
  },
];
