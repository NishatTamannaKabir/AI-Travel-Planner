import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  IndianRupee,
  Users,
  Calendar,
  CloudSun,
  Compass,
  ArrowRight,
  Info,
  Check,
} from 'lucide-react';
import { PlanTripRequest } from '../types/travel';

interface PlannerPageProps {
  initialPrompt?: string;
  initialDestination?: string;
  onPlanTrip: (request: PlanTripRequest) => Promise<void>;
  loading: boolean;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({
  initialPrompt = '',
  initialDestination = '',
  onPlanTrip,
  loading,
}) => {
  const [usePrompt, setUsePrompt] = useState(true);
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      'I want a 4 day trip from Kolkata for 2 people under ₹30,000. I like beaches and I don\'t want heavy rain.'
  );

  // Structured fields
  const [fromCity, setFromCity] = useState('Kolkata');
  const [destination, setDestination] = useState(initialDestination);
  const [budget, setBudget] = useState(30000);
  const [travellers, setTravellers] = useState(2);
  const [days, setDays] = useState(4);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['beach', 'food']);
  const [weatherPref, setWeatherPref] = useState('Avoid heavy rain');
  const [notes, setNotes] = useState('');

  const interestOptions = [
    { label: '🏖️ Beaches', value: 'beach' },
    { label: '🏔️ Hill Stations', value: 'hills' },
    { label: '🍵 Tea Gardens', value: 'tea' },
    { label: '🏛️ Heritage & Forts', value: 'heritage' },
    { label: '🚣 Adventure & Rafting', value: 'adventure' },
    { label: '🍛 Culinary & Seafood', value: 'food' },
    { label: '🧘 Spiritual & Yoga', value: 'spiritual' },
  ];

  const weatherOptions = [
    'Avoid heavy rain',
    'Sunny & clear skies',
    'Cool mountain breeze',
    'Moderate & pleasant',
  ];

  const toggleInterest = (val: string) => {
    setSelectedInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (usePrompt) {
      await onPlanTrip({ prompt });
    } else {
      await onPlanTrip({
        fromCity,
        destination: destination ? destination : undefined,
        budgetInRupees: budget,
        travellers,
        days,
        interests: selectedInterests.join(', '),
        weatherPreference: weatherPref,
        notes: notes || undefined,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DDF7EF] text-[#087A5A] border border-[#BAEEDB]">
          <Sparkles className="w-3.5 h-3.5 text-[#0F9D72]" />
          Autonomous Multi-Tool Agent
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#172033] tracking-tight">
          Configure Your Perfect Getaway
        </h2>
        <p className="text-xs sm:text-sm text-[#667085] max-w-lg mx-auto">
          Describe your dream trip in plain language or customize every constraint with precision controls.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center mb-8">
        <div className="p-1 bg-white rounded-2xl border border-[#E4EAE7] shadow-xs flex items-center gap-1">
          <button
            type="button"
            onClick={() => setUsePrompt(true)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              usePrompt
                ? 'bg-[#0F9D72] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Natural Language AI
          </button>
          <button
            type="button"
            onClick={() => setUsePrompt(false)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              !usePrompt
                ? 'bg-[#0F9D72] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            <Compass className="w-4 h-4" />
            Custom Precision Form
          </button>
        </div>
      </div>

      {/* Planning Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {usePrompt ? (
          /* Natural Language Interface */
          <div className="bg-white rounded-3xl border border-[#E4EAE7] p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#667085] uppercase tracking-wider block">
                Travel Prompt for AI Agent
              </label>
              <span className="text-[11px] text-[#087A5A] font-semibold flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Powered by Microsoft Agent Framework
              </span>
            </div>

            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Plan a 4 day trip to Darjeeling from Kolkata for 2 people under ₹30,000. I love tea gardens and cool mountain weather."
              className="w-full p-4 text-sm sm:text-base rounded-2xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] bg-[#F7FAF9]/60 leading-relaxed font-medium"
              required
            />

            {/* Quick Prompts */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#667085] block">Quick Sample Requests:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'I want a 4 day trip from Kolkata for 2 people under ₹30,000. I like beaches and I don\'t want heavy rain.',
                  'Plan a 3 day hill station getaway from Delhi under ₹25,000 with scenic tea gardens.',
                  'Adventure river rafting and mountain trip for 2 people under ₹20,000 from Delhi.',
                  'Heritage forts and cultural palaces trip to Jaipur for 3 days under ₹25,000.',
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sample)}
                    className="p-3 text-left rounded-xl bg-[#F7FAF9] hover:bg-[#DDF7EF]/60 hover:border-[#BAEEDB] border border-[#E4EAE7] text-[#667085] hover:text-[#087A5A] transition-all line-clamp-2"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Structured Form Interface */
          <div className="bg-white rounded-3xl border border-[#E4EAE7] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Origin City */}
              <div>
                <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-2">
                  Departure Origin City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-[#667085]" />
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="e.g. Kolkata, Delhi, Mumbai"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] bg-[#F7FAF9]/60"
                    required
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-2">
                  Specific Destination (Leave blank for AI pick)
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 absolute left-3.5 top-3.5 text-[#667085]" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Puri, Darjeeling, Goa, Jaipur"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] bg-[#F7FAF9]/60"
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-2">
                  Total Target Budget (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3.5 top-3.5 text-[#667085]" />
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    step={1000}
                    min={5000}
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] bg-[#F7FAF9]/60 font-bold"
                    required
                  />
                </div>
              </div>

              {/* Duration and Travelers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-2">
                    Days
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-[#667085]" />
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      min={1}
                      max={14}
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] bg-[#F7FAF9]/60 font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-2">
                    Travelers
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 absolute left-3.5 top-3.5 text-[#667085]" />
                    <input
                      type="number"
                      value={travellers}
                      onChange={(e) => setTravellers(Number(e.target.value))}
                      min={1}
                      max={10}
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] bg-[#F7FAF9]/60 font-bold"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Interests Checklist */}
            <div>
              <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-2.5">
                Travel Themes & Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((opt) => {
                  const isChecked = selectedInterests.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleInterest(opt.value)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-[#DDF7EF] text-[#087A5A] border-[#BAEEDB] shadow-xs'
                          : 'bg-[#F7FAF9] text-[#667085] border-[#E4EAE7] hover:border-slate-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#0F9D72]" />}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weather Preference */}
            <div>
              <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-2.5">
                Climate & Weather Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {weatherOptions.map((w) => {
                  const isSelected = weatherPref === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWeatherPref(w)}
                      className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                        isSelected
                          ? 'bg-[#DDF7EF] text-[#087A5A] border-[#BAEEDB] shadow-xs'
                          : 'bg-[#F7FAF9] text-[#667085] border-[#E4EAE7] hover:border-slate-300'
                      }`}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white bg-[#0F9D72] hover:bg-[#087A5A] shadow-lg shadow-[#0F9D72]/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Autonomous Itinerary</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
};
