import React, { useState } from 'react';
import { Search, Tag, MapPin, Sparkles } from 'lucide-react';
import { Destination } from '../types/travel';
import { DestinationCard } from '../components/DestinationCard';

interface DestinationsPageProps {
  destinations: Destination[];
  onSelectDestination: (destName: string) => void;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({
  destinations,
  onSelectDestination,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filterTags = ['all', 'beach', 'hills', 'tea', 'heritage', 'adventure', 'food', 'spiritual'];

  const filtered = destinations.filter((d) => {
    const matchesTag =
      selectedTag === 'all' || d.tags.toLowerCase().includes(selectedTag);
    const matchesSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.state.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">
          Curated Travel Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#172033] tracking-tight">
          Explore Curated Destinations
        </h1>
        <p className="text-xs sm:text-sm text-[#667085]">
          From the sunny coastlines of Puri to misty high-altitude tea valleys in Darjeeling.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E4EAE7] shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#667085]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city, state, vibe..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] bg-[#F7FAF9]/60"
          />
        </div>

        {/* Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedTag === tag
                  ? 'bg-[#0F9D72] text-white shadow-xs'
                  : 'bg-[#F7FAF9] text-[#667085] hover:bg-[#E4EAE7]/60 border border-[#E4EAE7]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dest) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            onSelect={onSelectDestination}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E4EAE7] text-[#667085] space-y-2">
          <p className="font-bold text-base text-[#172033]">No destinations match your criteria.</p>
          <p className="text-xs">Try selecting 'all' or searching for a different keyword.</p>
        </div>
      )}
    </div>
  );
};
