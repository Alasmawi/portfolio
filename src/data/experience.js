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
    color: '#F2A93B',
    // Same hue, used for text. Marks only need 3:1; text needs 4.5:1.
    colorText: '#F2A93B',
    start: '2026-02-01',
    end: '2026-06-30',
    status: 'completed',
    points: [
      'Built a smart IoT/cloud monitoring solution for the Bahrain Ministry of Interior’s Police K9 Unit.',
      'Implemented anomaly detection on sensor data using Amazon Bedrock.',
      'Shipped a centralized dashboard for real-time health and environment tracking.',
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
