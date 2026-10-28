export type ItemType = 'lost' | 'found';

export type ItemStatus = 
  | 'Reported' 
  | 'Searching' 
  | 'Possible Match' 
  | 'Claim Submitted' 
  | 'Under Verification' 
  | 'Approved' 
  | 'Returned' 
  | 'Rejected' 
  | 'Cancelled'
  | 'Active'
  | 'Pending Verification'
  | 'Claimed'
  | 'Resolved';

export interface StatusHistoryEntry {
  status: ItemStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export type Category = 
  | 'Mobile Phone' 
  | 'Electronics' 
  | 'ID Card & Wallets' 
  | 'Bags & Backpacks' 
  | 'Documents & Notes' 
  | 'Keys' 
  | 'Accessories' 
  | 'Clothing' 
  | 'Other';

export interface IDCardOCRData {
  name?: string;
  rollNumber?: string;
  studentId?: string;
  department?: string;
  year?: string;
  universityName?: string;
  isVerified?: boolean;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  category: Category;
  location: string;
  building?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  date: string;
  reportedBy: string;
  reportedByName?: string;
  reportedByEmail?: string;
  reporterRole?: string;
  reporterRoll?: string;
  description: string;
  images: string[];
  status: ItemStatus;
  statusHistory: StatusHistoryEntry[];
  aiTags?: string[];
  matchScore?: number;
  matchTier?: 'High Match' | 'Possible Match' | 'Low Match';
  aiAnalysis?: {
    imageSimilarity: number;
    textSimilarity: number;
    locationMatch: number;
    overallScore: number;
  };
  ocrData?: IDCardOCRData;
  createdAt?: string;
  updatedAt?: string;
}

export type ClaimStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'more_info_required'
  | 'Pending Verification' 
  | 'Approved' 
  | 'Rejected' 
  | 'More Information Required';

export interface Claim {
  id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  claimantId?: string;
  claimedBy: string;
  claimerRoll: string;
  claimerEmail?: string;
  claimerPhone?: string;
  claimDate: string;
  status: ClaimStatus;
  statusHistory?: StatusHistoryEntry[];
  reason: string;
  additionalDetails: string;
  proofs: string[];
  proofImages?: string[];
  adminComment?: string;
  adminNotes?: string;
  // Fraud & Suspicious Claim Detection
  riskScore: number; // 0 to 100
  riskLevel: 'low' | 'medium' | 'high' | 'suspicious';
  riskReasons: string[];
  aiRecommendation: string;
  aiMatchSummary?: {
    overallScore: number;
    imageSimilarity: number;
    textSimilarity: number;
    locationProximity: string;
    recommendation: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  uid?: string;
  name: string;
  rollNo: string;
  rollNumber?: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  role: 'Student' | 'Faculty' | 'Staff' | 'Admin';
  avatar: string;
  status?: 'active' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickButtons?: { label: string; action: string }[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 
    | 'ai_match' 
    | 'claim_submitted' 
    | 'claim_approved' 
    | 'claim_rejected' 
    | 'more_info' 
    | 'item_returned' 
    | 'new_report'
    | 'suspicious_claim';
  relatedItemId?: string;
  relatedClaimId?: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface EmailLogEntry {
  id: string;
  toEmail: string;
  recipientName: string;
  subject: string;
  preview: string;
  eventType: string;
  sentAt: string;
  status: 'Delivered' | 'Queued';
}

export interface NaturalLanguageInterpretation {
  rawQuery: string;
  detectedCategory?: Category;
  detectedLocation?: string;
  detectedType?: ItemType;
  detectedDateRange?: string;
  detectedColor?: string;
  keywords: string[];
  interpretedChips: { label: string; field: string; value: string }[];
}

export interface AnalyticsSummary {
  totalLost: number;
  totalFound: number;
  activeReports: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  returnedItems: number;
  aiMatches: number;
  registeredUsers: number;
  resolvedCases: number;
  locationStats: { location: string; count: number; percentage: number }[];
  categoryStats: { category: string; count: number; percentage: number }[];
  monthlyTrends: { month: string; lost: number; found: number; claims: number; returned: number }[];
}
