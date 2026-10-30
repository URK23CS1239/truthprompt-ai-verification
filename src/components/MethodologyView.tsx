import React from 'react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-100">
        <h1 className="text-lg font-bold text-slate-900">
          TruthPrompt Methodology & Architectural Specification
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          An explainable AI framework for factual claim extraction, evidence-based verification, and hallucination detection.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          1. Problem Statement
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed font-sans">
          Generative AI models often synthesize statements that read convincingly while propagating factual inaccuracies, outdated figures, or ungrounded myths. TruthPrompt decomposes responses into atomic, independently verifiable propositions and tests each claim against authoritative reference corpora using Natural Language Inference (NLI).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          2. Tri-State Claim Verification Logic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="font-bold text-xs text-emerald-800">SUPPORTED</span>
            <p className="text-[11px] text-emerald-900 mt-1 leading-normal">
              Directly corroborated by reputable reference consensus with verifiable source citations.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
            <span className="font-bold text-xs text-rose-800">CONTRADICTED</span>
            <p className="text-[11px] text-rose-900 mt-1 leading-normal">
              Refuted by direct empirical citations or physical evidence (detected hallucination).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <span className="font-bold text-xs text-amber-800">UNVERIFIED</span>
            <p className="text-[11px] text-amber-900 mt-1 leading-normal">
              Available evidence is insufficient to confirm or deny. Not automatically marked as a hallucination.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          3. Mathematical Formulation of the Reliability Score
        </h2>
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 text-center">
          Score = max( 0, min( 100, round( [ (S × 1.0 + U × 0.35 - C × 1.75) / Total ] × 100 ) ) )
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Where <code className="font-semibold text-emerald-700">S</code> is supported claims (+1.00 weight), <code className="font-semibold text-amber-700">U</code> is unverified claims (+0.35 weight acknowledging open-world incompleteness), and <code className="font-semibold text-rose-700">C</code> is contradicted assertions (-1.75 severe penalty for hallucinations).
        </p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          4. Performance Optimization Pipeline
        </h2>
        <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
          <li><strong>Single-Turn Response & Extraction:</strong> Combines generative response synthesis and atomic claim extraction into one optimized call.</li>
          <li><strong>Persistent Claim Caching:</strong> Frequently audited assertions are cached with source and freshness metadata.</li>
          <li><strong>Deterministic Math Verification:</strong> Mathematical conversions and equations are evaluated locally without LLM latency.</li>
          <li><strong>Search Grounding Guardrails:</strong> Authoritative government (.gov), academic (.edu), and encyclopedia domains are prioritized.</li>
        </ul>
      </section>
    </div>
  );
};
