import api from './api';
import { ApiResponse, Destination, Hotel } from '../types/travel';

export const destinationService = {
  async getAllDestinations(interest?: string): Promise<Destination[]> {
    const params = interest ? { interest } : {};
    const res = await api.get<ApiResponse<Destination[]>>('/destinations', { params });
    return res.data.data;
  },

  async getDestinationById(id: number): Promise<Destination> {
    const res = await api.get<ApiResponse<Destination>>(`/destinations/${id}`);
    return res.data.data;
  },

  async getHotelsByDestination(destination: string, maxPrice?: number): Promise<Hotel[]> {
    const params = maxPrice ? { maxPrice } : {};
    const res = await api.get<ApiResponse<Hotel[]>>(`/hotels/destination/${encodeURIComponent(destination)}`, { params });
    return res.data.data;
  },
};
