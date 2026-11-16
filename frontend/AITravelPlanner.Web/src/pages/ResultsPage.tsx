import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookmarkCheck,
  RefreshCw,
  RotateCcw,
  Printer,
  Luggage,
  AlertTriangle,
  MapPin,
  Users,
  Compass,
  Share2,
  Check,
} from 'lucide-react';
import { TripPlanResponse } from '../types/travel';
import { WeatherWidget } from '../components/WeatherWidget';
import { BudgetCard } from '../components/BudgetCard';
import { HotelCard } from '../components/HotelCard';
import { DestinationCard } from '../components/DestinationCard';
import { ItineraryTimeline } from '../components/ItineraryTimeline';
import { ReplanModal } from '../components/ReplanModal';
import { ShareModal } from '../components/ShareModal';

interface ResultsPageProps {
  plan: TripPlanResponse;
  onSaveTrip: (tripId: number) => Promise<void>;
  onReplanTrip: (req: any) => Promise<void>;
  onStartOver: () => void;
  isAuthenticated: boolean;
  openAuthModal: () => void;
}

// Calculate the minimum feasible budget for the current trip configuration
export const calculateMinFeasibleBudget = (plan: TripPlanResponse): number => {
  const travellers = plan.travellers || 1;
  const nights = plan.nights || 1;
  const days = plan.days || (nights + 1);
  const rooms = Math.ceil(travellers / 2);
  const travelCostPerPerson = plan.destination?.travelCostPerPerson ?? 1500;
  const travelCost = travelCostPerPerson * travellers;

  let minHotelPrice = plan.chosenHotel?.pricePerNight ?? 1000;
  if (plan.destination?.hotels && plan.destination.hotels.length > 0) {
    minHotelPrice = Math.min(...plan.destination.hotels.map((h) => h.pricePerNight));
  }
  const hotelCost = minHotelPrice * nights * rooms;
  const foodAndActivities = 800 * travellers * days;

  return Math.round(travelCost + hotelCost + foodAndActivities);
};

// Generate a complete formatted summary of the current trip for sharing across apps and clipboard
export const generateShareSummary = (plan: TripPlanResponse): string => {
  const daysFormatted = (plan.daysPlan || [])
    .map((d) => {
      const activities = [d.morning, d.afternoon, d.evening].filter(Boolean).join(' • ');
      return `Day ${d.dayNumber}: ${d.dayName}${activities ? `\n  (${activities})` : ''}`;
    })
    .join('\n');

  const perPersonCost = plan.budget?.costPerTraveller ?? (plan.travellers ? plan.budget.totalEstimatedCost / plan.travellers : plan.budget.totalEstimatedCost);
  const formattedPerPerson = perPersonCost % 1 === 0
    ? `₹${perPersonCost.toLocaleString('en-IN')}`
    : `₹${perPersonCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return `AI Travel Planner ✈️

${plan.originCity} → ${plan.destination.name}
${plan.days} Days / ${plan.nights} Nights
${plan.travellers} ${plan.travellers === 1 ? 'Traveller' : 'Travellers'}

Budget: ₹${plan.budget.totalBudget.toLocaleString('en-IN')}
Estimated Total: ₹${plan.budget.totalEstimatedCost.toLocaleString('en-IN')}
Per Person: ${formattedPerPerson}

Hotel: ${plan.chosenHotel?.name || 'Curated Accommodation'}

${daysFormatted}

Weather: ${plan.weather?.condition ? `${plan.weather.condition}${plan.weather.temperatureCelsius ? ` (${plan.weather.temperatureCelsius}°C)` : ''}` : 'Pleasant'}
${plan.aiExplanation ? `AI Tip: ${plan.aiExplanation}\n` : ''}${plan.packingTip ? `Packing Tip: ${plan.packingTip}\n` : ''}
Created with AI Travel Planner`;
};

export const ResultsPage: React.FC<ResultsPageProps> = ({
  plan,
  onSaveTrip,
  onReplanTrip,
  onStartOver,
  isAuthenticated,
  openAuthModal,
}) => {
  const [isReplanOpen, setIsReplanOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(plan.isSaved);
  const [shareToast, setShareToast] = useState<string | null>(null);

  useEffect(() => {
    setSaveSuccess(plan.isSaved);
  }, [plan.isSaved, plan.tripId]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to save your itinerary.');
      openAuthModal();
      return;
    }
    setSaving(true);
    try {
      await onSaveTrip(plan.tripId);
      setSaveSuccess(true);
      showToast('Trip saved successfully.');
    } catch (err) {
      showToast('Failed to save trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const showToast = (message: string) => {
    setShareToast(message);
    setTimeout(() => {
      setShareToast(null);
    }, 3000);
  };

  return (
    <div className="print-page max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10 animate-fade-in print:py-0 print:px-0 print:space-y-4 print:max-w-full print:m-0">
      {/* Formal Printable Document Header (Visible ONLY in print) */}
      <div className="hidden print:block pb-3 mb-3 border-b-2 border-[#0F9D72]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-[#172033] tracking-tight">AI Travel Planner</span>
            <p className="text-xs text-[#087A5A] font-semibold">AI-Powered Travel Intelligence</p>
          </div>
          <div className="text-right text-xs text-[#667085]">
            <p className="font-bold text-[#172033]">Document Ref: #ATP-{plan.tripId}</p>
            <p>{plan.travellers} {plan.travellers === 1 ? 'Traveler' : 'Travelers'} • {plan.days} Days / {plan.nights} Nights</p>
          </div>
        </div>
      </div>

      {/* Screen Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E4EAE7] print:pb-3 print:border-slate-200">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#DDF7EF] text-[#087A5A] border border-[#BAEEDB] print:bg-emerald-50 print:border-emerald-200">
              Trip #{plan.tripId} • {plan.days} Days / {plan.nights} Nights
            </span>
            {plan.isReplanned && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5 print:bg-purple-100">
                <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse text-purple-600 print:hidden" />
                Autonomous AI Replanned
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#172033] tracking-tight break-words">
            {plan.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#667085] font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0F9D72] shrink-0" />
              Origin: <strong className="text-[#172033]">{plan.originCity}</strong> → Destination: <strong className="text-[#172033]">{plan.destination.name}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#0F9D72] shrink-0" />
              <strong className="text-[#172033]">{plan.travellers}</strong> {plan.travellers === 1 ? 'Traveler' : 'Travelers'}
            </span>
          </div>
        </div>

        {/* Action Buttons (Strictly Excluded from Print) */}
        <div className="no-print flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleSave}
            disabled={saving || saveSuccess}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all ${
              saveSuccess
                ? 'bg-[#DDF7EF] text-[#087A5A] border border-[#BAEEDB]'
                : 'bg-[#0F9D72] hover:bg-[#087A5A] text-white shadow-[#0F9D72]/20 hover:scale-[1.02]'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            {saveSuccess ? 'Saved to Dashboard' : saving ? 'Saving...' : 'Save Itinerary'}
          </button>

          <button
            onClick={() => setIsReplanOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-[#F7FAF9] text-[#172033] border border-[#E4EAE7] shadow-xs flex items-center gap-2 transition-all hover:border-slate-300"
          >
            <RefreshCw className="w-4 h-4 text-[#0F9D72]" />
            Replan / Modify
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-[#F7FAF9] text-[#172033] border border-[#E4EAE7] shadow-xs flex items-center gap-2 transition-all hover:border-slate-300 cursor-pointer"
            title="Share Trip Plan"
          >
            <Share2 className="w-4 h-4 text-[#0F9D72]" />
            Share Plan
          </button>

          <button
            onClick={handlePrint}
            title="Print or Save PDF"
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F7FAF9] text-[#172033] border border-[#E4EAE7] shadow-xs flex items-center gap-2 text-xs sm:text-sm font-bold transition-all hover:border-slate-300"
          >
            <Printer className="w-4 h-4 text-[#667085]" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>

          <button
            onClick={onStartOver}
            className="p-2.5 rounded-xl bg-white hover:bg-[#F7FAF9] text-[#667085] hover:text-[#172033] border border-[#E4EAE7] shadow-xs transition-all"
            title="Start Over"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Autonomous Replanning Report Banner */}
      {plan.isReplanned && plan.replanNotes && (
        <div className="replan-report-card p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50/90 via-[#DDF7EF]/40 to-white border border-purple-200 text-purple-950 shadow-xs space-y-1.5 print:bg-purple-50/50 print:border-purple-200 print:shadow-none print:break-inside-avoid">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-purple-800">
            <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse text-purple-600 print:hidden" />
            Autonomous AI Budget Re-Optimization Report
          </div>
          <p className="text-xs sm:text-sm text-[#172033] leading-relaxed font-medium break-words">
            {plan.replanNotes}
          </p>
        </div>
      )}

      {/* Operational Warnings */}
      {plan.warnings && plan.warnings.length > 0 && (
        <div className="warning-banner p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 print:border-amber-300 print:break-inside-avoid">
          {plan.warnings.map((w, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="break-words">{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* AI Consultant Rationale Quote */}
      <div className="ai-rationale-card p-5 sm:p-6 rounded-2xl bg-white border border-[#E4EAE7] border-l-4 border-l-[#0F9D72] shadow-xs space-y-2 print:border print:border-slate-300 print:border-l-4 print:border-l-[#0F9D72] print:p-4 print:shadow-none print:break-inside-avoid">
        <div className="flex items-center gap-2 text-xs font-bold text-[#087A5A] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#0F9D72]" />
          AI Travel Consultant Rationale
        </div>
        <p className="text-xs sm:text-sm md:text-base text-[#172033] leading-relaxed font-medium italic break-words">
          "{plan.aiExplanation}"
        </p>
      </div>

      {/* Section 1: Destination Overview & Live Weather */}
      <div className="space-y-3.5 print:space-y-2.5">
        <div className="flex items-center gap-2 break-after-avoid">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D72]" />
          <h2 className="text-lg sm:text-xl font-black text-[#172033] tracking-tight">
            Destination & Climate Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch print:grid-cols-2 print:gap-3.5">
          <DestinationCard destination={plan.destination} />
          <div className="flex flex-col justify-between space-y-4 print:space-y-3">
            <WeatherWidget weather={plan.weather} />
            <div className="trip-summary-card p-4 sm:p-5 rounded-2xl bg-white border border-[#E4EAE7] shadow-xs flex-1 flex flex-col justify-center space-y-2 print:border print:border-slate-300 print:p-3 print:shadow-none print:break-inside-avoid">
              <span className="text-xs font-bold text-[#667085] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0F9D72]" />
                Trip Configuration Summary
              </span>
              <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] print:bg-slate-50 print:border-slate-200">
                  <span className="text-[#667085] block text-[11px]">Duration</span>
                  <span className="font-bold text-[#172033]">{plan.days} Days / {plan.nights} Nights</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] print:bg-slate-50 print:border-slate-200">
                  <span className="text-[#667085] block text-[11px]">Group Size</span>
                  <span className="font-bold text-[#172033]">{plan.travellers} {plan.travellers === 1 ? 'Traveler' : 'Travelers'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] print:bg-slate-50 print:border-slate-200">
                  <span className="text-[#667085] block text-[11px]">Origin Hub</span>
                  <span className="font-bold text-[#172033]">{plan.originCity}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] print:bg-slate-50 print:border-slate-200">
                  <span className="text-[#667085] block text-[11px]">Best Season</span>
                  <span className="font-bold text-[#087A5A]">{plan.destination.bestSeason || 'Year-round'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Selected Accommodation */}
      <div className="space-y-3.5 print:space-y-2.5">
        <div className="flex items-center gap-2 break-after-avoid">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D72]" />
          <h2 className="text-lg sm:text-xl font-black text-[#172033] tracking-tight">
            Curated Accommodation
          </h2>
        </div>
        <HotelCard hotel={plan.chosenHotel} nights={plan.nights} />
      </div>

      {/* Section 3: Schedule & Finances Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start print:grid-cols-1 print:gap-4">
        {/* Detailed Day-by-Day Itinerary (2 cols on desktop, naturally paginated in print) */}
        <div className="lg:col-span-2 space-y-5 print:space-y-3">
          <ItineraryTimeline daysPlan={plan.daysPlan} />
        </div>

        {/* Financial Breakdown & Packing Advice (1 col on desktop, flows naturally in print) */}
        <div className="space-y-5 print:space-y-3">
          {/* Financial Breakdown Card */}
          <BudgetCard budget={plan.budget} travellers={plan.travellers} />

          {/* Packing Advice Card */}
          <div className="packing-card bg-white rounded-2xl border border-[#E4EAE7] p-5 sm:p-6 shadow-xs space-y-2.5 print:border print:border-slate-300 print:p-4 print:shadow-none print:break-inside-avoid">
            <div className="flex items-center gap-2 text-xs font-bold text-[#667085] uppercase tracking-wider">
              <Luggage className="w-4 h-4 text-[#0F9D72]" />
              Weather-Tailored Packing Advice
            </div>
            <h4 className="text-base font-extrabold text-[#172033]">Recommended Essentials</h4>
            <p className="text-xs sm:text-sm text-[#172033] leading-relaxed bg-[#F7FAF9] p-3.5 rounded-xl border border-[#E4EAE7] break-words print:bg-slate-50 print:border-slate-200">
              {plan.packingTip}
            </p>
          </div>
        </div>
      </div>

      {/* Formal Printable Document Footer (Visible ONLY in print) */}
      <div className="hidden print:block pt-4 mt-6 border-t border-slate-300 text-center text-xs text-slate-500">
        <p>Generated by <strong>AI Travel Planner</strong> · Built by <strong>Nishat Tamanna Kabir</strong></p>
        <p className="text-[10px] text-slate-400 mt-0.5">Autonomous Travel Intelligence Platform • All financial figures calculated in Indian Rupees (INR)</p>
      </div>

      {/* Replan Modal Component */}
      <ReplanModal
        isOpen={isReplanOpen}
        onClose={() => setIsReplanOpen(false)}
        tripId={plan.tripId}
        currentBudget={plan.budget.totalBudget}
        currentDestination={plan.destination.name}
        minimumFeasibleBudget={calculateMinFeasibleBudget(plan)}
        onReplan={onReplanTrip}
      />

      {/* Share Modal Component */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        plan={plan}
        onToast={showToast}
      />

      {/* Floating Toast Notification (Hidden in Print) */}
      {shareToast && (
        <div className="no-print fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-[#E4EAE7] text-[#172033] shadow-xl shadow-slate-900/10 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center border border-[#BAEEDB] shrink-0">
            <Check className="w-4 h-4 text-[#0F9D72]" />
          </div>
          <span className="text-sm font-bold">{shareToast}</span>
        </div>
      )}
    </div>
  );
};
