import { Claim, Item } from '../types';

export interface FraudAnalysisResult {
  riskScore: number; // 0 to 100
  riskLevel: 'low' | 'medium' | 'high' | 'suspicious';
  riskReasons: string[];
  aiRecommendation: string;
}

/**
 * Analyzes signals to compute a claim risk score and transparent reasons
 */
export function analyzeClaimRisk(
  newClaim: {
    itemId: string;
    itemName: string;
    reason: string;
    additionalDetails: string;
    proofs: string[];
    claimedBy: string;
    claimerRoll: string;
  },
  targetItem: Item | undefined,
  existingClaims: Claim[]
): FraudAnalysisResult {
  let riskScore = 12; // baseline low risk
  const riskReasons: string[] = [];

  // Signal 1: Repeated claims by same claimant in short duration
  const claimsBySameUser = existingClaims.filter(
    c => c.claimerRoll === newClaim.claimerRoll || c.claimedBy.toLowerCase() === newClaim.claimedBy.toLowerCase()
  );
  if (claimsBySameUser.length >= 3) {
    riskScore += 35;
    riskReasons.push(`Same user submitted ${claimsBySameUser.length + 1} claims across different campus categories.`);
  } else if (claimsBySameUser.length === 2) {
    riskScore += 18;
    riskReasons.push(`Claimant has multiple active claims (${claimsBySameUser.length}) pending in verification queue.`);
  }

  // Signal 2: Multiple concurrent claimants for the exact same item
  const otherClaimsForSameItem = existingClaims.filter(
    c => c.itemId === newClaim.itemId && c.claimerRoll !== newClaim.claimerRoll
  );
  if (otherClaimsForSameItem.length > 0) {
    riskScore += 24;
    riskReasons.push(`Multiple conflicting claims (${otherClaimsForSameItem.length + 1} students) submitted for this item.`);
  }

  // Signal 3: Brief, generic, or low-similarity reason
  const reasonText = (newClaim.reason + ' ' + (newClaim.additionalDetails || '')).toLowerCase();
  const wordCount = reasonText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 8) {
    riskScore += 20;
    riskReasons.push('Claim description is under 8 words and lacks distinctive physical identifier marks.');
  }

  // Signal 4: Comparison with item's true attributes
  if (targetItem) {
    const itemWords = targetItem.description.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const hasOverlap = itemWords.some(w => reasonText.includes(w));
    if (!hasOverlap && itemWords.length > 3) {
      riskScore += 18;
      riskReasons.push('Claim description has low keyword similarity to item features cataloged by finder.');
    }
  }

  // Signal 5: Proof of ownership presence
  if (!newClaim.proofs || newClaim.proofs.length === 0) {
    riskScore += 14;
    riskReasons.push('No purchase invoice, box screenshot, or visual ownership proof attached.');
  }

  // Bound score
  riskScore = Math.min(96, Math.max(8, riskScore));

  let riskLevel: 'low' | 'medium' | 'high' | 'suspicious' = 'low';
  let aiRecommendation = 'Standard claim. Normal verification recommended.';

  if (riskScore >= 70) {
    riskLevel = 'suspicious';
    aiRecommendation = 'Request additional verification. Require physical student ID and purchase invoice at Proctorial Office.';
  } else if (riskScore >= 45) {
    riskLevel = 'medium';
    aiRecommendation = 'Moderate risk score. Verify claimant matches student ID record and inspect device serial number.';
  } else {
    riskLevel = 'low';
    aiRecommendation = 'Low risk profile. Stated identifiers and ownership indicators appear authentic.';
    if (riskReasons.length === 0) {
      riskReasons.push('First claim by student; description aligns with campus recovery record.');
    }
  }

  return {
    riskScore,
    riskLevel,
    riskReasons,
    aiRecommendation,
  };
}
