export interface User {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export interface Destination {
  id: number;
  name: string;
  state: string;
  description: string;
  tags: string;
  travelCostPerPerson: number;
  idealDurationDays: number;
  bestSeason: string;
  imageUrl: string;
  hotels?: Hotel[];
  activities?: Activity[];
}

export interface Hotel {
  id: number;
  destinationId: number;
  destinationName: string;
  name: string;
  description: string;
  pricePerNight: number;
  rating: number;
  amenities: string;
  address: string;
  imageUrl: string;
}

export interface Activity {
  id: number;
  destinationId: number;
  destinationName: string;
  name: string;
  description: string;
  costPerPerson: number;
  timeOfDay: string;
  category: string;
}

export interface WeatherForecast {
  destination: string;
  condition: string;
  temperatureCelsius: number;
  description: string;
  hasHeavyRain: boolean;
  detailedForecast: string;
}

export interface BudgetBreakdown {
  travelCost: number;
  hotelCost: number;
  foodCost: number;
  activitiesCost: number;
  miscCost: number;
  totalEstimatedCost: number;
  totalBudget: number;
  remainingBudget: number;
  costPerTraveller: number;
  withinBudget: boolean;
  overBudgetBy: number;
  verdictSummary: string;
}

export interface DayPlan {
  dayNumber: number;
  dayName: string;
  morning: string;
  afternoon: string;
  evening: string;
  estimatedDailyCost: number;
  notes: string;
}

export interface TripPlanResponse {
  tripId: number;
  title: string;
  originCity: string;
  destination: Destination;
  chosenHotel: Hotel;
  weather: WeatherForecast;
  travellers: number;
  nights: number;
  days: number;
  budget: BudgetBreakdown;
  aiExplanation: string;
  packingTip: string;
  isReplanned: boolean;
  replanNotes?: string;
  warnings: string[];
  daysPlan: DayPlan[];
  createdAt: string;
  isSaved: boolean;
}

export interface TripSummary {
  id: number;
  title: string;
  destinationName: string;
  originCity: string;
  totalBudget: number;
  estimatedTotalCost: number;
  withinBudget: boolean;
  travellers: number;
  days: number;
  nights: number;
  status: string;
  createdAt: string;
  hotelName: string;
  weatherSummary: string;
}

export interface PlanTripRequest {
  prompt?: string;
  fromCity?: string;
  destination?: string;
  budgetInRupees?: number;
  travellers?: number;
  days?: number;
  interests?: string;
  weatherPreference?: string;
  notes?: string;
}

export interface ReplanTripRequest {
  tripId: number;
  userChangeRequest: string;
  newTargetBudget?: number;
  preferredDestination?: string;
  maxHotelPricePerNight?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}
