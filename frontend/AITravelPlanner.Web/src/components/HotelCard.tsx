import React from 'react';
import { Building2, Star, MapPin, CheckCircle2 } from 'lucide-react';
import { Hotel } from '../types/travel';

interface HotelCardProps {
  hotel: Hotel;
  nights: number;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, nights }) => {
  const amenitiesList = hotel.amenities
    ? hotel.amenities.split(',').map((a) => a.trim())
    : ['Free High-Speed WiFi', 'Climate Control / AC', 'Complimentary Breakfast Included'];

  const totalCost = hotel.pricePerNight * nights;

  return (
    <div className="hotel-card w-full max-w-full min-w-0 bg-white rounded-2xl border border-[#E4EAE7] p-5 sm:p-6 md:p-7 shadow-xs hover:shadow-md transition-all overflow-hidden break-words print:border print:border-slate-300 print:p-4 print:shadow-none print:break-inside-avoid">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap min-w-0">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#DDF7EF] text-[#087A5A] border border-[#BAEEDB] print:bg-emerald-50 print:border-emerald-200">
          <Building2 className="w-3.5 h-3.5 text-[#0F9D72]" />
          Recommended Stay
        </span>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs shrink-0">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{hotel.rating.toFixed(1)} / 5.0</span>
          <span className="text-amber-600/80 font-normal ml-0.5">• Guest Favorite</span>
        </div>
      </div>

      {/* Hotel Title & Location */}
      <div className="mt-3 min-w-0">
        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#172033] tracking-tight break-words">
          {hotel.name}
        </h3>
        <p className="text-xs sm:text-sm text-[#667085] flex items-center gap-1.5 mt-1.5 min-w-0">
          <MapPin className="w-4 h-4 text-[#0F9D72] shrink-0" />
          <span className="break-words">{hotel.address || `${hotel.destinationName}, India`}</span>
        </p>
      </div>

      {/* Dedicated Pricing Box - Fully Contained & Responsive */}
      <div className="hotel-pricing-box w-full max-w-full min-w-0 mt-4 p-4 sm:p-5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] overflow-hidden print:bg-slate-50 print:border-slate-200 print:p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start min-w-0 w-full print:grid-cols-2">
          {/* Nightly Base Rate */}
          <div className="min-w-0 w-full pb-3 md:pb-0 md:pr-4 border-b md:border-b-0 md:border-r border-[#E4EAE7] print:pb-0 print:border-b-0 print:border-r print:border-slate-200">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#667085] block mb-1">
              Base Nightly Rate
            </span>
            <div className="flex items-baseline gap-1 flex-wrap min-w-0">
              <span className="text-sm font-semibold text-[#667085]">₹</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
                {hotel.pricePerNight.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#667085] font-medium ml-1">/ night</span>
            </div>
            <span className="text-[11px] text-[#667085] block mt-1">Standard Room Rate</span>
          </div>

          {/* Total Duration Rate */}
          <div className="min-w-0 w-full md:pl-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#087A5A] block mb-1">
              Total Stay ({nights} {nights === 1 ? 'Night' : 'Nights'})
            </span>
            <div className="flex items-baseline gap-1 flex-wrap min-w-0">
              <span className="text-sm font-semibold text-[#087A5A]">₹</span>
              <span className="text-2xl sm:text-3xl font-black text-[#0F9D72] tracking-tight">
                {totalCost.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#087A5A] font-semibold ml-1">total</span>
            </div>
            <span className="text-[11px] text-[#667085] block mt-1">Taxes & fees included</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {hotel.description && (
        <p className="mt-3.5 text-xs sm:text-sm text-[#172033] leading-relaxed bg-[#F7FAF9]/60 p-3 sm:p-3.5 rounded-xl border border-[#E4EAE7]/70 break-words print:bg-transparent print:border-0 print:p-0 print:mt-2">
          {hotel.description}
        </p>
      )}

      {/* Amenities */}
      <div className="mt-4 print:mt-3">
        <span className="text-[11px] sm:text-xs font-bold text-[#667085] uppercase tracking-wider block mb-2">
          Curated Hotel Amenities
        </span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {amenitiesList.map((amenity, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#DDF7EF]/70 text-[#087A5A] border border-[#BAEEDB]/80 print:bg-emerald-50 print:border-emerald-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9D72] shrink-0" />
              <span>{amenity}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
