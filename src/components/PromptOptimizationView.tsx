import React, { useState } from 'react';
import {
  Wand2,
  Copy,
  Check,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { PromptOptimizationResult } from '../types';

interface PromptOptimizationViewProps {
  optimization: PromptOptimizationResult;
  onRunOptimized: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptOptimizationView: React.FC<PromptOptimizationViewProps> = ({
  optimization,
  onRunOptimized,
  isLoading,
}) => {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedOptimized, setCopiedOptimized] = useState(false);

  const copyToClipboard = (text: string, isOpt: boolean) => {
    navigator.clipboard.writeText(text);
    if (isOpt) {
      setCopiedOptimized(true);
      setTimeout(() => setCopiedOptimized(false), 2000);
    } else {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Module 8
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Prompt Reliability Optimization & Engineering Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structural analysis of prompt ambiguities, boundary deficits, and automated generation of a high-fidelity verifiable prompt.
          </p>
        </div>

        <button
          onClick={() => onRunOptimized(optimization.optimizedPrompt)}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Execute Optimized Prompt Pipeline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>Original Prompt</span>
              </span>
              <button
                onClick={() => copyToClipboard(optimization.originalPrompt, false)}
                className="text-slate-400 hover:text-slate-200 text-xs flex items-center space-x-1 cursor-pointer"
              >
                {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copiedOriginal ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-sm text-slate-200 font-sans leading-relaxed">
              "{optimization.originalPrompt}"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
            Baseline user submission before constraint injection.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/40 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20 mb-3">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>TruthPrompt Optimized Version</span>
              </span>
              <button
                onClick={() => copyToClipboard(optimization.optimizedPrompt, true)}
                className="text-indigo-300 hover:text-indigo-100 text-xs flex items-center space-x-1 cursor-pointer"
              >
                {copiedOptimized ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copiedOptimized ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-sm text-indigo-100 font-sans leading-relaxed">
              "{optimization.optimizedPrompt}"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-500/20 text-[11px] text-indigo-300/80 flex items-center justify-between">
            <span>Enhanced with epistemic boundaries & verification constraints</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Prompt Vulnerability Critique & Gap Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Missing Context</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {optimization.critique.missingContext.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-2">
              <Sliders className="w-4 h-4" />
              <span>Ambiguities & Vagueness</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {optimization.critique.ambiguities.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Insufficient Constraints</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {optimization.critique.insufficientConstraints.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-3">
        <div>
          <span className="font-semibold text-slate-300 text-xs flex items-center space-x-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Applied Engineering Techniques:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {optimization.improvementsApplied.map((imp, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{imp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80">
          <span className="font-semibold text-slate-300">Theoretical Rationale: </span>
          <span className="text-slate-400">{optimization.optimizationRationale}</span>
        </div>
      </div>
    </div>
  );
};
