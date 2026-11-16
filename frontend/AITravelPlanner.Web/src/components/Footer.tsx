import React from 'react';
import { Compass, Sparkles, MapPin, BookmarkCheck, Info } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onNavigate?: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#172033] text-[#A0AEC0] border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* LEFT: Brand & Description (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#087A5A] to-[#0F9D72] flex items-center justify-center text-white font-bold shadow-md shadow-[#0F9D72]/20">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">AI Travel Planner</span>
                <p className="text-xs text-[#14B8A6] font-medium">AI-Powered Travel Intelligence</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
              AI-powered itinerary planning with intelligent budget optimization and autonomous replanning.
            </p>
          </div>

          {/* CENTER: Explore (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate?.('planner')}
                  className="hover:text-[#14B8A6] transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0F9D72]" /> Plan Trip
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('destinations')}
                  className="hover:text-[#14B8A6] transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#0F9D72]" /> Destinations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('dashboard')}
                  className="hover:text-[#14B8A6] transition-colors flex items-center gap-1.5"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#0F9D72]" /> My Saved Trips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('about')}
                  className="hover:text-[#14B8A6] transition-colors flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-[#0F9D72]" /> About
                </button>
              </li>
            </ul>
          </div>

          {/* RIGHT: Technology (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Technology</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D72]" />
                <span>.NET 10 (ASP.NET Core Web API)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D72]" />
                <span>Microsoft Agent Framework</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D72]" />
                <span>Ollama / Llama 3.2</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D72]" />
                <span>React + TypeScript</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM: Single Author Attribution */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2026 AI Travel Planner · Built by Nishat Tamanna Kabir</p>
          <p className="text-[11px] text-slate-500">Autonomous Travel Intelligence Platform</p>
        </div>
      </div>
    </footer>
  );
};
