import { ItemStatus, StatusHistoryEntry } from '../types';

export const ORDERED_STATUS_FLOW: ItemStatus[] = [
  'Reported',
  'Searching',
  'Possible Match',
  'Claim Submitted',
  'Under Verification',
  'Approved',
  'Returned',
];

export const STATUS_DESCRIPTIONS: Record<string, string> = {
  Reported: 'Item details and images registered into campus repository.',
  Searching: 'Automated campus inventory scanning in progress.',
  'Possible Match': 'Computer vision identified high-similarity candidate.',
  'Claim Submitted': 'Student ownership declaration and proof received.',
  'Under Verification': 'Proctorial Board reviewing serial marks, invoice and student ID.',
  Approved: 'Claim authorized. Item ready for collection at Central Security.',
  Returned: 'Item physically handed over to verified owner.',
  Rejected: 'Claim did not pass security ownership verification.',
  Cancelled: 'Report withdrawn by reporting student.',
};

export function createInitialStatusHistory(actorName = 'Student'): StatusHistoryEntry[] {
  const now = new Date();
  const formatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return [
    {
      status: 'Reported',
      timestamp: formatted,
      note: 'Initial report submitted via web portal.',
      updatedBy: actorName,
    },
    {
      status: 'Searching',
      timestamp: formatted,
      note: 'AI vision and keyword matching initiated.',
      updatedBy: 'Campus AI System',
    },
  ];
}

export function appendStatusHistory(
  currentHistory: StatusHistoryEntry[] | undefined,
  newStatus: ItemStatus,
  note?: string,
  updatedBy = 'Proctorial Board'
): StatusHistoryEntry[] {
  const now = new Date();
  const formatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const history = currentHistory ? [...currentHistory] : [];
  history.push({
    status: newStatus,
    timestamp: formatted,
    note: note || STATUS_DESCRIPTIONS[newStatus] || `Status updated to ${newStatus}.`,
    updatedBy,
  });

  return history;
}

export function getStatusStepIndex(status: ItemStatus): number {
  const normalized = status === 'Active' ? 'Searching' :
    status === 'Pending Verification' ? 'Under Verification' :
    status === 'Claimed' ? 'Approved' :
    status === 'Resolved' ? 'Returned' : status;

  return ORDERED_STATUS_FLOW.indexOf(normalized as ItemStatus);
}
