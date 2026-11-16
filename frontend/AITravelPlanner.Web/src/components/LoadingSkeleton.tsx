import React, { useEffect, useState } from 'react';
import { Compass, Sparkles, CheckCircle2, Loader2, Database, CloudSun, Hotel, Calculator } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  const steps = [
    { title: 'Understanding Request', desc: 'Parsing natural language into structured travel constraints...', icon: Sparkles },
    { title: 'Tool: SearchDestinations', desc: 'Querying database catalog for top destinations matching interests...', icon: Database },
    { title: 'Tool: GetWeatherForecast', desc: 'Checking weather forecast & evaluating heavy rain warnings...', icon: CloudSun },
    { title: 'Tool: SearchHotels', desc: 'Searching rated accommodations within budget threshold...', icon: Hotel },
    { title: 'Tool: CalculateBudget', desc: 'Calculating travel, room nights, food, activities & safety buffer...', icon: Calculator },
    { title: 'AI Replanning Verification', desc: 'Evaluating budget deficit and exploring automated optimization...', icon: Compass },
    { title: 'Synthesizing Itinerary', desc: 'Formatting morning, afternoon, evening activities and packing tips...', icon: Sparkles },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 sm:p-10 bg-white rounded-3xl border border-[#E4EAE7] shadow-xl text-center space-y-8 animate-fade-in">
      <div className="relative mx-auto w-20 h-20">
        <div className="absolute inset-0 rounded-2xl bg-[#0F9D72]/20 animate-ping" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#087A5A] to-[#0F9D72] flex items-center justify-center text-white shadow-lg shadow-[#0F9D72]/30">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DDF7EF] text-[#087A5A] border border-[#BAEEDB] mb-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Microsoft Agent Framework Active
        </span>
        <h3 className="text-2xl font-black text-[#172033] tracking-tight">
          AI Travel Agent is Planning Your Vacation
        </h3>
        <p className="text-xs sm:text-sm text-[#667085] mt-1 max-w-md mx-auto">
          Our autonomous planning agent is invoking live tools, balancing budgets, and inspecting regional forecasts.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-3 text-left max-w-md mx-auto bg-[#F7FAF9] p-5 rounded-2xl border border-[#E4EAE7]">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const StepIcon = step.icon;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-white shadow-xs border border-[#BAEEDB] text-[#087A5A] font-semibold scale-[1.02]'
                  : isDone
                  ? 'text-[#667085] opacity-80'
                  : 'text-slate-300 opacity-40'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0F9D72]" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#0F9D72] animate-spin" />
                ) : (
                  <StepIcon className="w-4 h-4 text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold block leading-tight">{step.title}</span>
                <span className="text-[11px] text-[#667085] leading-tight block">{step.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
