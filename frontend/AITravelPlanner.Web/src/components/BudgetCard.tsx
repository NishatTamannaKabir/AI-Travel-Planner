import React from 'react';
import { ShieldCheck, AlertCircle, CreditCard, PieChart } from 'lucide-react';
import { BudgetBreakdown } from '../types/travel';

interface BudgetCardProps {
  budget: BudgetBreakdown;
  travellers: number;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, travellers }) => {
  const percentUsed = Math.min(100, Math.round((budget.totalEstimatedCost / (budget.totalBudget || 1)) * 100));

  return (
    <div className="budget-card w-full max-w-full min-w-0 bg-white rounded-2xl border border-[#E4EAE7] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all break-words print:border print:border-slate-300 print:p-4 print:shadow-none print:break-inside-avoid">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E4EAE7] flex-wrap gap-2 print:border-slate-200">
        <div>
          <span className="text-xs font-bold text-[#667085] uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-[#0F9D72]" />
            Budget Intelligence
          </span>
          <h3 className="text-base sm:text-lg font-black text-[#172033] mt-0.5">Financial Breakdown</h3>
        </div>
        {budget.withinBudget ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DDF7EF] text-[#087A5A] border border-[#BAEEDB] shrink-0 print:bg-emerald-50 print:border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F9D72]" />
            Within Budget
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#DC4B4B] border border-red-200 shrink-0 print:bg-red-100">
            <AlertCircle className="w-3.5 h-3.5 text-[#DC4B4B]" />
            Exceeds by ₹{budget.overBudgetBy.toLocaleString('en-IN')}
          </div>
        )}
      </div>

      {/* Main Totals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 my-4 p-3 sm:p-3.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] min-w-0 print:bg-slate-50 print:border-slate-200">
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-[#667085] leading-tight block mb-1 break-words">
            Allocated Budget
          </span>
          <div className="text-[15px] sm:text-base font-black text-[#172033] tracking-tight leading-snug">
            <span className="text-xs font-bold text-[#667085] mr-0.5">₹</span>
            {budget.totalBudget.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-[#667085] leading-tight block mb-1 break-words">
            Estimated Total
          </span>
          <div className={`text-[15px] sm:text-base font-black tracking-tight leading-snug ${
            budget.withinBudget ? 'text-[#0F9D72]' : 'text-[#DC4B4B]'
          }`}>
            <span className="text-xs font-bold mr-0.5">₹</span>
            {budget.totalEstimatedCost.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 min-w-0">
          <span className="text-[11px] font-semibold text-[#667085] leading-tight block mb-1 break-words">
            Per Person ({travellers} {travellers === 1 ? 'Pax' : 'Pax'})
          </span>
          <div className="text-[15px] sm:text-base font-black text-[#172033] tracking-tight leading-snug">
            <span className="text-xs font-bold text-[#667085] mr-0.5">₹</span>
            {budget.costPerTraveller.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Progress Bar & Buffer */}
      <div className="space-y-1.5 mb-5 print:mb-3">
        <div className="flex justify-between items-center text-xs font-semibold text-[#667085] flex-wrap gap-1">
          <span>Budget Utilization ({percentUsed}%)</span>
          <span className={budget.remainingBudget >= 0 ? 'text-[#087A5A] font-bold shrink-0' : 'text-[#DC4B4B] font-bold shrink-0'}>
            {budget.remainingBudget >= 0
              ? `₹${budget.remainingBudget.toLocaleString('en-IN')} safety buffer`
              : `₹${Math.abs(budget.remainingBudget).toLocaleString('en-IN')} deficit`}
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#E4EAE7] rounded-full overflow-hidden print:bg-slate-200">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              budget.withinBudget
                ? 'bg-gradient-to-r from-[#0F9D72] to-[#14B8A6] print:bg-[#0F9D72]'
                : 'bg-[#DC4B4B]'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* Itemized Line Items */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] sm:text-xs font-bold text-[#667085] uppercase tracking-wider flex items-center gap-1.5">
          <PieChart className="w-3.5 h-3.5 text-[#0F9D72]" />
          Itemized Cost Structure
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between gap-1.5 py-2 px-2.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] min-w-0 print:bg-white print:border-slate-200">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span className="text-xs sm:text-[13px] text-[#667085] font-medium leading-tight break-words min-w-0 flex-1">
                Round-Trip Travel
              </span>
            </div>
            <span className="text-xs sm:text-[13px] font-bold text-[#172033] shrink-0 text-right whitespace-nowrap pl-1">
              ₹{budget.travelCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between gap-1.5 py-2 px-2.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] min-w-0 print:bg-white print:border-slate-200">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs sm:text-[13px] text-[#667085] font-medium leading-tight break-words min-w-0 flex-1">
                Hotel Accommodations
              </span>
            </div>
            <span className="text-xs sm:text-[13px] font-bold text-[#172033] shrink-0 text-right whitespace-nowrap pl-1">
              ₹{budget.hotelCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between gap-1.5 py-2 px-2.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] min-w-0 print:bg-white print:border-slate-200">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="text-xs sm:text-[13px] text-[#667085] font-medium leading-tight break-words min-w-0 flex-1">
                Food & Dining
              </span>
            </div>
            <span className="text-xs sm:text-[13px] font-bold text-[#172033] shrink-0 text-right whitespace-nowrap pl-1">
              ₹{budget.foodCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between gap-1.5 py-2 px-2.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] min-w-0 print:bg-white print:border-slate-200">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
              <span className="text-xs sm:text-[13px] text-[#667085] font-medium leading-tight break-words min-w-0 flex-1">
                Tours & Activities
              </span>
            </div>
            <span className="text-xs sm:text-[13px] font-bold text-[#172033] shrink-0 text-right whitespace-nowrap pl-1">
              ₹{budget.activitiesCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between gap-1.5 py-2 px-2.5 rounded-xl bg-[#F7FAF9] border border-[#E4EAE7] sm:col-span-2 min-w-0 print:bg-white print:border-slate-200">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
              <span className="text-xs sm:text-[13px] text-[#667085] font-medium leading-tight break-words min-w-0 flex-1">
                Local Buffer & Misc
              </span>
            </div>
            <span className="text-xs sm:text-[13px] font-bold text-[#172033] shrink-0 text-right whitespace-nowrap pl-1">
              ₹{budget.miscCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};