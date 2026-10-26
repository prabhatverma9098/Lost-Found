export type ItemType = 'lost' | 'found';

export type ItemStatus = 'Active' | 'Pending Verification' | 'Claimed' | 'Returned' | 'Resolved';

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

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  category: Category;
  location: string;
  date: string;
  reportedBy: string;
  reporterRole?: string;
  reporterRoll?: string;
  description: string;
  images: string[];
  status: ItemStatus;
  aiTags?: string[];
  matchScore?: number;
  matchTier?: 'High Match' | 'Possible Match' | 'Low Match';
  aiAnalysis?: {
    imageSimilarity: number;
    textSimilarity: number;
    locationMatch: number;
    overallScore: number;
  };
}

export type ClaimStatus = 'Pending Verification' | 'Approved' | 'Rejected' | 'More Information Required';

export interface Claim {
  id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  claimedBy: string;
  claimerRoll: string;
  claimerEmail?: string;
  claimerPhone?: string;
  claimDate: string;
  status: ClaimStatus;
  reason: string;
  additionalDetails: string;
  proofs: string[];
  aiMatchSummary?: {
    overallScore: number;
    imageSimilarity: number;
    textSimilarity: number;
    locationProximity: string;
    recommendation: string;
  };
  adminNotes?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  role: 'Student' | 'Faculty' | 'Staff' | 'Admin';
  avatar: string;
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
