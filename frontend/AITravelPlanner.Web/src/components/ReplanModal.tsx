import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Sparkles, IndianRupee, ArrowRight, AlertCircle } from 'lucide-react';
import { ReplanTripRequest } from '../types/travel';

interface ReplanModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: number;
  currentBudget: number;
  currentDestination: string;
  onReplan: (req: ReplanTripRequest) => Promise<void>;
  minimumFeasibleBudget?: number;
}

export const ReplanModal: React.FC<ReplanModalProps> = ({
  isOpen,
  onClose,
  tripId,
  currentBudget,
  currentDestination,
  onReplan,
  minimumFeasibleBudget = 0,
}) => {
  const [prompt, setPrompt] = useState('Make it cheaper');
  const [budgetInput, setBudgetInput] = useState<string>(String(currentBudget));
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [preferredDest, setPreferredDest] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Validate budget value according to strict frontend rules
  const validateBudget = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Target budget is required.';
    }

    const num = Number(trimmed);
    if (isNaN(num)) {
      return 'Target budget must be a valid numeric amount.';
    }

    if (!Number.isInteger(num)) {
      return 'Target budget must be a positive whole number (no decimals).';
    }

    if (num <= 0) {
      return 'Target budget must be a positive whole number greater than 0.';
    }

    if (num > 10000000) {
      return 'Target budget cannot exceed ₹1,00,00,000 (₹1 crore).';
    }

    if (minimumFeasibleBudget > 0 && num < minimumFeasibleBudget) {
      return `Target budget is too low for this trip. Minimum feasible budget is ₹${minimumFeasibleBudget.toLocaleString('en-IN')}.`;
    }

    return null;
  };

  useEffect(() => {
    if (isOpen) {
      const initialVal = String(currentBudget || '');
      setBudgetInput(initialVal);
      setBudgetError(validateBudget(initialVal));
      setPrompt('Make it cheaper');
      setPreferredDest('');
    }
  }, [isOpen, currentBudget, minimumFeasibleBudget]);

  if (!isOpen) return null;

  const handleBudgetChange = (val: string) => {
    setBudgetInput(val);
    setBudgetError(validateBudget(val));
  };

  const quickChips = [
    { label: '💰 Make it cheaper', text: 'Please make this trip cheaper by selecting budget-friendly accommodation and adjusting activities.' },
    { label: '🏖️ Switch to Beach (Puri)', dest: 'Puri', text: 'Switch destination to Puri with sunny beaches and coastal seafood.' },
    { label: '🏔️ Switch to Hills (Darjeeling)', dest: 'Darjeeling', text: 'Switch destination to Darjeeling for cool hill weather and tea gardens.' },
    { label: '☀️ Avoid any rain', text: 'Avoid places with rain and find a sunny destination with pleasant weather.' },
    { label: '⭐ Upgrade stay', text: 'Find a premium luxury resort while keeping activities economical.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict validation gate - DO NOT send API call if invalid
    const err = validateBudget(budgetInput);
    if (err) {
      setBudgetError(err);
      return;
    }

    if (!prompt.trim()) return;

    const parsedBudget = parseInt(budgetInput.trim(), 10);

    setLoading(true);
    try {
      await onReplan({
        tripId,
        userChangeRequest: prompt,
        newTargetBudget: parsedBudget,
        preferredDestination: preferredDest ? preferredDest : undefined,
      });
      onClose();
    } catch (apiErr: any) {
      console.error(apiErr);
      const msg = apiErr.response?.data?.message || apiErr.message || 'Replanning failed. Please check inputs.';
      setBudgetError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = !budgetError && budgetInput.trim() !== '' && prompt.trim() !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E4EAE7] overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#E4EAE7] flex items-center justify-between bg-[#F7FAF9]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center border border-[#BAEEDB]">
              <RefreshCw className="w-5 h-5 animate-spin-reverse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#172033]">AI-Powered Replanner</h3>
              <p className="text-xs text-[#667085]">Autonomous budget & itinerary reconfiguration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#667085] hover:text-[#172033] rounded-xl hover:bg-[#E4EAE7]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick Directives */}
          <div>
            <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-2">
              Quick Adjustment Directives
            </label>
            <div className="flex flex-wrap gap-2">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(chip.text);
                    if (chip.dest) setPreferredDest(chip.dest);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F7FAF9] hover:bg-[#DDF7EF] hover:text-[#087A5A] hover:border-[#BAEEDB] text-[#667085] border border-[#E4EAE7] transition-all text-left"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Request */}
          <div>
            <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-1.5">
              Adjustment Instructions
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Make it cheaper by ₹5,000, or switch to a beachfront resort..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] focus:border-[#0F9D72] bg-[#F7FAF9]/40"
              required
            />
          </div>

          {/* Target Budget & Destination Override */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider">
                  Target Budget (₹) *
                </label>
                {minimumFeasibleBudget > 0 && (
                  <span className="text-[10px] text-[#087A5A] font-semibold">
                    Min: ₹{minimumFeasibleBudget.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div className="relative">
                <IndianRupee className={`w-4 h-4 absolute left-3 top-3 ${budgetError ? 'text-[#DC4B4B]' : 'text-[#667085]'}`} />
                <input
                  type="text"
                  inputMode="numeric"
                  value={budgetInput}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  placeholder="e.g. 35000"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border focus:outline-hidden font-bold transition-all ${
                    budgetError
                      ? 'border-[#DC4B4B] bg-red-50/40 text-[#DC4B4B] focus:ring-2 focus:ring-[#DC4B4B]'
                      : 'border-[#E4EAE7] bg-[#F7FAF9]/40 text-[#172033] focus:ring-2 focus:ring-[#0F9D72]'
                  }`}
                  required
                />
              </div>

              {/* Red validation message */}
              {budgetError && (
                <p className="text-xs text-[#DC4B4B] font-semibold mt-1.5 flex items-start gap-1 leading-tight animate-fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{budgetError}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-1">
                Destination Override (Optional)
              </label>
              <input
                type="text"
                value={preferredDest}
                onChange={(e) => setPreferredDest(e.target.value)}
                placeholder={currentDestination}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4EAE7] focus:outline-hidden focus:ring-2 focus:ring-[#0F9D72] bg-[#F7FAF9]/40"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 ${
                isFormValid && !loading
                  ? 'bg-[#0F9D72] hover:bg-[#087A5A] shadow-md shadow-[#0F9D72]/20 cursor-pointer hover:scale-[1.01]'
                  : 'bg-slate-300 cursor-not-allowed opacity-60'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Replanning Itinerary & Budget...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Execute AI Replanning
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
