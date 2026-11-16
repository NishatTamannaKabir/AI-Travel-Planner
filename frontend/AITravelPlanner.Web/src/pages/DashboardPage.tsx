import React, { useEffect, useState } from 'react';
import {
  BookmarkCheck,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  IndianRupee,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  Loader2,
  Building,
  Check,
  Clock,
  Eye,
} from 'lucide-react';
import { TripSummary } from '../types/travel';
import { tripService } from '../services/tripService';
import { useAuth } from '../context/AuthContext';

interface DashboardPageProps {
  onSelectTrip: (tripId: number) => void;
  onNewTrip: () => void;
  openAuthModal?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectTrip, onNewTrip, openAuthModal }) => {
  const { user, isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const displayName = user?.fullName || 'Traveler';

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTrips();
    } else {
      setLoading(false);
      setTrips([]);
    }
  }, [isAuthenticated]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await tripService.getUserTrips();
      setTrips(data);
    } catch (err) {
      console.error('Failed to load trips', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this trip from your saved trips?')) return;

    setDeletingId(id);
    try {
      await tripService.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      showToast('Trip removed from saved trips.');
    } catch (err) {
      console.error('Failed to delete trip', err);
      showToast('Failed to remove trip. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const totalBudgetSpent = trips.reduce((acc, t) => acc + (t.estimatedTotalCost || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center mx-auto border border-[#BAEEDB] shadow-md shadow-[#0F9D72]/15">
          <BookmarkCheck className="w-8 h-8 text-[#0F9D72]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">Sign In to View Saved Trips</h2>
          <p className="text-sm text-[#667085] max-w-md mx-auto">
            Your saved itineraries, autonomous replans, and customized budgets are securely associated with your account in SQL Server.
          </p>
        </div>
        {openAuthModal && (
          <button
            onClick={openAuthModal}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#0F9D72] hover:bg-[#087A5A] shadow-md shadow-[#0F9D72]/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Sign In / Create Account
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#172033] via-[#087A5A] to-[#04382B] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0F9D72]/20 text-[#87E1C3] border border-[#0F9D72]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Travel Intelligence Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome, {displayName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Manage your AI-curated itineraries, inspect cost distributions, and test adaptive replanning.
          </p>
        </div>

        <button
          onClick={onNewTrip}
          className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#0F9D72] hover:bg-[#087A5A] shadow-lg shadow-[#0F9D72]/30 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto hover:scale-105 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Plan New Itinerary
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E4EAE7] shadow-xs">
          <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Saved Itineraries</span>
          <div className="text-3xl font-black text-[#172033] mt-1">{trips.length}</div>
          <span className="text-xs text-[#667085] mt-1 block">Synchronized in SQL Server</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E4EAE7] shadow-xs">
          <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Total Planned Budget</span>
          <div className="text-3xl font-black text-[#0F9D72] mt-1">₹{totalBudgetSpent.toLocaleString('en-IN')}</div>
          <span className="text-xs text-[#667085] mt-1 block">Across all active plans</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E4EAE7] shadow-xs">
          <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">AI Replanning Engine</span>
          <div className="text-3xl font-black text-[#14B8A6] mt-1">Active</div>
          <span className="text-xs text-[#667085] mt-1 block">Microsoft Agent Framework</span>
        </div>
      </div>

      {/* Saved Trips List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-[#172033] tracking-tight">Your Saved Vacation Plans</h3>
          <span className="text-xs font-semibold text-[#667085]">
            {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'} Available
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center text-[#667085] gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#0F9D72]" />
            <span className="text-sm font-medium">Loading saved trips from database...</span>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E4EAE7] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center mx-auto">
              <BookmarkCheck className="w-6 h-6 text-[#0F9D72]" />
            </div>
            <h4 className="text-lg font-bold text-[#172033]">No saved itineraries yet</h4>
            <p className="text-xs sm:text-sm text-[#667085] max-w-sm mx-auto">
              Generate a travel plan and click "Save Itinerary" to store it securely in your SQL Server database.
            </p>
            <button
              onClick={onNewTrip}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0F9D72] hover:bg-[#087A5A] transition-all shadow-xs cursor-pointer"
            >
              Start Planning Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => {
              const nights = trip.nights || Math.max(1, trip.days - 1);
              const savedDate = trip.createdAt
                ? new Date(trip.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recently';

              return (
                <div
                  key={trip.id}
                  onClick={() => onSelectTrip(trip.id)}
                  className="bg-white rounded-2xl border border-[#E4EAE7] p-6 shadow-xs hover:border-[#0F9D72] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Badge & Delete */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#DDF7EF] text-[#087A5A] border border-[#BAEEDB]">
                          Trip #{trip.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            trip.withinBudget
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {trip.withinBudget ? 'Within Budget' : 'Adjusted'}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleDelete(trip.id, e)}
                        disabled={deletingId === trip.id}
                        title="Delete trip from saved trips"
                        className="p-1.5 text-[#667085] hover:text-[#DC4B4B] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        {deletingId === trip.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#DC4B4B]" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-black text-[#172033] group-hover:text-[#0F9D72] transition-colors leading-snug line-clamp-1">
                      {trip.title || `${trip.originCity} to ${trip.destinationName}`}
                    </h4>

                    {/* Route & Key Trip Parameters */}
                    <div className="grid grid-cols-2 gap-2.5 text-xs text-[#667085] pt-1">
                      <div className="flex items-center gap-1.5 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#0F9D72] shrink-0" />
                        <span className="truncate">
                          {trip.originCity ? `${trip.originCity} → ${trip.destinationName}` : trip.destinationName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#0F9D72] shrink-0" />
                        <span>
                          {trip.days} Days / {nights} Nights
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#0F9D72] shrink-0" />
                        <span>
                          {trip.travellers} {trip.travellers === 1 ? 'Traveler' : 'Travelers'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-medium truncate">
                        <Building className="w-3.5 h-3.5 text-[#0F9D72] shrink-0" />
                        <span className="truncate" title={trip.hotelName || 'Curated Hotel'}>
                          {trip.hotelName || 'Curated Hotel'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Metadata Bottom Section */}
                  <div className="pt-4 border-t border-[#E4EAE7] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#667085] block text-[11px] font-medium">Allocated Budget</span>
                        <span className="font-bold text-[#172033] text-sm">
                          ₹{trip.totalBudget?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#667085] block text-[11px] font-medium">Estimated Total</span>
                        <span className="font-black text-[#087A5A] text-base">
                          ₹{trip.estimatedTotalCost?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#667085]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Saved on {savedDate}
                      </span>

                      <button
                        onClick={() => onSelectTrip(trip.id)}
                        className="inline-flex items-center gap-1.5 font-bold text-[#0F9D72] group-hover:text-[#087A5A] group-hover:translate-x-0.5 transition-all text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-[#E4EAE7] text-[#172033] shadow-xl shadow-slate-900/10 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center border border-[#BAEEDB] shrink-0">
            <Check className="w-4 h-4 text-[#0F9D72]" />
          </div>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
