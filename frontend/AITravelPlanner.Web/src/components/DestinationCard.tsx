import React from 'react';
import { MapPin, Calendar, Tag, Sparkles } from 'lucide-react';
import { Destination } from '../types/travel';

interface DestinationCardProps {
  destination: Destination;
  onSelect?: (destName: string) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onSelect }) => {
  const tagsList = destination.tags
    ? destination.tags.split(',').map((t) => t.trim())
    : ['scenic', 'nature'];

  return (
    <div className="destination-card w-full max-w-full min-w-0 bg-white rounded-2xl border border-[#E4EAE7] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group print:border print:border-slate-300 print:shadow-none print:break-inside-avoid">
      {/* Destination Image / Hero Header */}
      <div className="destination-image-container relative h-48 w-full overflow-hidden bg-slate-900 print:h-44 print:bg-slate-800">
        <img
          src={destination.imageUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80'}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 print:opacity-100 print:object-cover"
          crossOrigin="anonymous"
          loading="eager"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/95 via-[#172033]/40 to-transparent print:bg-[#172033]/70" />
        <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between text-white min-w-0">
          <div className="min-w-0 pr-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#87E1C3] flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{destination.state}</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight truncate drop-shadow-sm">{destination.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-200 uppercase tracking-wide block">Transit / Pax</span>
            <span className="text-sm font-extrabold text-[#BAEEDB]">
              ₹{destination.travelCostPerPerson.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 min-w-0">
        <p className="text-xs sm:text-sm text-[#667085] line-clamp-2 leading-relaxed break-words print:line-clamp-none print:text-[#172033]">
          {destination.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tagsList.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#F7FAF9] text-[#667085] border border-[#E4EAE7] print:bg-slate-50 print:border-slate-200"
            >
              <Tag className="w-2.5 h-2.5 text-[#0F9D72]" />
              {tag}
            </span>
          ))}
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-[#E4EAE7] flex items-center justify-between text-xs print:border-slate-200">
          <span className="text-[#667085] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#0F9D72]" />
            Best: <strong className="text-[#172033]">{destination.bestSeason || 'Year-round'}</strong>
          </span>

          {onSelect && (
            <button
              onClick={() => onSelect(destination.name)}
              className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0F9D72] hover:bg-[#087A5A] shadow-xs transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-3 h-3" />
              Plan Here
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
