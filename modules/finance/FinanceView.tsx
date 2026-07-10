'use client';

import React, { useState } from 'react';
import { DollarSign, Wallet, Percent, ChevronRight, HelpCircle, Calculator } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export const FinanceView: React.FC = () => {
  // Interactive tuition projection calculator state
  const [tuition, setTuition] = useState<number>(35000);
  const [scholarshipCredits, setScholarshipCredits] = useState<number>(12000);
  const [personalSavings, setPersonalSavings] = useState<number>(5000);
  const [loanInterest, setLoanInterest] = useState<number>(5.5);

  const remainingCost = Math.max(0, tuition - scholarshipCredits - personalSavings);
  
  // Calculate simple annual loan interest payment estimate
  const estimatedInterestYearly = Math.round(remainingCost * (loanInterest / 100));

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 select-none animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-sans">Educational Finance Hub</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Budget tuition costs, review scholarship funding, and calculate student loan projections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Calculator */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Calculator className="h-5 w-5 text-primary shrink-0" />
              <h3 className="text-xs font-semibold text-white">Tuition & Loan Estimator</h3>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Inputs */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Annual Tuition & Fees ($)</label>
                  <input
                    type="number"
                    value={tuition}
                    onChange={(e) => setTuition(Number(e.target.value))}
                    className="bg-muted/10 border border-border rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-primary/60 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Scholarships & Grants Awarded ($)</label>
                  <input
                    type="number"
                    value={scholarshipCredits}
                    onChange={(e) => setScholarshipCredits(Number(e.target.value))}
                    className="bg-muted/10 border border-border rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-primary/60 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Personal / Family Savings ($)</label>
                  <input
                    type="number"
                    value={personalSavings}
                    onChange={(e) => setPersonalSavings(Number(e.target.value))}
                    className="bg-muted/10 border border-border rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-primary/60 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Est. Loan Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={loanInterest}
                    onChange={(e) => setLoanInterest(Number(e.target.value))}
                    className="bg-muted/10 border border-border rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-primary/60 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Logs */}
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-white border-b border-border/60 pb-2">Recent Transactions</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/60 text-xs text-white">
                <div>
                  <span className="font-medium">Grace Hopper scholarship grant</span>
                  <span className="text-[9px] text-muted-foreground block">July 01, 2026</span>
                </div>
                <span className="font-semibold text-emerald-500">+$1,500</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/60 text-xs text-white">
                <div>
                  <span className="font-medium">Semester Tuition Payment</span>
                  <span className="text-[9px] text-muted-foreground block">June 15, 2026</span>
                </div>
                <span className="font-semibold text-rose-500">-$17,500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Cost breakdown outputs */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col gap-6">
            <h3 className="text-xs font-semibold text-white border-b border-border/60 pb-3">Projection Summary</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-xs text-white">
                <span className="text-muted-foreground">Total Tuition:</span>
                <span className="font-mono">{formatCurrency(tuition)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white">
                <span className="text-muted-foreground font-sans">Total Subsidies (Savings + Grants):</span>
                <span className="font-mono text-emerald-400">-{formatCurrency(scholarshipCredits + personalSavings)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-border/80 pt-3 text-xs text-white">
                <span className="font-semibold">Remaining Funding Gap (Loan):</span>
                <span className="font-mono font-bold text-primary">{formatCurrency(remainingCost)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-2.5">
              <Percent className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold text-primary uppercase block">Interest estimate</span>
                <p className="text-[11px] text-white mt-1">
                  At a {loanInterest}% interest rate, this loan will accumulate approximately <strong className="text-secondary">{formatCurrency(estimatedInterestYearly)}</strong> in interest annually.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default FinanceView;
