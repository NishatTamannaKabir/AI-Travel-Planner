import React, { useState } from 'react';
import { Sunrise, Sun, Sunset, Calendar, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { DayPlan } from '../types/travel';

interface ItineraryTimelineProps {
  daysPlan: DayPlan[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ daysPlan }) => {
  // All days expanded by default so both screen and print have full itinerary
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    daysPlan.forEach((d) => {
      init[d.dayNumber] = true;
    });
    return init;
  });

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const toggleAll = (expand: boolean) => {
    const next: Record<number, boolean> = {};
    daysPlan.forEach((d) => {
      next[d.dayNumber] = expand;
    });
    setExpandedDays(next);
  };

  const isAllExpanded = daysPlan.every((d) => expandedDays[d.dayNumber]);

  return (
    <div className="itinerary-timeline space-y-3.5 w-full min-w-0">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 print:mb-2">
        <div>
          <span className="text-xs font-bold text-[#667085] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#0F9D72]" />
            Curated Experience Schedule
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#172033] mt-0.5">
            Day-by-Day Itinerary
          </h3>
        </div>
        <button
          onClick={() => toggleAll(!isAllExpanded)}
          className="no-print text-xs font-bold text-[#087A5A] hover:text-[#066349] bg-[#DDF7EF] px-3.5 py-1.5 rounded-xl border border-[#BAEEDB] transition-colors"
        >
          {isAllExpanded ? 'Collapse All Days' : 'Expand All Days'}
        </button>
      </div>

      {/* Days List */}
      <div className="space-y-3.5 print:space-y-3">
        {daysPlan.map((day) => {
          const isExpanded = !!expandedDays[day.dayNumber];

          return (
            <div
              key={day.dayNumber}
              className={`itinerary-day-card w-full max-w-full min-w-0 bg-white rounded-2xl border transition-all duration-200 overflow-hidden break-words print:border print:border-slate-300 print:shadow-none print:break-inside-avoid ${
                isExpanded ? 'border-[#0F9D72]/40 shadow-xs' : 'border-[#E4EAE7] hover:border-slate-300'
              }`}
            >
              {/* Day Header */}
              <div
                onClick={() => toggleDay(day.dayNumber)}
                className="p-3.5 sm:p-4 md:p-5 flex items-center justify-between cursor-pointer select-none bg-[#F7FAF9]/80 hover:bg-[#F7FAF9] transition-colors print:bg-slate-50 print:p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#087A5A] to-[#0F9D72] text-white font-extrabold flex items-center justify-center text-xs sm:text-sm shadow-xs shrink-0 print:bg-[#0F9D72]">
                    D{day.dayNumber}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-[#172033] text-sm sm:text-base md:text-lg truncate">
                      {day.dayName}
                    </h4>
                    <p className="text-xs text-[#667085] truncate">{day.notes || 'Full day itinerary'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block print:block">
                    <span className="text-[10px] text-[#667085] uppercase tracking-wide block">Daily Est.</span>
                    <span className="text-xs font-bold text-[#172033] flex items-center justify-end">
                      <span className="text-xs text-[#667085] mr-0.5">₹</span>
                      {day.estimatedDailyCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="no-print p-1 rounded-lg text-[#667085] hover:text-[#172033]">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#0F9D72]" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Day Details (Always rendered and visible in print) */}
              <div
                className={`p-4 sm:p-5 pt-2 sm:pt-3 border-t border-[#E4EAE7] space-y-3.5 print:border-slate-200 print:p-3 print:block ${
                  isExpanded ? 'block' : 'hidden print:block'
                }`}
              >
                {/* Morning */}
                <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 print:bg-amber-50/40 print:border-amber-200/50 print:p-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sunrise className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                      Morning Experience
                    </span>
                    <p className="text-xs sm:text-sm text-[#172033] leading-relaxed font-medium break-words">
                      {day.morning}
                    </p>
                  </div>
                </div>

                {/* Afternoon */}
                <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 print:bg-blue-50/40 print:border-blue-200/50 print:p-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-800 block mb-0.5">
                      Afternoon Exploration
                    </span>
                    <p className="text-xs sm:text-sm text-[#172033] leading-relaxed font-medium break-words">
                      {day.afternoon}
                    </p>
                  </div>
                </div>

                {/* Evening */}
                <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/70 print:bg-purple-50/40 print:border-purple-200/50 print:p-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sunset className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-800 block mb-0.5">
                      Evening Leisure & Dining
                    </span>
                    <p className="text-xs sm:text-sm text-[#172033] leading-relaxed font-medium break-words">
                      {day.evening}
                    </p>
                  </div>
                </div>

                {/* Local Tip */}
                {day.notes && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#DDF7EF]/50 text-xs text-[#087A5A] border border-[#BAEEDB]/70 print:bg-emerald-50/50 print:border-emerald-200/50">
                    <Sparkles className="w-3.5 h-3.5 text-[#0F9D72] shrink-0" />
                    <span className="break-words"><strong>AI Insider Tip:</strong> {day.notes}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
