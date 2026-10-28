import { EmailLogEntry } from '../types';

const STORAGE_KEY_EMAIL_LOGS = 'campus_lf_email_logs_v1';

export const EMAIL_SUBJECTS = {
  AI_MATCH: 'Possible Match Found for Your Lost Item',
  CLAIM_SUBMITTED: 'Claim Request Submitted',
  CLAIM_APPROVED: 'Your Lost & Found Claim Has Been Approved',
  CLAIM_REJECTED: 'Update on Your Lost & Found Claim',
  MORE_INFO: 'Additional Information Required for Your Claim',
  ITEM_RETURNED: 'Your Lost Item Has Been Marked as Returned',
};

export function getStoredEmailLogs(): EmailLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMAIL_LOGS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
}

export function saveEmailLog(entry: Omit<EmailLogEntry, 'id' | 'sentAt' | 'status'>): EmailLogEntry {
  const newEntry: EmailLogEntry = {
    ...entry,
    id: 'em-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    sentAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'Delivered',
  };

  try {
    const existing = getStoredEmailLogs();
    const updated = [newEntry, ...existing].slice(0, 50); // keep last 50
    localStorage.setItem(STORAGE_KEY_EMAIL_LOGS, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return newEntry;
}

/**
 * Modular Email Dispatcher:
 * Dispatches simulated email delivery and records audit trace.
 * Ready to integrate with backend Cloud Functions / Resend API endpoint.
 */
export async function sendCampusEmail(
  toEmail: string,
  recipientName: string,
  eventType: keyof typeof EMAIL_SUBJECTS,
  bodyDetails: { itemName: string; message: string; trackingId?: string }
): Promise<EmailLogEntry> {
  const subject = EMAIL_SUBJECTS[eventType] || 'Smart Campus Lost & Found Update';

  // In production, this can invoke: await fetch('/api/send-email', { method: 'POST', body: ... })
  const log = saveEmailLog({
    toEmail,
    recipientName,
    subject,
    eventType,
    preview: `Item: "${bodyDetails.itemName}" - ${bodyDetails.message}`,
  });

  return log;
}
