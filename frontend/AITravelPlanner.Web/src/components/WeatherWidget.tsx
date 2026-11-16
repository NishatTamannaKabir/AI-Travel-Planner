import React from 'react';
import { Sun, CloudRain, Cloud, AlertTriangle, Thermometer } from 'lucide-react';
import { WeatherForecast } from '../types/travel';

interface WeatherWidgetProps {
  weather: WeatherForecast;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  const isRainy = weather.hasHeavyRain || weather.condition.toLowerCase().includes('rain');

  return (
    <div className="weather-card w-full max-w-full min-w-0 bg-white rounded-2xl border border-[#E4EAE7] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all overflow-hidden break-words print:border print:border-slate-300 print:p-4 print:shadow-none print:break-inside-avoid">
      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
        <span className="text-xs font-bold text-[#667085] uppercase tracking-wider flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-[#0F9D72]" />
          Live Weather Forecast
        </span>
        {weather.hasHeavyRain ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 print:bg-amber-100">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Heavy Rain Warning
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#DDF7EF] text-[#087A5A] border border-[#BAEEDB] print:bg-emerald-50 print:border-emerald-200">
            Ideal Conditions
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
          isRainy ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-500'
        }`}>
          {isRainy ? (
            <CloudRain className="w-7 h-7 sm:w-8 sm:h-8" />
          ) : weather.condition.toLowerCase().includes('cloud') ? (
            <Cloud className="w-7 h-7 sm:w-8 sm:h-8 text-slate-500" />
          ) : (
            <Sun className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black text-[#172033]">{weather.temperatureCelsius}°C</span>
            <span className="text-xs sm:text-sm font-semibold text-[#667085]">{weather.condition}</span>
          </div>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 leading-relaxed break-words">{weather.detailedForecast}</p>
        </div>
      </div>
    </div>
  );
};
