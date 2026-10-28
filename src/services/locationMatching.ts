export interface CampusLocationMeta {
  name: string;
  building: string;
  area: string;
  lat: number;
  lng: number;
}

export const campusLocationDirectory: Record<string, CampusLocationMeta> = {
  'Central Library': {
    name: 'Central Library',
    building: 'Academic Block A',
    area: 'North Campus Quad',
    lat: 24.5854,
    lng: 80.8322,
  },
  'Computer Block': {
    name: 'Computer Block',
    building: 'Engineering Wing',
    area: 'Tech Complex',
    lat: 24.5861,
    lng: 80.8335,
  },
  'Academic Block (Rooms 101-404)': {
    name: 'Academic Block (Rooms 101-404)',
    building: 'Main Academic Wing',
    area: 'Central Quad',
    lat: 24.5858,
    lng: 80.8328,
  },
  'Main Canteen & Food Court': {
    name: 'Main Canteen & Food Court',
    building: 'Student Amenities Hub',
    area: 'Central Plaza',
    lat: 24.5849,
    lng: 80.8318,
  },
  'Auditorium & Seminar Hall': {
    name: 'Auditorium & Seminar Hall',
    building: 'Cultural Complex',
    area: 'South Campus',
    lat: 24.5842,
    lng: 80.8325,
  },
  'Sports Complex & Gym': {
    name: 'Sports Complex & Gym',
    building: 'Athletics Ground',
    area: 'East Fields',
    lat: 24.5868,
    lng: 80.8348,
  },
  'Administrative Block': {
    name: 'Administrative Block',
    building: 'Central Admin Room 104',
    area: 'Main Gate Complex',
    lat: 24.5838,
    lng: 80.8312,
  },
  'Central Parking Area': {
    name: 'Central Parking Area',
    building: 'Parking Lot B',
    area: 'West Boundary',
    lat: 24.5835,
    lng: 80.8305,
  },
  'Hostel Block A & B': {
    name: 'Hostel Block A & B',
    building: 'Student Residential Quad',
    area: 'North-East Residential',
    lat: 24.5875,
    lng: 80.8355,
  },
};

/**
 * Calculates location proximity score (0 - 100%) between two spots.
 * Same spot = 95-100%
 * Same building = 85-92%
 * Adjacent campus quad = 70-80%
 * Opposite ends of campus = 40-55%
 */
export function calculateLocationMatch(
  loc1: string,
  loc2: string,
  building1?: string,
  building2?: string
): number {
  if (!loc1 || !loc2) return 60;

  const l1 = loc1.toLowerCase().trim();
  const l2 = loc2.toLowerCase().trim();

  // Exact location string match
  if (l1 === l2) return 96;

  // Partial substring match (e.g. "Library 2nd floor" vs "Central Library")
  if (l1.includes(l2) || l2.includes(l1)) return 92;

  // Building match
  const meta1 = campusLocationDirectory[loc1];
  const meta2 = campusLocationDirectory[loc2];

  const b1 = (building1 || meta1?.building || '').toLowerCase();
  const b2 = (building2 || meta2?.building || '').toLowerCase();

  if (b1 && b2 && (b1 === b2 || b1.includes(b2) || b2.includes(b1))) {
    return 88;
  }

  // Geographic distance calculation if coordinates exist
  if (meta1 && meta2) {
    const dLat = meta1.lat - meta2.lat;
    const dLng = meta1.lng - meta2.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng) * 111000; // in meters approx
    if (dist < 100) return 90;
    if (dist < 250) return 80;
    if (dist < 500) return 65;
    return 48;
  }

  // Keyword check
  const words1 = l1.split(/\s+/);
  const common = words1.filter(w => w.length > 3 && l2.includes(w));
  if (common.length > 0) return 75;

  return 55;
}

/**
 * Calculates composite AI match score from Image, Text, and Location similarities
 */
export function calculateOverallMatchScore(
  imageSimilarity: number,
  textSimilarity: number,
  locationSimilarity: number
): { overallScore: number; tier: 'High Match' | 'Possible Match' | 'Low Match' } {
  // Weighted blend: 40% Image, 35% Text, 25% Location
  const composite = Math.round(
    imageSimilarity * 0.40 +
    textSimilarity * 0.35 +
    locationSimilarity * 0.25
  );

  const bounded = Math.min(99, Math.max(25, composite));

  let tier: 'High Match' | 'Possible Match' | 'Low Match' = 'Low Match';
  if (bounded >= 80) tier = 'High Match';
  else if (bounded >= 65) tier = 'Possible Match';

  return { overallScore: bounded, tier };
}
