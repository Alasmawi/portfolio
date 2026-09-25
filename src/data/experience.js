// Real entries only, kept in step with the CV: the same roles, dates and
// bullets appear there, so an edit here is an edit there too.
//
// `end: null` means ongoing. Experience.jsx draws an ongoing bar up to today
// and prints the range as "Jul 2026 — Present".
//
// `projectId` links a role to the project it produced, which Experience renders
// as a row that opens that project in the Projects section.
export const EXPERIENCE = [
  {
    id: 'shura',
    role: 'Network & Information Security Intern',
    org: 'Bahrain Shura Council',
    context: 'Networks & Information Security department',
    color: '#CE1126',
    // Bahrain red is 3.13:1 on this ground — fine for a dot or a bar, which
    // only need 3:1 as non-text UI, but it fails as text. This is the same
    // hue lightened to clear 4.5:1.
    colorText: '#EA5F70',
    start: '2026-07-01',
    end: null,
    points: [
      'Built Bayyan, the department’s bilingual English and Arabic register of its telecom, permit, contract and subscription obligations: a NestJS and Prisma API, a React front end and PostgreSQL, deployed on Linux behind nginx.',
      'Moved a production MariaDB database off Amazon RDS to on-premises servers through an S3 snapshot, and sequenced the cutover so the restored copy matched the source with no data lost.',
      'Traced a kernel version incompatibility that stopped the AWS Elastic Disaster Recovery agent from replicating a production EC2 instance from Ireland to Frankfurt, and worked the case with AWS Support until the agent installed.',
      'Support staff with network, endpoint and infrastructure issues; run account lifecycle across Active Directory, Entra ID and Intune; and roll out PAM, BitLocker encryption policy and ManageEngine patching across the fleet.',
      'Built a site presenting the organization’s HR achievements for a GCC-level awards competition, published on GitHub Pages.',
      'Write the technical documentation and step-by-step procedures the department works from after handover.',
    ],
    tags: ['NestJS', 'PostgreSQL', 'Amazon RDS', 'AWS DRS', 'Active Directory', 'Intune', 'BitLocker'],
    projectId: 'bayyan',
  },
  {
    id: 'cic',
    role: 'Cloud & IoT Intern',
    org: 'AWS Cloud Innovation Center (CIC)',
    context: 'AWS CIC Bahrain · University of Bahrain',
    color: '#F2A93B',
    // Same hue, used for text. Marks only need 3:1; text needs 4.5:1.
    colorText: '#F2A93B',
    start: '2026-02-01',
    end: '2026-06-30',
    points: [
      'Built the Ministry of Interior Police K9 Unit’s monitoring platform end to end: the dashboard, the serverless backend, and the ingestion pipeline between them.',
      'Designed the backend on AWS: IoT Core and API Gateway take the data in, Lambda processes it, DynamoDB stores it, and Cognito keeps handlers and kennel staff to their own views.',
      'Wired in Amazon Bedrock to flag sensor anomalies and turn them into plain care recommendations on the dashboard.',
      'Demonstrated the finished system live to AWS mentors and Ministry of Interior stakeholders.',
    ],
    tags: ['AWS IoT Core', 'API Gateway', 'Lambda', 'DynamoDB', 'Cognito', 'Amazon Bedrock'],
    projectId: 'k9-pavlov',
  },
];
