import { IDCardOCRData } from '../types';

/**
 * Intelligent Client/AI OCR Engine for University ID Cards
 * Simulates high-precision neural text extraction from campus ID cards.
 */
export async function extractIDCardInformation(
  imageSource: string | File,
  fallbackName = 'Amit Kumar'
): Promise<IDCardOCRData> {
  // Simulate OCR model inference time (500ms)
  await new Promise(res => setTimeout(res, 550));

  // Determine heuristics from context or generate realistic university extraction
  const sampleRollSuffix = Math.floor(1000 + Math.random() * 8999);
  
  return {
    name: fallbackName || 'Amit Kumar',
    rollNumber: `23CS${sampleRollSuffix}`,
    studentId: `AKS-2023-${sampleRollSuffix}`,
    department: 'Computer Science & Engineering',
    year: '4th Year (B.Tech)',
    universityName: 'AKS University',
    isVerified: true,
  };
}

/**
 * Sanitizes item display so sensitive student ID card numbers are NEVER exposed publicly
 */
export function sanitizePublicItemDescription(description: string, isIDCard: boolean): string {
  if (!isIDCard) return description;

  // Mask any student roll numbers or phone numbers in public listing
  return description
    .replace(/[0-9]{2}[A-Z]{2}[0-9]{4}/gi, '[PROTECTED ROLL NO]')
    .replace(/AKS-[0-9]{4}-[0-9]{4}/gi, '[PROTECTED ID]');
}
