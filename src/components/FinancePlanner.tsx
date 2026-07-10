import React, { useState } from "react";
import { UserProfile, Application } from "../types";
import { Calculator, DollarSign, Award, ArrowUpRight, TrendingUp, AlertCircle, ShieldAlert, CheckCircle } from "lucide-react";

interface FinancePlannerProps {
  profile: UserProfile;
  applications: Application[];
  onNavigate: (tab: string) => void;
}

export default function FinancePlanner({ profile, applications, onNavigate }: FinancePlannerProps) {
  const [tuitionFee, setTuitionFee] = useState(12000);
  const [housingCost, setHousingCost] = useState(6000);
  const [materialsCost, setMaterialsCost] = useState(1500);
  const [personalExpense, setPersonalExpense] = useState(2500);

  // Compute scholarship values saved in Application Tracker
  const savedScholarships = applications.filter(
    (app) => app.category === "Scholarships" || app.category === "Grants"
  );

  // Parse estimated amounts from mock data (or assume $5000 if can't parse)
  const totalScholarshipOffsets = savedScholarships.reduce((acc, app) => {
    let amt = 5000; // default offset estimation
    if (app.status === "Accepted") {
      amt = 8000;
    }
    return acc + amt;
  }, 0);

  const totalCost = tuitionFee + housingCost + materialsCost + personalExpense;
  const netOutstandingGap = Math.max(0, totalCost - totalScholarshipOffsets);

  return (
    <div className="space-y-6" id="finance-planner-root">
      {/* Title */}
      <div id="finance-title-wrapper">
        <h1 className="text-xl font-bold text-white tracking-tight" id="title-finance">Finance & Scholarship Planner</h1>
        <p className="text-xs text-gray-400" id="desc-finance">Calculate tuition thresholds, estimate scholarship savings offsets, and map academic budgets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="finance-grid">
        {/* Cost Calculator Form */}
        <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-5 relative overflow-hidden" id="box-budget-calculator">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-xs font-semibold text-white tracking-widest uppercase flex items-center space-x-2 font-display z-10 relative" id="lbl-budget-calculator">
            <Calculator className="w-4.5 h-4.5 text-brand-violet" />
            <span>Academic Cost Calculator</span>
          </h3>

          <div className="space-y-5 z-10 relative" id="budget-sliders">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5" id="lbl-tuition">
                <span className="text-gray-400">Tuition Fees (per Semester)</span>
                <span className="text-white">${tuitionFee.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={tuitionFee}
                onChange={(e) => setTuitionFee(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-violet"
                id="range-tuition"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5" id="lbl-housing">
                <span className="text-gray-400">Housing & Living (per Semester)</span>
                <span className="text-white">${housingCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="250"
                value={housingCost}
                onChange={(e) => setHousingCost(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-violet"
                id="range-housing"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5" id="lbl-materials">
                <span className="text-gray-400">Materials & Textbooks</span>
                <span className="text-white">${materialsCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="8000"
                step="100"
                value={materialsCost}
                onChange={(e) => setMaterialsCost(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-violet"
                id="range-materials"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5" id="lbl-personal">
                <span className="text-gray-400">Misc & Personal Expenses</span>
                <span className="text-white">${personalExpense.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="200"
                max="12000"
                step="200"
                value={personalExpense}
                onChange={(e) => setPersonalExpense(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-violet"
                id="range-personal"
              />
            </div>
          </div>
        </div>

        {/* Financial Results / Projections Panel */}
        <div className="lg:col-span-2 space-y-6 animate-fadeIn" id="finance-results-panel">
          <div className="glass-card border border-white/5 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6" id="box-cost-offset-breakdown">
            {/* Costs column */}
            <div className="text-center md:border-r md:border-white/5 md:pr-4 flex flex-col justify-center items-center py-2" id="col-total-costs">
              <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">ANNUAL ACADEMIC COSTS</span>
              <div className="inline-flex items-center text-2xl font-black text-white mt-1.5" id="val-total-costs">
                <DollarSign className="w-5.5 h-5.5 text-brand-coral" />
                <span>{totalCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Offsets column */}
            <div className="text-center md:border-r md:border-white/5 md:pr-4 flex flex-col justify-center items-center py-2" id="col-offsets">
              <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">SCHOLARSHIP SAVINGS</span>
              <div className="inline-flex items-center text-2xl font-black text-brand-emerald mt-1.5" id="val-offsets">
                <DollarSign className="w-5.5 h-5.5 text-brand-emerald" />
                <span>{totalScholarshipOffsets.toLocaleString()}</span>
              </div>
              <span className="block text-[9px] text-brand-emerald font-bold mt-1.5 uppercase tracking-wide" id="lbl-tracked-offsets">FROM {savedScholarships.length} SAVED LISTS</span>
            </div>

            {/* Gap Column */}
            <div className="text-center flex flex-col justify-center items-center py-2" id="col-net-gap">
              <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">NET OUTSTANDING GAP</span>
              <div className="inline-flex items-center text-2xl font-black text-brand-gold mt-1.5" id="val-net-gap">
                <DollarSign className="w-5.5 h-5.5 text-brand-gold" />
                <span>{netOutstandingGap.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Recommendations to close the gap */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4" id="box-finance-recommendations">
            <h3 className="text-xs font-semibold text-white tracking-wider flex items-center space-x-2 font-display" id="lbl-recomm-header">
              <TrendingUp className="w-4.5 h-4.5 text-brand-emerald" />
              <span>Recommended Funding Strategies</span>
            </h3>

            <div className="space-y-3.5" id="list-funding-recommendations">
              {netOutstandingGap > 0 ? (
                <>
                  <div className="p-4 bg-brand-gold/5 border border-brand-gold/15 rounded-xl flex items-start space-x-3" id="recomm-warning-panel">
                    <AlertCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">Outstanding Gap of ${netOutstandingGap.toLocaleString()} Projected</h4>
                      <p className="text-[10.5px] text-gray-400 leading-relaxed mt-0.5">
                        Your yearly expenses exceed your current saved scholarships and fellowship grants. We recommend searching the matching index to track supplementary awards.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="grid-finance-actions">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5" id="finance-action-1">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                        <span>1. Target High-Value Fellowships</span>
                        <ArrowUpRight className="w-4 h-4 text-brand-violet" />
                      </h4>
                      <p className="text-[10.5px] text-gray-400 leading-relaxed">
                        Lumina has index-matched fellowships offering over <span className="text-brand-emerald font-bold">$15,000</span> in cash stipends for STEM applicants.
                      </p>
                      <button
                        type="button"
                        onClick={() => onNavigate("opportunities")}
                        className="text-[10px] text-brand-magenta hover:text-brand-magenta/80 font-bold underline cursor-pointer transition-colors"
                      >
                        Explore Fellowships
                      </button>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5" id="finance-action-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                        <span>2. Apply Saved Grants</span>
                        <ArrowUpRight className="w-4 h-4 text-brand-violet" />
                      </h4>
                      <p className="text-[10.5px] text-gray-400 leading-relaxed">
                        You have <span className="text-white font-semibold">{savedScholarships.length} saved</span> options. Submitting these applications can reduce your deficit.
                      </p>
                      <button
                        type="button"
                        onClick={() => onNavigate("opportunities")}
                        className="text-[10px] text-brand-magenta hover:text-brand-magenta/80 font-bold underline cursor-pointer transition-colors"
                      >
                        Open Saved Tracker
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-brand-emerald/5 border border-brand-emerald/15 rounded-xl flex items-start space-x-3" id="recomm-success-panel">
                  <CheckCircle className="w-5 h-5 text-brand-emerald flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">100% Scholarship Coverage Projected!</h4>
                    <p className="text-[10.5px] text-gray-400 leading-relaxed mt-0.5">
                      Excellent budget planning! Your saved or approved scholarship funds completely offset your academic annual expenses. Monitor deadlines in your tracker to ensure compliance.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
