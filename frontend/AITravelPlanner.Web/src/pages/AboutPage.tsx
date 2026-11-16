import React from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  RefreshCw,
  Layers,
  Cpu,
  CheckCircle2,
  FileCheck,
  Server,
  Brain,
  Shield,
  Code2,
  Check,
  ArrowDown,
  CloudSun,
  Hotel,
  IndianRupee,
  Calendar,
  Users,
} from 'lucide-react';
import { NavTab } from '../components/Navbar';

interface AboutPageProps {
  onNavigate?: (tab: NavTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16 text-[#172033]">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#DDF7EF] text-[#087A5A] border border-[#BAEEDB]">
          <Sparkles className="w-3.5 h-3.5 text-[#0F9D72]" />
          <span>AI Travel Planning Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight leading-[1.15]">
          Travel Planning, <br className="hidden sm:inline" />
          <span className="text-[#0F9D72]">Reimagined with AI</span>
        </h1>

        <p className="text-base sm:text-lg text-[#667085] leading-relaxed max-w-2xl mx-auto">
          AI Travel Planner turns natural-language travel ideas into personalized, budget-aware itineraries that can adapt when your plans change.
        </p>
      </section>

      {/* 2. PRODUCT STORY: WHAT IS AI TRAVEL PLANNER? */}
      <section className="bg-white rounded-2xl border border-[#E4EAE7] p-8 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">
            Product Vision
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            What is AI Travel Planner?
          </h2>
        </div>

        <p className="text-sm sm:text-base text-[#172033] leading-relaxed">
          AI Travel Planner is a full-stack intelligent travel planning application designed to turn natural-language travel requests into practical, personalized itineraries.
        </p>

        <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
          Instead of treating travel planning as separate disconnected searches, the system dynamically considers:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] text-center space-y-1">
            <span className="text-xs font-bold text-[#172033] block">Destinations</span>
            <span className="text-[11px] text-[#667085]">Vibe & preferences</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] text-center space-y-1">
            <span className="text-xs font-bold text-[#172033] block">Duration & Dates</span>
            <span className="text-[11px] text-[#667085]">Days & nights</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] text-center space-y-1">
            <span className="text-xs font-bold text-[#172033] block">Travelers</span>
            <span className="text-[11px] text-[#667085]">Group headcount</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] text-center space-y-1">
            <span className="text-xs font-bold text-[#172033] block">Budget Ceiling</span>
            <span className="text-[11px] text-[#667085]">Target & buffers</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] text-center space-y-1">
            <span className="text-xs font-bold text-[#172033] block">Live Weather</span>
            <span className="text-[11px] text-[#667085]">Rainfall & season</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] text-center space-y-1">
            <span className="text-xs font-bold text-[#172033] block">Accommodation</span>
            <span className="text-[11px] text-[#667085]">Verified hotels</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] text-center space-y-1 col-span-2 sm:col-span-2">
            <span className="text-xs font-bold text-[#172033] block">Daily Activities</span>
            <span className="text-[11px] text-[#667085]">Morning, afternoon & evening excursions</span>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM */}
      <section className="bg-white rounded-2xl border border-[#E4EAE7] p-8 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">
            Why It Matters
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            The Problem
          </h2>
        </div>

        <p className="text-sm sm:text-base text-[#172033] leading-relaxed">
          Traditional travel planning often requires switching between multiple sources for:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] font-semibold text-xs text-[#172033]">
            Destinations
          </div>
          <div className="p-3 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] font-semibold text-xs text-[#172033]">
            Weather
          </div>
          <div className="p-3 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] font-semibold text-xs text-[#172033]">
            Hotels
          </div>
          <div className="p-3 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] font-semibold text-xs text-[#172033]">
            Activities
          </div>
          <div className="p-3 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] font-semibold text-xs text-[#172033] col-span-2 sm:col-span-1">
            Costs & Budgets
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#DDF7EF] border border-[#BAEEDB] text-xs sm:text-sm text-[#087A5A] font-medium leading-relaxed">
          AI Travel Planner brings these considerations together into a single planning experience.
        </div>
      </section>

      {/* 4. WHAT MAKES IT INTELLIGENT? (4-STEP PROCESS) */}
      <section className="space-y-8">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">
            Agentic Reasoning
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            What Makes It Intelligent?
          </h2>
          <p className="text-xs sm:text-sm text-[#667085]">
            A structured decision loop combining natural language understanding with discrete tool calling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4EAE7] shadow-xs space-y-3">
            <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider block">Phase 1</span>
            <h3 className="text-lg font-bold text-[#172033]">Understand</h3>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Understands the travel request, extracting origin, destination, budget, group size, and travel style.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4EAE7] shadow-xs space-y-3">
            <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider block">Phase 2</span>
            <h3 className="text-lg font-bold text-[#172033]">Evaluate</h3>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Evaluates destination, weather, hotel and budget constraints concurrently through specialized tools.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4EAE7] shadow-xs space-y-3">
            <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider block">Phase 3</span>
            <h3 className="text-lg font-bold text-[#172033]">Plan</h3>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Creates the itinerary with morning-to-evening schedules, accurate transit costs, and hotel nights.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4EAE7] shadow-xs space-y-3">
            <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider block">Phase 4</span>
            <h3 className="text-lg font-bold text-[#172033]">Adapt</h3>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Replans when the user's constraints change, automatically restoring feasibility.
            </p>
          </div>
        </div>
      </section>

      {/* 5. AUTONOMOUS REPLANNING: THE PLAN ISN'T FIXED */}
      <section className="bg-[#172033] text-white rounded-2xl p-8 sm:p-10 shadow-lg space-y-8">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold text-[#BAEEDB] uppercase tracking-wider block">
            Core Differentiator
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            The Plan Isn't Fixed.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            When a trip no longer fits the user's constraints, the system can reconsider the plan instead of simply returning an error.
          </p>
        </div>

        {/* Distinctive Cascade Flow */}
        <div className="space-y-3 max-w-xl mx-auto pt-2">
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-center">
            <span className="text-xs font-bold text-red-300">Budget Conflict</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Estimated total exceeds stated budget ceiling</p>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-center">
            <span className="text-xs font-bold text-white">Accommodation Optimization</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Selects vetted lower-cost stays in the same destination</p>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-center">
            <span className="text-xs font-bold text-white">Alternative Destination</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Evaluates sibling destinations with lower transit costs</p>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-center">
            <span className="text-xs font-bold text-white">Activity / Duration Optimization</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Calibrates paid excursions and schedule distribution</p>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
            <span className="text-xs font-bold text-emerald-300">Updated Itinerary</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Mathematically verified and ready for travel</p>
          </div>
        </div>
      </section>

      {/* 6. TECHNOLOGY: BUILT WITH (4 COMPACT GROUPS) */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">
            Technology Stack
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Built With
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Backend */}
          <div className="bg-white rounded-2xl p-5 border border-[#E4EAE7] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F9D72]">
              <Server className="w-4 h-4" />
              <h3 className="font-bold text-sm text-[#172033]">Backend</h3>
            </div>
            <ul className="text-xs text-[#667085] space-y-1.5 font-medium">
              <li>.NET 10</li>
              <li>ASP.NET Core Web API</li>
              <li>C# 13</li>
              <li>Entity Framework Core</li>
            </ul>
          </div>

          {/* AI */}
          <div className="bg-white rounded-2xl p-5 border border-[#E4EAE7] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F9D72]">
              <Brain className="w-4 h-4" />
              <h3 className="font-bold text-sm text-[#172033]">AI</h3>
            </div>
            <ul className="text-xs text-[#667085] space-y-1.5 font-medium">
              <li>Microsoft Agent Framework</li>
              <li>Ollama</li>
              <li>Llama 3.2</li>
            </ul>
          </div>

          {/* Frontend */}
          <div className="bg-white rounded-2xl p-5 border border-[#E4EAE7] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F9D72]">
              <Code2 className="w-4 h-4" />
              <h3 className="font-bold text-sm text-[#172033]">Frontend</h3>
            </div>
            <ul className="text-xs text-[#667085] space-y-1.5 font-medium">
              <li>React</li>
              <li>TypeScript</li>
              <li>Vite</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>

          {/* Data & Security */}
          <div className="bg-white rounded-2xl p-5 border border-[#E4EAE7] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F9D72]">
              <Shield className="w-4 h-4" />
              <h3 className="font-bold text-sm text-[#172033]">Data & Security</h3>
            </div>
            <ul className="text-xs text-[#667085] space-y-1.5 font-medium">
              <li>SQL Server</li>
              <li>JWT Authentication</li>
              <li>BCrypt</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7. ARCHITECTURE FLOW */}
      <section className="bg-white rounded-2xl border border-[#E4EAE7] p-8 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-1 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">
            System Topology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[#667085]">
            Layered application design coupled with local AI orchestration.
          </p>
        </div>

        {/* Visual Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Web & Application Pipeline */}
          <div className="p-5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] space-y-3">
            <h4 className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">Application Pipeline</h4>
            <div className="space-y-2 text-xs font-medium text-[#172033]">
              <div className="p-2.5 rounded-lg bg-white border border-[#E4EAE7] text-center">React Frontend</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2.5 rounded-lg bg-white border border-[#E4EAE7] text-center">ASP.NET Core API</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2.5 rounded-lg bg-white border border-[#E4EAE7] text-center">Application / Agent Layer</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2.5 rounded-lg bg-white border border-[#E4EAE7] text-center">Infrastructure</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2.5 rounded-lg bg-[#DDF7EF] border border-[#BAEEDB] text-center text-[#087A5A] font-bold">SQL Server</div>
            </div>
          </div>

          {/* AI Reasoning Pipeline */}
          <div className="p-5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">AI Reasoning Pipeline</h4>
              <div className="space-y-2 text-xs font-medium text-[#172033]">
                <div className="p-2.5 rounded-lg bg-white border border-[#E4EAE7] text-center">Agent Framework</div>
                <div className="text-center text-slate-400">↓</div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E4EAE7] text-center">Ollama</div>
                <div className="text-center text-slate-400">↓</div>
                <div className="p-2.5 rounded-lg bg-[#DDF7EF] border border-[#BAEEDB] text-center text-[#087A5A] font-bold">Llama 3.2</div>
              </div>
            </div>

            <p className="text-[11px] text-[#667085] leading-relaxed pt-3 border-t border-[#E4EAE7]">
              The agent runs entirely on localhost with zero external cloud dependencies or API subscriptions.
            </p>
          </div>
        </div>
      </section>

      {/* 8. QUALITY: BUILT FOR RELIABILITY */}
      <section className="bg-white rounded-2xl border border-[#E4EAE7] p-8 sm:p-10 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">
              Verification & Testing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              Built for Reliability
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#DDF7EF] border border-[#BAEEDB] text-[#087A5A] font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#0F9D72]" />
            <span>20 xUnit Tests · 100% Passing</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
          The test suite verifies critical business rules across:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] text-xs font-semibold text-[#172033] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#0F9D72] shrink-0" />
            <span>Trip planning logic</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] text-xs font-semibold text-[#172033] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#0F9D72] shrink-0" />
            <span>Autonomous replanning</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] text-xs font-semibold text-[#172033] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#0F9D72] shrink-0" />
            <span>Budget calculations</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] text-xs font-semibold text-[#172033] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#0F9D72] shrink-0" />
            <span>Weather-related logic</span>
          </div>
        </div>
      </section>

      {/* 9. AUTHOR PROFILE */}
      <section className="bg-white rounded-2xl border border-[#E4EAE7] p-8 sm:p-10 shadow-xs space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#087A5A] to-[#0F9D72] text-white flex items-center justify-center font-black text-lg shadow-sm">
            NT
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#172033]">
              Built by Nishat Tamanna Kabir
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#087A5A]">
              Software Engineer · .NET & AI Developer
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
          A full-stack AI project combining modern .NET engineering, React development and local AI to explore practical agentic travel planning.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate?.('planner')}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0F9D72] hover:bg-[#087A5A] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Launch AI Planner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate?.('destinations')}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#172033] bg-[#F7FAF9] hover:bg-[#E4EAE7]/60 border border-[#E4EAE7] transition-all cursor-pointer"
          >
            Browse Catalog
          </button>
        </div>
      </section>
    </div>
  );
};
