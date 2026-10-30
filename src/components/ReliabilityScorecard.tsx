import React, { useState } from 'react';
import {
  ShieldAlert,
  Calculator,
  Info,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Percent,
} from 'lucide-react';
import { ReliabilityMetrics } from '../types';

interface ReliabilityScorecardProps {
  metrics: ReliabilityMetrics;
  processingTimeMs: number;
}

export const ReliabilityScorecard: React.FC<ReliabilityScorecardProps> = ({
  metrics,
  processingTimeMs,
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const getScoreTheme = (score: number) => {
    if (score >= 80) {
      return {
        bg: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400',
        stroke: '#10b981',
        label: 'High Empirical Grounding',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      };
    }
    if (score >= 55) {
      return {
        bg: 'from-amber-500/10 to-yellow-500/10 border-amber-500/30 text-amber-400',
        stroke: '#f59e0b',
        label: 'Moderate Grounding / Partial Uncertainty',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      };
    }
    return {
      bg: 'from-rose-500/10 to-red-500/10 border-rose-500/30 text-rose-400',
      stroke: '#ef4444',
      label: 'High Hallucination Risk / Unsupported Assertions',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    };
  };

  const theme = getScoreTheme(metrics.reliabilityScore);
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (metrics.reliabilityScore / 100) * circumference;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Module 5 & 6
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Reliability Score & Verification Metrics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical reliability index computed by natural language inference (NLI) against retrieved evidence.
          </p>
        </div>

        <button
          onClick={() => setShowFormulaModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
        >
          <Calculator className="w-3.5 h-3.5 text-indigo-400" />
          <span>Transparent Calculation Formula</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="42"
                stroke="#1e293b"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="42"
                stroke={theme.stroke}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {metrics.reliabilityScore}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">out of 100</span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${theme.badge}`}>
              {theme.label}
            </span>
            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-center space-x-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Audited in {processingTimeMs} ms</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Extracted Claims</span>
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{metrics.totalClaims}</div>
            <div className="text-[10px] text-slate-400 mt-1">Atomic factual propositions</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
              <span>Supported Claims</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-300 font-mono">{metrics.supportedCount}</div>
            <div className="text-[10px] text-emerald-400/80 mt-1">Verified with citations (+1.0 wt)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center justify-between text-xs text-rose-400 mb-1">
              <span>Contradicted Claims</span>
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-300 font-mono">{metrics.contradictedCount}</div>
            <div className="text-[10px] text-rose-400/80 mt-1">Detected hallucinations (-1.75 wt)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
            <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
              <span>Unverified Claims</span>
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-300 font-mono">{metrics.unverifiedCount}</div>
            <div className="text-[10px] text-amber-400/80 mt-1">Inconclusive evidence (+0.35 wt)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Verification Coverage</span>
              <Percent className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-300 font-mono">
              {metrics.verificationCoverage}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Claims resolved by evidence</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Hallucination Rate</span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-400 font-mono">{metrics.hallucinationRate}%</div>
            <div className="text-[10px] text-slate-400 mt-1">Contradicted / Total claims</div>
          </div>
        </div>
      </div>

      <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Epistemic Disclaimer:</strong> The TruthPrompt Reliability Score reflects verifiable empirical corroboration against retrieved reference corpora. It is designed to expose potential hallucinations and unsupported statements, and must not be conflated with absolute mathematical infallibility.
        </p>
      </div>

      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  Explainable Reliability Score Formula
                </h3>
              </div>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 mt-4 font-sans">
              <p>
                TruthPrompt uses a mathematically transparent scoring model calibrated to penalize factual hallucinations while accounting for open-world epistemic uncertainty:
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 font-mono text-center text-sm text-indigo-300">
                Score = max(0, min(100, round([ (S × 1.0 + U × 0.35 - C × 1.75) / N ] × 100)))
              </div>

              <div className="space-y-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                <div className="flex justify-between">
                  <span className="font-semibold text-emerald-400">S (Supported Claims, wt = +1.00):</span>
                  <span className="font-mono text-white">
                    {metrics.supportedCount} × 1.0 = +{(metrics.supportedCount * 1.0).toFixed(2)} pts
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-amber-400">U (Unverified Claims, wt = +0.35):</span>
                  <span className="font-mono text-white">
                    {metrics.unverifiedCount} × 0.35 = +{(metrics.unverifiedCount * 0.35).toFixed(2)} pts
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-rose-400">C (Contradicted Claims, wt = -1.75 penalty):</span>
                  <span className="font-mono text-white">
                    {metrics.contradictedCount} × -1.75 = -{(metrics.contradictedCount * 1.75).toFixed(2)} pts
                  </span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold">
                  <span>Net Weighted Points / Total ({metrics.totalClaims}):</span>
                  <span className="font-mono text-emerald-300">
                    {metrics.calculationBreakdown.rawScore} → Normalized: {metrics.reliabilityScore} / 100
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <p>
                  <strong>Why -1.75 for contradictions?</strong> Hallucinated facts are far more detrimental to user trust and system safety than unverified statements, requiring an asymmetric penalty.
                </p>
                <p>
                  <strong>Why +0.35 for unverified?</strong> Not every missing web citation constitutes a false claim; unverified assertions represent unconfirmed propositions without refutation evidence.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
