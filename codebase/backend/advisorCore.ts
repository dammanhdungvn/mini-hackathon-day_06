export type DemoCaseKey = 'happy' | 'error' | 'low_confidence' | 'custom';

export interface TripInfo {
  destination: string;
  budget: string;
  budgetVal: number;
  guests: number;
  travelStyle: string;
  preference: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface Hotel {
  id: string;
  name: string;
  matchPercent: number;
  stars: number;
  location: string;
  tags: string[];
  priceText: string;
  priceVal: number;
  whyFits: string;
  imgUrl: string;
  details?: string;
}

export interface RawHotel {
  id: string;
  name: string;
  area: string;
  price_tier: string;
  est_price_vnd: number;
  stars: number;
  usp: string;
  room_types: string[];
  amenities: string[];
  match_score?: number;
  matched_reasons?: string[];
}

export interface FetchMatchingHotelsArgs {
  travel_purpose: string;
  budget_tier: string;
  budget_val?: number;
  area: string;
  key_requirements: string[];
}

const UNCLEAR_VALUES = new Set([
  '',
  'chua ro',
  'chua nhap',
  'none',
  'null',
  'khong ro',
  'phu quoc',
  'phuquoc',
]);

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

export function stripPythonComments(source: string): string {
  let output = '';
  let quote: '"' | "'" | null = null;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      output += char;
      continue;
    }

    if (char === '#') {
      while (index < source.length && source[index] !== '\n') {
        index += 1;
      }
      if (index < source.length) output += '\n';
      continue;
    }

    output += char;
  }

  return output;
}

export function parseHotelDatabase(source: string): RawHotel[] {
  const assignmentIndex = source.indexOf('PHU_QUOC_HOTELS_DB');
  const listStart = source.indexOf('[', assignmentIndex);
  const listEnd = source.lastIndexOf(']');

  if (assignmentIndex < 0 || listStart < 0 || listEnd < listStart) {
    throw new Error('Cannot find PHU_QUOC_HOTELS_DB in data_hotel.py');
  }

  return JSON.parse(stripPythonComments(source.slice(listStart, listEnd + 1)));
}

export function normalize(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function containsAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => needle && haystack.includes(needle));
}

export function inferBudgetTierFromBudgetVal(budgetVal: number): string {
  const budgetVnd = budgetVal * 1000;
  if (budgetVnd <= 0) return 'Chưa rõ';
  if (budgetVnd >= 3_500_000) return 'Cao cấp';
  if (budgetVnd >= 1_500_000) return 'Tầm trung';
  return 'Tiết kiệm';
}

export function inferBudgetTier(trip: TripInfo): string {
  return inferBudgetTierFromBudgetVal(trip.budgetVal);
}

export function formatPrice(priceVnd: number): string {
  return `${(priceVnd / 1_000_000).toFixed(1)}M VND/đêm`.replace('.0', '');
}

export function fetchMatchingHotelsFromDb(
  hotelsDb: RawHotel[],
  args: FetchMatchingHotelsArgs,
): RawHotel[] {
  const normalizedBudget = normalize(args.budget_tier);
  const normalizedArea = normalize(args.area);
  const normalizedPurpose = normalize(args.travel_purpose);
  const normalizedRequirements = (args.key_requirements || []).map((item) => normalize(item));

  const matchedResults: RawHotel[] = [];

  for (const hotel of hotelsDb) {
    const hotelTier = normalize(hotel.price_tier);
    const hotelArea = normalize(hotel.area);

    if (args.budget_val && args.budget_val > 0) {
      // If budget_val is provided (e.g. from UI slider), filter out hotels strictly more expensive than budget
      if (hotel.est_price_vnd > args.budget_val) continue;
    } else {
      // Fallback for AI tool calls which only provide budget_tier string
      if (!UNCLEAR_VALUES.has(normalizedBudget) && hotelTier !== normalizedBudget) continue;
    }
    
    if (!UNCLEAR_VALUES.has(normalizedArea) && !hotelArea.includes(normalizedArea)) continue;

    const searchableText = normalize(
      [
        hotel.name,
        hotel.area,
        hotel.price_tier,
        hotel.usp,
        hotel.room_types.join(' '),
        hotel.amenities.join(' '),
      ].join(' '),
    );

    let score = 60;
    const reasons: string[] = [];

    if (!UNCLEAR_VALUES.has(normalizedBudget)) {
      score += 15;
      reasons.push(`Khớp phân khúc ${hotel.price_tier}`);
    }

    if (!UNCLEAR_VALUES.has(normalizedArea)) {
      score += 12;
      reasons.push(`Khớp khu vực ${hotel.area}`);
    }

    for (const requirement of normalizedRequirements) {
      if (requirement && searchableText.includes(requirement)) {
        score += 8;
        reasons.push(`Khớp yêu cầu: ${requirement}`);
      }
    }

    const purposeSignals: Record<string, string[]> = {
      'cap doi': ['lang man', 'hoang hon', 'spa', 'yen', 'rieng', 'villa'],
      honeymoon: ['lang man', 'hoang hon', 'spa', 'yen', 'rieng', 'villa'],
      'gia dinh': ['family', 'kids', 'tre em', 'villa', 'ho boi', 'grand world'],
      'ban be': ['bar', 'beach club', 'nightlife', 'show', 'casino', 'grand world'],
      'cong tac': ['co-working', 'hoi nghi', 'workspace', 'lam viec', 'meeting'],
      solo: ['eco', 'healing', 'hostel', 'bungalow', 'khong gian xanh'],
    };

    for (const [purpose, signals] of Object.entries(purposeSignals)) {
      if (normalizedPurpose.includes(purpose) && containsAny(searchableText, signals)) {
        score += 10;
        reasons.push(`Phù hợp mục đích chuyến đi: ${args.travel_purpose}`);
        break;
      }
    }

    matchedResults.push({
      ...hotel,
      match_score: Math.min(score, 99),
      matched_reasons: reasons,
    });
  }

  return matchedResults
    .sort((left, right) => {
      const scoreDiff = (right.match_score || 0) - (left.match_score || 0);
      if (scoreDiff !== 0) return scoreDiff;
      return left.est_price_vnd - right.est_price_vnd;
    });
}

export function buildToolArgsFromTrip(trip: TripInfo): FetchMatchingHotelsArgs {
  return {
    travel_purpose: trip.travelStyle || 'Chưa rõ',
    budget_tier: inferBudgetTier(trip),
    budget_val: trip.budgetVal * 1000,
    area: 'Chưa rõ',
    key_requirements: trip.preference ? [trip.preference] : [],
  };
}

function extractBudgetValFromText(text: string): number {
  const normalized = normalize(text).replace(/,/g, '.');
  const millionMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(m|trieu|tr)\b/);
  if (millionMatch) return Math.round(Number(millionMatch[1]) * 1000);

  const thousandMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(k|nghin|ngan)\b/);
  if (thousandMatch) return Math.round(Number(thousandMatch[1]));

  return 0;
}

export function buildToolArgsFromMessage(message: string, trip: TripInfo): FetchMatchingHotelsArgs {
  const combined = normalize(`${message} ${trip.travelStyle} ${trip.preference}`);
  const textBudgetVal = extractBudgetValFromText(message);
  let budgetTier = textBudgetVal > 0 ? inferBudgetTierFromBudgetVal(textBudgetVal) : inferBudgetTier(trip);

  if (combined.includes('5 sao') || combined.includes('sang trong') || combined.includes('cao cap')) {
    budgetTier = 'Cao cấp';
  } else if (combined.includes('gia tot') || combined.includes('re') || combined.includes('tiet kiem')) {
    budgetTier = 'Tiết kiệm';
  }

  let travelPurpose = trip.travelStyle || 'Chưa rõ';
  if (combined.includes('cap doi') || combined.includes('honeymoon') || combined.includes('vo chong')) {
    travelPurpose = 'Cặp đôi';
  } else if (combined.includes('gia dinh') || combined.includes('tre em') || combined.includes('kids')) {
    travelPurpose = 'Gia đình';
  } else if (combined.includes('ban be') || combined.includes('nhom')) {
    travelPurpose = 'Bạn bè';
  } else if (combined.includes('cong tac') || combined.includes('lam viec')) {
    travelPurpose = 'Công tác';
  } else if (combined.includes('solo') || combined.includes('mot minh') || combined.includes('healing')) {
    travelPurpose = 'Solo';
  }

  let area = 'Chưa rõ';
  const areaSignals: Array<[string, string]> = [
    ['bai truong', 'Bãi Trường'],
    ['long beach', 'Bãi Trường'],
    ['duong dong', 'Dương Đông'],
    ['trung tam', 'Dương Đông'],
    ['bai khem', 'Bãi Khem'],
    ['an thoi', 'An Thới'],
    ['sunset town', 'An Thới'],
    ['ganh dau', 'Gành Dầu'],
    ['bai dai', 'Bãi Dài'],
    ['grand world', 'Gành Dầu'],
  ];

  for (const [signal, mappedArea] of areaSignals) {
    if (combined.includes(signal)) {
      area = mappedArea;
      break;
    }
  }

  const keyRequirements = new Set<string>();
  if (trip.preference) keyRequirements.add(trip.preference);

  const requirementSignals: Array<[string, string]> = [
    ['bai bien', 'Bãi biển riêng'],
    ['sat bien', 'Sát bãi biển'],
    ['ho boi', 'Hồ bơi'],
    ['spa', 'Spa'],
    ['kids', 'Kids Club'],
    ['tre em', 'Kids Club'],
    ['bar', 'Bar'],
    ['nightlife', 'Nightlife'],
    ['casino', 'Casino'],
    ['pet', 'Pet-friendly'],
    ['thu cung', 'Pet-friendly'],
    ['villa', 'Villa'],
    ['healing', 'Không gian xanh'],
    ['yoga', 'Yoga'],
    ['co-working', 'Co-working'],
    ['lam viec', 'Co-working'],
  ];

  for (const [signal, requirement] of requirementSignals) {
    if (combined.includes(signal)) keyRequirements.add(requirement);
  }

  return {
    travel_purpose: travelPurpose,
    budget_tier: budgetTier,
    area,
    key_requirements: [...keyRequirements],
  };
}

export function fetchHotelsForTrip(hotelsDb: RawHotel[], trip: TripInfo): RawHotel[] {
  return fetchMatchingHotelsFromDb(hotelsDb, buildToolArgsFromTrip(trip));
}

export function mapHotelForUi(
  hotel: RawHotel,
  trip: TripInfo,
  hotelImages: Record<string, string>,
): Hotel {
  const priceVnd = Number(hotel.est_price_vnd || 0);
  const priceTier = hotel.price_tier || 'Tầm trung';
  const stars = hotel.stars || (priceTier === 'Cao cấp' ? 5 : priceTier === 'Tiết kiệm' ? 3 : 4);
  const priceText = formatPrice(priceVnd);
  const matchPercent = Number(hotel.match_score || 80);
  const budgetVnd = trip.budgetVal * 1000;
  const priceDiff = priceVnd - budgetVnd;

  let whyFits = `Phân khúc ${priceTier.toLowerCase()} tại ${hotel.area}.`;
  if (budgetVnd > 0 && priceDiff <= 0) {
    whyFits += ` Giá ${priceText} nằm trong ngân sách ${trip.budget}.`;
  } else if (budgetVnd > 0) {
    whyFits += ` Giá ${priceText} cao hơn ngân sách ${trip.budget}, nên phù hợp hơn nếu ưu tiên trải nghiệm.`;
  }

  return {
    id: hotel.id,
    name: hotel.name,
    matchPercent: Math.max(10, Math.min(99, matchPercent)),
    stars,
    location: `${hotel.area}, Phú Quốc, Việt Nam`,
    tags: [...hotel.amenities.slice(0, 2), priceTier],
    priceText,
    priceVal: priceVnd / 1000,
    whyFits,
    imgUrl: hotelImages[hotel.id] || DEFAULT_IMAGE,
    details: `${hotel.usp} Các loại phòng: ${hotel.room_types.join(', ')}.`,
  };
}

export function createTripAnalysis(trip: TripInfo): string {
  if (!trip.destination) {
    return 'Điểm đến đang trống. Hãy nhập điểm đến, ngân sách và sở thích để hệ thống lọc dữ liệu khách sạn phù hợp.';
  }

  const normalizedDestination = normalize(trip.destination);
  if (!normalizedDestination.includes('phu quoc')) {
    return `Dữ liệu demo hiện tập trung vào Phú Quốc. Bạn đã nhập ${trip.destination}, nên hệ thống có thể chưa có dữ liệu địa phương tương ứng.`;
  }

  return `Phân tích dữ liệu: tìm khách sạn tại ${trip.destination} theo ngân sách ${trip.budget}, phong cách ${trip.travelStyle || 'chưa rõ'} và sở thích ${trip.preference || 'chưa rõ'}.`;
}
