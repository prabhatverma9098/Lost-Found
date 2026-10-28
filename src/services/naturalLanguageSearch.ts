import { Category, ItemType, NaturalLanguageInterpretation } from '../types';

interface QueryMapping {
  keywords: string[];
  category?: Category;
  location?: string;
  type?: ItemType;
  color?: string;
  dateRange?: string;
}

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  'Mobile Phone': ['phone', 'mobile', 'iphone', 'samsung', 'oneplus', 'smartphone', 'cell'],
  'Bags & Backpacks': ['bag', 'backpack', 'pithu', 'basta', 'rucksack', 'laptop bag'],
  'ID Card & Wallets': ['id', 'id card', 'identity', 'card', 'wallet', 'purse', 'batua'],
  'Electronics': ['laptop', 'airpods', 'earbuds', 'calculator', 'charger', 'casio', 'headphones'],
  'Keys': ['key', 'keys', 'chabi', 'chabhi', 'keychain', 'lanyard'],
  'Accessories': ['watch', 'smartwatch', 'glasses', 'chashma', 'ring', 'belt', 'bracelet'],
  'Clothing': ['jacket', 'hoodie', 'sweater', 'cap', 'shirt', 'scarf'],
  'Documents & Notes': ['book', 'notes', 'notebook', 'register', 'file', 'assignment'],
  'Other': ['bottle', 'water bottle', 'umbrella', 'chhatri', 'flask'],
};

const LOCATION_KEYWORDS: Record<string, string[]> = {
  'Central Library': ['library', 'reading room', 'kitab ghar'],
  'Computer Block': ['computer', 'computer block', 'lab', 'cs lab', 'coding lab'],
  'Academic Block (Rooms 101-404)': ['academic', 'room', 'classroom', 'lecture hall'],
  'Main Canteen & Food Court': ['canteen', 'food court', 'cafeteria', 'mess'],
  'Auditorium & Seminar Hall': ['auditorium', 'audi', 'seminar', 'hall'],
  'Sports Complex & Gym': ['sports', 'gym', 'ground', 'badminton', 'cricket', 'court'],
  'Administrative Block': ['admin', 'admin block', 'office', 'room 104'],
  'Central Parking Area': ['parking', 'stand', 'bike parking', 'gate'],
  'Hostel Block A & B': ['hostel', 'room hostel'],
};

const COLOR_KEYWORDS: Record<string, string[]> = {
  Black: ['black', 'kala', 'dark'],
  Blue: ['blue', 'neela', 'navy'],
  Silver: ['silver', 'metallic', 'grey', 'gray'],
  White: ['white', 'safed'],
  Red: ['red', 'lal'],
  Gold: ['gold', 'golden', 'yellow', 'peela'],
};

export function parseNaturalLanguageQuery(query: string): NaturalLanguageInterpretation {
  const rawQuery = query.trim();
  const lower = rawQuery.toLowerCase();
  const interpretedChips: { label: string; field: string; value: string }[] = [];

  let detectedCategory: Category | undefined = undefined;
  let detectedLocation: string | undefined = undefined;
  let detectedType: ItemType | undefined = undefined;
  let detectedDateRange: string | undefined = undefined;
  let detectedColor: string | undefined = undefined;

  // 1. Detect Type (Lost vs Found) in English & Hindi / Hinglish
  if (
    lower.includes('found') || 
    lower.includes('mila') || 
    lower.includes('mili') || 
    lower.includes('mil gya') || 
    lower.includes('recovered')
  ) {
    detectedType = 'found';
    interpretedChips.push({ label: 'Type: Found', field: 'type', value: 'found' });
  } else if (
    lower.includes('lost') || 
    lower.includes('kho gaya') || 
    lower.includes('khoya') || 
    lower.includes('gum') || 
    lower.includes('missing')
  ) {
    detectedType = 'lost';
    interpretedChips.push({ label: 'Type: Lost', field: 'type', value: 'lost' });
  }

  // 2. Detect Category
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (words.some(w => lower.includes(w))) {
      detectedCategory = cat as Category;
      interpretedChips.push({ label: `Category: ${cat}`, field: 'category', value: cat });
      break;
    }
  }

  // 3. Detect Location
  for (const [loc, words] of Object.entries(LOCATION_KEYWORDS)) {
    if (words.some(w => lower.includes(w))) {
      detectedLocation = loc;
      interpretedChips.push({ label: `Location: ${loc}`, field: 'location', value: loc });
      break;
    }
  }

  // 4. Detect Color
  for (const [col, words] of Object.entries(COLOR_KEYWORDS)) {
    if (words.some(w => lower.includes(w))) {
      detectedColor = col;
      interpretedChips.push({ label: `Color: ${col}`, field: 'color', value: col });
      break;
    }
  }

  // 5. Detect Date Range
  if (lower.includes('last 7 days') || lower.includes('7 din') || lower.includes('pichle hafte') || lower.includes('this week')) {
    detectedDateRange = 'This Week';
    interpretedChips.push({ label: 'Time: Last 7 Days', field: 'dateRange', value: 'This Week' });
  } else if (lower.includes('today') || lower.includes('aaj')) {
    detectedDateRange = 'Today';
    interpretedChips.push({ label: 'Time: Today', field: 'dateRange', value: 'Today' });
  } else if (lower.includes('this month') || lower.includes('mahina')) {
    detectedDateRange = 'This Month';
    interpretedChips.push({ label: 'Time: This Month', field: 'dateRange', value: 'This Month' });
  }

  // Tokenize other remaining keywords
  const stopWords = new Set([
    'mera', 'meri', 'mere', 'ke', 'ka', 'ki', 'paas', 'tha', 'thi', 'the',
    'uske', 'similar', 'items', 'dikhao', 'show', 'me', 'in', 'the', 'near',
    'is', 'are', 'find', 'looking', 'for', 'a', 'an', 'and', 'with'
  ]);

  const words = lower.split(/[\s,?.!]+/).filter(w => w.length > 2 && !stopWords.has(w));

  return {
    rawQuery,
    detectedCategory,
    detectedLocation,
    detectedType,
    detectedDateRange,
    detectedColor,
    keywords: words,
    interpretedChips,
  };
}
