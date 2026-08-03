// Single source of truth for both skills views — the network graph and the
// grouped card grid.
//
// Adding a skill: append one object to SKILLS with a `group` that exists in
// SKILL_GROUPS. Position, edges and colour are all derived — nothing else to
// touch. Give it a `color` only if the technology has a real brand colour;
// otherwise it inherits its group's. `glyph` is optional and only used by the
// card view for AWS services.
//
// Adding a group: append to SKILL_GROUPS. The ring re-spaces itself.
//
// Linking across groups: add a pair to SKILL_LINKS. These are what turn the
// layout from a set of separate stars into one connected network.
//
// Keep the list tight. Every extra node shrinks the whole graph, because
// fitView has to scale it down to fit the canvas.

export const SKILL_GROUPS = [
  { id: 'ai', label: 'AI & ML', color: '#A78BFA' },
  { id: 'cloud', label: 'Cloud', color: '#F2A93B' },
  { id: 'data', label: 'Data', color: '#3FB950' },
  { id: 'iot', label: 'IoT', color: '#E8845B' },
  { id: 'lang', label: 'Languages', color: '#4FA3C4' },
  { id: 'web', label: 'Web', color: '#6FC3E4' },
  { id: 'tools', label: 'Tooling', color: '#8B98A5' },
];

export const SKILLS = [
  // — AI & ML —
  { id: 'claude-code', label: 'Claude Code', group: 'ai', color: '#D97757' },
  { id: 'claude-api', label: 'Claude API', group: 'ai', color: '#CC785C' },
  { id: 'bedrock', label: 'Amazon Bedrock', group: 'ai', color: '#01A88D', glyph: 'bedrock' },
  { id: 'mcp', label: 'MCP Servers', group: 'ai' },
  { id: 'rag', label: 'RAG Pipelines', group: 'ai' },
  { id: 'anomaly', label: 'Anomaly Detection', group: 'ai' },
  { id: 'cv', label: 'Computer Vision', group: 'ai' },

  // — Cloud —
  { id: 'lambda', label: 'AWS Lambda', group: 'cloud', color: '#ED7100', glyph: 'lambda' },
  { id: 'apigw', label: 'API Gateway', group: 'cloud', color: '#8C4FFF', glyph: 'gateway' },
  { id: 'iotcore', label: 'AWS IoT Core', group: 'cloud', color: '#7AA116', glyph: 'iot' },
  { id: 'cognito', label: 'Cognito', group: 'cloud', color: '#DD344C', glyph: 'cognito' },

  // — Data —
  { id: 'dynamodb', label: 'DynamoDB', group: 'data', color: '#C925D1', glyph: 'dynamodb' },
  { id: 'mysql', label: 'MySQL', group: 'data', color: '#4479A1' },
  { id: 'sqlite', label: 'SQLite', group: 'data', color: '#0F80CC' },

  // — IoT —
  { id: 'esp32', label: 'ESP32', group: 'iot', color: '#E7352C' },
  { id: 'mqtt', label: 'MQTT', group: 'iot', color: '#B14FD8' },
  { id: 'rpi', label: 'Raspberry Pi', group: 'iot', color: '#C51A4A' },

  // — Languages —
  { id: 'go', label: 'Go', group: 'lang', color: '#00ADD8' },
  { id: 'python', label: 'Python', group: 'lang', color: '#3776AB' },
  { id: 'java', label: 'Java', group: 'lang', color: '#E76F00' },
  { id: 'js', label: 'JavaScript', group: 'lang', color: '#F7DF1E' },
  { id: 'cpp', label: 'C++', group: 'lang', color: '#00599C' },

  // — Web —
  { id: 'react', label: 'React', group: 'web', color: '#61DAFB' },
  { id: 'rest', label: 'REST APIs', group: 'web' },
  { id: 'ws', label: 'WebSockets', group: 'web' },
  { id: 'htmlcss', label: 'HTML & CSS', group: 'web', color: '#E34F26' },

  // — Tooling —
  { id: 'git', label: 'Git', group: 'tools', color: '#F05032' },
  { id: 'github', label: 'GitHub', group: 'tools', color: '#E6EDF3' },
  { id: 'docker', label: 'Docker', group: 'tools', color: '#2496ED' },
  { id: 'linux', label: 'Linux', group: 'tools', color: '#FCC624' },
];

// Cross-group relationships — how the work actually fits together.
export const SKILL_LINKS = [
  ['claude-code', 'claude-api'],
  ['claude-code', 'mcp'],
  ['claude-code', 'git'],
  ['claude-code', 'go'],
  ['claude-api', 'mcp'],
  ['claude-api', 'rag'],
  ['claude-api', 'bedrock'],
  ['mcp', 'rest'],
  ['bedrock', 'lambda'],
  ['bedrock', 'rag'],
  ['anomaly', 'python'],
  ['anomaly', 'iotcore'],
  ['cv', 'python'],
  ['cv', 'rpi'],
  ['lambda', 'dynamodb'],
  ['lambda', 'apigw'],
  ['lambda', 'go'],
  ['apigw', 'rest'],
  ['cognito', 'rest'],
  ['iotcore', 'mqtt'],
  ['mqtt', 'esp32'],
  ['rpi', 'linux'],
  ['go', 'rest'],
  ['go', 'ws'],
  ['js', 'react'],
  ['react', 'htmlcss'],
  ['ws', 'react'],
  ['python', 'sqlite'],
  ['mysql', 'rest'],
  ['docker', 'linux'],
  ['git', 'github'],
];
