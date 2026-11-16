import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  MapPin,
  CloudSun,
  IndianRupee,
  RefreshCw,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building2,
  Map,
  SlidersHorizontal,
} from 'lucide-react';
import { Destination } from '../types/travel';

interface LandingPageProps {
  onStartPlanning: (initialPrompt?: string) => void;
  destinations: Destination[];
  onSelectDestination: (destName: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  destinations,
  onSelectDestination,
}) => {
  const [promptText, setPromptText] = useState(
    'Plan a 4-day beach trip from Kolkata for 2 people under ₹30,000...'
  );

  const quickPrompts = [
    {
      label: 'Goa · Beach Escape',
      prompt: 'Plan a 4-day beach trip from Kolkata to Goa for 2 people under ₹30,000.',
    },
    {
      label: 'Darjeeling · Mountain Retreat',
      prompt: 'Plan a 3-day hill station retreat from Kolkata to Darjeeling under ₹25,000.',
    },
    {
      label: 'Puri · Coastal Heritage',
      prompt: 'Plan a 3-day spiritual and coastal trip from Kolkata to Puri for 2 people under ₹22,000.',
    },
    {
      label: 'Jaipur · Royal Weekend',
      prompt: 'Plan a 3-day royal heritage trip to Jaipur for 2 people under ₹25,000.',
    },
  ];

  // Pick top 4 destinations for curated preview
  const featuredDestinations = destinations.slice(0, 4);

  const scrollToDestinations = () => {
    const el = document.getElementById('destinations-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-20 sm:space-y-24 pb-20 text-[#172033]">
      {/* 1. HERO SECTION (SPLIT PREMIUM TRAVEL LAYOUT) */}
      <section className="relative pt-8 sm:pt-12 lg:pt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Storytelling, Value Prop & AI Input */}
          <div className="lg:col-span-7 space-y-6">
            {/* Subtle Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#DDF7EF] text-[#087A5A] border border-[#BAEEDB]">
              <Sparkles className="w-3.5 h-3.5 text-[#0F9D72]" />
              <span>AI-Powered Travel Planning</span>
            </div>

            {/* Controlled Heading */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#172033] tracking-tight leading-[1.15]">
                Plan Smarter. <br />
                <span className="text-[#0F9D72]">Travel Better.</span>
              </h1>
            </div>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-[#667085] leading-relaxed max-w-xl">
              Create personalized, budget-aware travel itineraries with AI-powered destination, weather, hotel and activity intelligence.
            </p>

            {/* AI Travel Prompt Input Box */}
            <div className="pt-2 max-w-xl">
              <div className="p-2 sm:p-2.5 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-[#E4EAE7] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-3 py-2 min-w-0">
                  <Compass className="w-5 h-5 text-[#0F9D72] shrink-0" />
                  <input
                    type="text"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onStartPlanning(promptText);
                      }
                    }}
                    placeholder="Plan a 4-day beach trip from Kolkata for 2 people under ₹30,000..."
                    className="w-full text-xs sm:text-sm text-[#172033] placeholder-slate-400 focus:outline-hidden font-medium truncate"
                  />
                </div>
                <button
                  onClick={() => onStartPlanning(promptText)}
                  className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0F9D72] hover:bg-[#087A5A] transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                >
                  <span>Plan My Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Prompts Chips */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider">
                  Try an example:
                </span>
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPromptText(item.prompt);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#DDF7EF] hover:text-[#087A5A] hover:border-[#BAEEDB] border border-[#E4EAE7] text-[#667085] transition-colors text-[11px] font-medium cursor-pointer shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onStartPlanning(promptText)}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#0F9D72] hover:bg-[#087A5A] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Plan My Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={scrollToDestinations}
                className="px-5 py-3 rounded-xl font-bold text-sm text-[#172033] bg-white hover:bg-slate-50 border border-[#E4EAE7] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <MapPin className="w-4 h-4 text-[#0F9D72]" />
                <span>Explore Destinations</span>
              </button>
            </div>
          </div>

          {/* Right Column: Travel-Focused Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Destination Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E4EAE7] shadow-xl bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80"
                  alt="Coastal Goa Travel"
                  className="w-full h-80 sm:h-96 object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/90 via-[#172033]/30 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#BAEEDB] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Goa · Coastal Escape
                  </span>
                  <h3 className="text-xl font-black mt-0.5">Sun-Kissed Beaches & Heritage</h3>
                  <p className="text-xs text-slate-200 mt-1">4 Days / 3 Nights · 2 Travelers</p>
                </div>
              </div>

              {/* Floating Weather Card */}
              <div className="absolute -top-4 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#E4EAE7] shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center shrink-0">
                  <CloudSun className="w-5 h-5 text-[#0F9D72]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
                    <span>29°C · Clear Skies</span>
                  </div>
                  <span className="text-[11px] text-[#667085]">Zero rainfall risk</span>
                </div>
              </div>

              {/* Floating Budget Card */}
              <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#E4EAE7] shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center shrink-0">
                  <IndianRupee className="w-5 h-5 text-[#0F9D72]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#172033]">₹24,850 Estimated</div>
                  <span className="text-[11px] text-[#087A5A] font-semibold">Within ₹30k budget</span>
                </div>
              </div>

              {/* Floating AI Recommendation Badge */}
              <div className="absolute -bottom-3 -right-3 sm:-right-4 bg-[#172033]/95 text-white backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#BAEEDB] shrink-0" />
                <div>
                  <span className="text-[11px] font-bold block text-white">AI Optimized</span>
                  <span className="text-[10px] text-slate-300">Verified stays & timing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW AI TRAVEL PLANNER WORKS (COMPACT 3-STEP SECTION) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">
            Intelligent Planning Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            How AI Travel Planner Works
          </h2>
          <p className="text-xs sm:text-sm text-[#667085]">
            From free-form travel ideas to a verified, complete vacation itinerary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4EAE7] shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-3xl font-black text-[#0F9D72]/20 block">01</span>
              <h3 className="text-lg font-bold text-[#172033]">Tell us your plans</h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                Describe your destination, budget, duration, interests and preferences naturally.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E4EAE7] text-xs font-semibold text-[#087A5A]">
              Free-form natural language input
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4EAE7] shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-3xl font-black text-[#0F9D72]/20 block">02</span>
              <h3 className="text-lg font-bold text-[#172033]">AI builds your itinerary</h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                The system evaluates destinations, weather, accommodation, activities and budget.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E4EAE7] text-xs font-semibold text-[#087A5A]">
              Multi-tool agent reasoning
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4EAE7] shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-3xl font-black text-[#0F9D72]/20 block">03</span>
              <h3 className="text-lg font-bold text-[#172033]">AI adapts when plans change</h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                If your budget or constraints change, the AI can automatically re-optimize the itinerary.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E4EAE7] text-xs font-semibold text-[#087A5A]">
              Autonomous replanning engine
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAKE THE AI DIFFERENTIATOR VISUAL */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E4EAE7] shadow-sm space-y-8">
          <div className="max-w-xl space-y-1.5">
            <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">
              Autonomous Replanning
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              Your Trip Can Adapt.
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Your itinerary isn't fixed. The AI can rethink the plan when your priorities change.
            </p>
          </div>

          {/* Simple Visual Flow */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7]">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-white border border-[#E4EAE7] shadow-2xs">
                <span className="text-xs font-bold text-[#172033] block">Original Plan</span>
                <span className="text-[11px] text-[#667085]">Initial preferences</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#E4EAE7] shadow-2xs relative">
                <span className="text-xs font-bold text-[#DC4B4B] block">Constraint Changes</span>
                <span className="text-[11px] text-[#667085]">Budget or dates shift</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#E4EAE7] shadow-2xs">
                <span className="text-xs font-bold text-[#087A5A] block">AI Evaluates Alternatives</span>
                <span className="text-[11px] text-[#667085]">Hotels, routes & activities</span>
              </div>
              <div className="p-3 rounded-lg bg-[#DDF7EF] border border-[#BAEEDB] shadow-2xs">
                <span className="text-xs font-bold text-[#087A5A] block">Optimized Trip</span>
                <span className="text-[11px] text-[#087A5A]">Balanced & feasible</span>
              </div>
            </div>
          </div>

          {/* Three Replanning Levels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2 p-5 rounded-xl border border-[#E4EAE7] bg-white">
              <div className="w-8 h-8 rounded-lg bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Accommodation Optimization</h4>
              <p className="text-xs text-[#667085] leading-relaxed">
                Adjusts lodging categories while preserving your chosen destination and activities.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-xl border border-[#E4EAE7] bg-white">
              <div className="w-8 h-8 rounded-lg bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Destination Rerouting</h4>
              <p className="text-xs text-[#667085] leading-relaxed">
                Discovers sibling destinations offering similar vibes with lower transit costs.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-xl border border-[#E4EAE7] bg-white">
              <div className="w-8 h-8 rounded-lg bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Activity & Budget Optimization</h4>
              <p className="text-xs text-[#667085] leading-relaxed">
                Refines day schedules, excursions, and duration to ensure a healthy financial safety buffer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DESTINATION SECTION (CURATED ESCAPES) */}
      <section id="destinations-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">
              Handpicked Destinations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              Explore Your Next Escape
            </h2>
            <p className="text-xs sm:text-sm text-[#667085]">
              Start with a destination or let AI find one that fits your preferences.
            </p>
          </div>
          <button
            onClick={() => onStartPlanning()}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F9D72] hover:text-[#087A5A] cursor-pointer"
          >
            <span>Open in planner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDestinations.map((dest) => {
            const tags = dest.tags ? dest.tags.split(',').slice(0, 2) : ['scenic', 'nature'];
            return (
              <div
                key={dest.id}
                className="bg-white rounded-2xl border border-[#E4EAE7] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={dest.imageUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80'}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      crossOrigin="anonymous"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#BAEEDB] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {dest.state}
                        </span>
                        <h4 className="text-base font-bold">{dest.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-300 block uppercase">Travel / Pax</span>
                        <span className="text-xs font-extrabold text-[#BAEEDB]">
                          ₹{dest.travelCostPerPerson.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F7FAF9] text-[#667085] border border-[#E4EAE7]"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => onSelectDestination(dest.name)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F9D72] hover:bg-[#087A5A] transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Plan This Trip</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURE SECTION (EVERYTHING YOUR TRIP NEEDS) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#0F9D72] uppercase tracking-wider">
            All-In-One Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Everything Your Trip Needs
          </h2>
          <p className="text-xs sm:text-sm text-[#667085]">
            Engineered to bring every aspect of journey planning into one seamless system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4EAE7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#0F9D72]" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">Smart Itineraries</h3>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Personalized day-by-day plans based on your interests.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4EAE7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center">
              <CloudSun className="w-5 h-5 text-[#0F9D72]" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">Weather Intelligence</h3>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Weather-aware destination planning.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4EAE7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-[#0F9D72]" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">Budget Intelligence</h3>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Transportation, hotel, food and activity costs are considered together.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4EAE7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-[#0F9D72]" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">Autonomous Replanning</h3>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              The AI can adapt the itinerary when constraints change.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TECHNOLOGY SUMMARY (COMPACT & SUBTLE) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
        <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block">
          Powered by
        </span>
        <div className="text-xs sm:text-sm font-semibold text-[#172033] flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>.NET 10</span>
          <span className="text-slate-300">·</span>
          <span>React</span>
          <span className="text-slate-300">·</span>
          <span>Microsoft Agent Framework</span>
          <span className="text-slate-300">·</span>
          <span>Ollama</span>
          <span className="text-slate-300">·</span>
          <span>Llama 3.2</span>
          <span className="text-slate-300">·</span>
          <span>SQL Server</span>
        </div>
      </section>

      {/* 7. TRUST / PROJECT STATEMENT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E4EAE7] shadow-2xs text-center space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[#172033]">
            Built as a complete AI travel planning system
          </h3>
          <p className="text-xs sm:text-sm text-[#667085] max-w-2xl mx-auto leading-relaxed">
            From natural-language trip requests to weather-aware planning, budget optimization and autonomous replanning, AI Travel Planner combines modern full-stack engineering with local AI inference.
          </p>
        </div>
      </section>
    </div>
  );
};
