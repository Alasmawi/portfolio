// Single source of truth for the skills network AND the small-screen list.
//
// Adding a skill: append one object to SKILLS with a `group` that exists in
// SKILL_GROUPS. Position, edges and colour are all derived — nothing else to
// touch. Give it a `color` only if the technology has a real brand colour;
// otherwise it inherits its group's.
//
// Adding a group: append to SKILL_GROUPS. The ring re-spaces itself.
//
// Linking across groups: add a pair to SKILL_LINKS. These are what turn the
// layout from a set of separate stars into one connected network.

export const SKILL_GROUPS = [
  { id: 'ai', label: 'AI & ML', color: '#A78BFA' },
  { id: 'cloud', label: 'Cloud & Serverless', color: '#F2A93B' },
  { id: 'data', label: 'Data & Storage', color: '#3FB950' },
  { id: 'iot', label: 'IoT & Embedded', color: '#E8845B' },
  { id: 'lang', label: 'Languages', color: '#4FA3C4' },
  { id: 'web', label: 'Web & Backend', color: '#6FC3E4' },
  { id: 'tools', label: 'Tooling', color: '#8B98A5' },
];

export const SKILLS = [
  // — AI & ML —
  { id: 'claude-code', label: 'Claude Code', group: 'ai', color: '#D97757' },
  { id: 'claude-api', label: 'Claude API', group: 'ai', color: '#CC785C' },
  { id: 'bedrock', label: 'Amazon Bedrock', group: 'ai', color: '#01A88D' },
  { id: 'mcp', label: 'MCP Servers', group: 'ai' },
  { id: 'rag', label: 'RAG Pipelines', group: 'ai' },
  { id: 'prompt', label: 'Prompt Engineering', group: 'ai' },
  { id: 'anomaly', label: 'Anomaly Detection', group: 'ai' },
  { id: 'cv', label: 'Computer Vision', group: 'ai' },

  // — Cloud & Serverless —
  { id: 'lambda', label: 'AWS Lambda', group: 'cloud', color: '#ED7100' },
  { id: 'apigw', label: 'API Gateway', group: 'cloud', color: '#8C4FFF' },
  { id: 'cognito', label: 'Cognito', group: 'cloud', color: '#DD344C' },
  { id: 'cloudwatch', label: 'CloudWatch', group: 'cloud', color: '#E7157B' },
  { id: 'sns', label: 'SNS', group: 'cloud', color: '#E7157B' },
  { id: 'iotcore', label: 'AWS IoT Core', group: 'cloud', color: '#7AA116' },

  // — Data & Storage —
  { id: 'dynamodb', label: 'DynamoDB', group: 'data', color: '#C925D1' },
  { id: 'mysql', label: 'MySQL', group: 'data', color: '#4479A1' },
  { id: 'sqlite', label: 'SQLite', group: 'data', color: '#0F80CC' },

  // — IoT & Embedded —
  { id: 'esp32', label: 'ESP32', group: 'iot', color: '#E7352C' },
  { id: 'mqtt', label: 'MQTT', group: 'iot', color: '#B14FD8' },
  { id: 'rpi', label: 'Raspberry Pi', group: 'iot', color: '#C51A4A' },

  // — Languages —
  { id: 'go', label: 'Go', group: 'lang', color: '#00ADD8' },
  { id: 'python', label: 'Python', group: 'lang', color: '#3776AB' },
  { id: 'java', label: 'Java', group: 'lang', color: '#E76F00' },
  { id: 'js', label: 'JavaScript', group: 'lang', color: '#F7DF1E' },
  { id: 'cpp', label: 'C++', group: 'lang', color: '#00599C' },

  // — Web & Backend —
  { id: 'react', label: 'React', group: 'web', color: '#61DAFB' },
  { id: 'rest', label: 'REST APIs', group: 'web' },
  { id: 'ws', label: 'WebSockets', group: 'web' },
  { id: 'html', label: 'HTML5', group: 'web', color: '#E34F26' },
  { id: 'css', label: 'CSS3', group: 'web', color: '#1572B6' },

  // — Tooling —
  { id: 'git', label: 'Git', group: 'tools', color: '#F05032' },
  { id: 'github', label: 'GitHub', group: 'tools', color: '#E6EDF3' },
  { id: 'docker', label: 'Docker', group: 'tools', color: '#2496ED' },
  { id: 'linux', label: 'Linux', group: 'tools', color: '#FCC624' },
  { id: 'vscode', label: 'VS Code', group: 'tools', color: '#007ACC' },
];

// Cross-group relationships — how the work actually fits together.
export const SKILL_LINKS = [
  ['claude-code', 'claude-api'],
  ['claude-code', 'mcp'],
  ['claude-code', 'git'],
  ['claude-code', 'vscode'],
  ['claude-code', 'go'],
  ['claude-api', 'mcp'],
  ['claude-api', 'rag'],
  ['claude-api', 'prompt'],
  ['claude-api', 'bedrock'],
  ['mcp', 'rest'],
  ['bedrock', 'lambda'],
  ['bedrock', 'rag'],
  ['prompt', 'rag'],
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
  ['iotcore', 'cloudwatch'],
  ['mqtt', 'esp32'],
  ['rpi', 'linux'],
  ['go', 'rest'],
  ['go', 'ws'],
  ['js', 'react'],
  ['react', 'html'],
  ['react', 'css'],
  ['ws', 'react'],
  ['python', 'sqlite'],
  ['mysql', 'rest'],
  ['docker', 'linux'],
  ['git', 'github'],
  ['sns', 'cloudwatch'],
];
