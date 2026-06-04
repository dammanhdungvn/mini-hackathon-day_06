export interface TripInfo {
  destination: string;
  budget: string;
  budgetVal: number; // raw value in thousands VND, e.g., 2000 for 2.0M VND
  guests: number;
  travelStyle: string;
  preference: string;
}

export interface Hotel {
  id: string;
  name: string;
  matchPercent: number;
  stars: number;
  location: string;
  tags: string[];
  priceText: string;
  priceVal: number; // raw value in thousands VND
  whyFits: string;
  imgUrl: string;
  details?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export type ViewMode = 'user' | 'admin';

export type DemoCase = 'happy' | 'error' | 'low_confidence' | 'custom';
