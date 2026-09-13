// Real entries only — dates and scope as tracked in Experience.jsx before
// this refactor. No invented figures: earlier design drafts guessed CIC was
// still ongoing and that Shura Council was an AI/document-retrieval build;
// neither is true, so this file carries the corrected chronology instead.
export const EXPERIENCE = [
  {
    id: 'cic',
    role: 'Cloud & IoT Intern',
    org: 'AWS Cloud Innovation Center (CIC)',
    context: 'AWS CIC Bahrain · University of Bahrain',
    // The AWS gold is the site accent now, so this mark stopped being an
    // exception to the palette and became part of it.
    color: 'rgb(var(--accent))',
    colorText: 'rgb(var(--accent))',
    start: '2026-02-01',
    end: '2026-06-30',
    status: 'completed',
    points: [
      'Built the IoT and cloud monitoring system for the Bahrain Ministry of Interior’s police K9 unit.',
      'Implemented anomaly detection on sensor data using Amazon Bedrock.',
      'Shipped the dashboard handlers use to see each dog’s vitals and kennel conditions live.',
    ],
    tags: ['AWS IoT Core', 'Amazon Bedrock', 'Lambda', 'DynamoDB'],
  },
  {
    id: 'shura',
    role: 'Network & Information Security Intern',
    org: 'Bahrain Shura Council',
    context: 'Kingdom of Bahrain',
    color: '#CE1126',
    // Bahrain red is 3.13:1 on this ground — fine for a dot or a bar, which
    // only need 3:1 as non-text UI, but it fails as text. This is the same
    // hue lightened to clear 4.5:1.
    colorText: '#EA5F70',
    start: '2026-07-01',
    end: '2026-09-30',
    status: 'active',
    points: [
      'Administer Active Directory and Microsoft Intune device policy.',
      'Implement Privileged Access Management (PAM) and BitLocker encryption policy.',
      'Manage OS/software patching across the fleet with ManageEngine.',
    ],
    tags: ['Active Directory', 'Intune', 'PAM', 'BitLocker', 'ManageEngine'],
  },
];

// K9 Pavlov is the CIC internship's deliverable, not a separate engagement —
// it gets a cross-reference row instead of retelling itself.
export const K9_CROSS_REF = {
  parentId: 'cic',
  label: 'K9 Pavlov — the CIC deliverable',
  tags: ['IoT Core', 'Greengrass'],
};
