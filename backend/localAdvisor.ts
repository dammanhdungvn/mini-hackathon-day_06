import dataHotelRaw from '../data_hotel.py?raw';
import demoCasesRaw from './demo_cases.json?raw';
import hotelImagesRaw from './hotel_images.json?raw';

import {
  createTripAnalysis,
  fetchHotelsForTrip,
  mapHotelForUi,
  parseHotelDatabase,
  type DemoCaseKey,
  type Hotel,
  type Message,
  type RawHotel,
  type TripInfo,
} from './advisorCore';

interface DemoCaseValue {
  trip: TripInfo;
  analysis: string;
  messages: Message[];
}

export type { DemoCaseKey, Hotel, Message, RawHotel, TripInfo };

const HOTEL_IMAGES: Record<string, string> = JSON.parse(hotelImagesRaw);

export const DEMO_CASES: Record<Exclude<DemoCaseKey, 'custom'>, DemoCaseValue> =
  JSON.parse(demoCasesRaw);

export const PHU_QUOC_HOTELS_DB = parseHotelDatabase(dataHotelRaw);

export { createTripAnalysis };

export function getMatchedHotelsForTrip(trip: TripInfo): Hotel[] {
  if (!trip.destination) return [];

  const hotels = fetchHotelsForTrip(PHU_QUOC_HOTELS_DB, trip);
  const fallbackHotels = hotels.length > 0 ? hotels : PHU_QUOC_HOTELS_DB.slice(0, 3);
  return fallbackHotels.map((hotel) => mapHotelForUi(hotel, trip, HOTEL_IMAGES));
}
