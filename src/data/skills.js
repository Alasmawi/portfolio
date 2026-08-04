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
// Keep labels short — the longest one in the whole list sets the column width
// for every block in the graph.

// Order is placement: the first group sits at the top of the ring and the rest
// follow clockwise. Full-stack, cloud and AI are deliberately first, so they
// take the top and right of the canvas.
export const SKILL_GROUPS = [
  { id: 'ai', label: 'AI & ML', color: '#A78BFA' },
  { id: 'cloud', label: 'Cloud', color: '#F2A93B' },
  { id: 'web', label: 'Web', color: '#7DD3FC' },
  { id: 'lang', label: 'Languages', color: '#4F7FD4' },
  { id: 'data', label: 'Data', color: '#3FB950' },
  { id: 'iot', label: 'IoT', color: '#E8845B' },
  { id: 'tools', label: 'Tooling', color: '#E8629B' },
];

export const SKILLS = [
  // — AI & ML —
  { id: 'claude-code', label: 'Claude Code', group: 'ai', color: '#D97757' },
  { id: 'claude-api', label: 'Claude API', group: 'ai', color: '#CC785C' },
  { id: 'bedrock', label: 'Bedrock', group: 'ai', color: '#01A88D', glyph: 'bedrock' },
  { id: 'mcp', label: 'MCP', group: 'ai' },
  { id: 'rag', label: 'RAG', group: 'ai' },
  { id: 'agents', label: 'LLM Agents', group: 'ai' },
  { id: 'cv', label: 'Vision', group: 'ai' },

  // — Cloud —
  { id: 'lambda', label: 'Lambda', group: 'cloud', color: '#ED7100', glyph: 'lambda' },
  { id: 'apigw', label: 'API Gateway', group: 'cloud', color: '#8C4FFF', glyph: 'gateway' },
  { id: 's3', label: 'S3', group: 'cloud', color: '#7AA116' },
  { id: 'cognito', label: 'Cognito', group: 'cloud', color: '#DD344C', glyph: 'cognito' },
  { id: 'iotcore', label: 'IoT Core', group: 'cloud', color: '#7AA116', glyph: 'iot' },
  { id: 'cdk', label: 'AWS CDK', group: 'cloud' },

  // — Web —
  { id: 'react', label: 'React', group: 'web', color: '#61DAFB' },
  { id: 'rest', label: 'REST APIs', group: 'web' },
  { id: 'ws', label: 'WebSockets', group: 'web' },
  { id: 'htmlcss', label: 'HTML & CSS', group: 'web', color: '#E34F26' },
  { id: 'tailwind', label: 'Tailwind', group: 'web', color: '#38BDF8' },
  { id: 'vite', label: 'Vite', group: 'web', color: '#646CFF' },

  // — Languages —
  { id: 'go', label: 'Go', group: 'lang', color: '#00ADD8' },
  { id: 'python', label: 'Python', group: 'lang', color: '#3776AB' },
  { id: 'rust', label: 'Rust', group: 'lang', color: '#DE7B4A' },
  { id: 'js', label: 'JavaScript', group: 'lang', color: '#F7DF1E' },
  { id: 'java', label: 'Java', group: 'lang', color: '#E76F00' },
  { id: 'cpp', label: 'C++', group: 'lang', color: '#00599C' },

  // — Data —
  { id: 'dynamodb', label: 'DynamoDB', group: 'data', color: '#C925D1', glyph: 'dynamodb' },
  { id: 'mysql', label: 'MySQL', group: 'data', color: '#4479A1' },
  { id: 'sqlite', label: 'SQLite', group: 'data', color: '#0F80CC' },

  // — IoT —
  { id: 'esp32', label: 'ESP32', group: 'iot', color: '#E7352C' },
  { id: 'mqtt', label: 'MQTT', group: 'iot', color: '#B14FD8' },
  { id: 'rpi', label: 'Raspberry Pi', group: 'iot', color: '#C51A4A' },

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
  ['claude-code', 'rust'],
  ['claude-api', 'mcp'],
  ['claude-api', 'rag'],
  ['claude-api', 'agents'],
  ['claude-api', 'bedrock'],
  ['agents', 'mcp'],
  ['mcp', 'rest'],
  ['rag', 's3'],
  ['bedrock', 'lambda'],
  ['cv', 'python'],
  ['cv', 'rpi'],
  ['lambda', 'dynamodb'],
  ['lambda', 'apigw'],
  ['lambda', 'go'],
  ['cdk', 'lambda'],
  ['cdk', 'python'],
  ['s3', 'react'],
  ['apigw', 'rest'],
  ['cognito', 'rest'],
  ['iotcore', 'mqtt'],
  ['mqtt', 'esp32'],
  ['rpi', 'linux'],
  ['go', 'rest'],
  ['go', 'ws'],
  ['rust', 'esp32'],
  ['js', 'react'],
  ['react', 'htmlcss'],
  ['react', 'tailwind'],
  ['react', 'vite'],
  ['ws', 'react'],
  ['python', 'sqlite'],
  ['mysql', 'rest'],
  ['docker', 'linux'],
  ['git', 'github'],
];
