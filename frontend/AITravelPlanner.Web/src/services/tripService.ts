import api from './api';
import {
  ApiResponse,
  PlanTripRequest,
  ReplanTripRequest,
  TripPlanResponse,
  TripSummary,
} from '../types/travel';

export const tripService = {
  async planTrip(request: PlanTripRequest): Promise<TripPlanResponse> {
    const res = await api.post<ApiResponse<TripPlanResponse>>('/trips/plan', request);
    return res.data.data;
  },

  async replanTrip(request: ReplanTripRequest): Promise<TripPlanResponse> {
    const res = await api.post<ApiResponse<TripPlanResponse>>('/trips/replan', request);
    return res.data.data;
  },

  async saveTrip(tripId: number): Promise<TripPlanResponse> {
    const res = await api.post<ApiResponse<TripPlanResponse>>(`/trips/${tripId}/save`);
    return res.data.data;
  },

  async getUserTrips(): Promise<TripSummary[]> {
    const res = await api.get<ApiResponse<TripSummary[]>>('/trips');
    return res.data.data;
  },

  async getTripById(id: number): Promise<TripPlanResponse> {
    const res = await api.get<ApiResponse<TripPlanResponse>>(`/trips/${id}`);
    return res.data.data;
  },

  async deleteTrip(id: number): Promise<boolean> {
    const res = await api.delete<ApiResponse<boolean>>(`/trips/${id}`);
    return res.data.data;
  },
};
