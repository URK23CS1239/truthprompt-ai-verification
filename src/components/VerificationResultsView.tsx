import React from 'react';
import { ExternalLink, Clock, Database } from 'lucide-react';
import { VerificationSession } from '../types';

interface VerificationResultsViewProps {
  session: VerificationSession;
}

export const VerificationResultsView: React.FC<VerificationResultsViewProps> = ({ session }) => {
  const { metrics, claims, processingTimeMs, originalResponse } = session;

  return (
    <div className="space-y-6">
      {/* SECTION 1: OVERALL RELIABILITY SCORECARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Assessment Summary
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              OVERALL RELIABILITY: {metrics.reliabilityScore}/100
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Audited in {processingTimeMs} ms</span>
          </div>
        </div>

        {/* Counts Bar: SUPPORTED, CONTRADICTED, UNVERIFIED */}
        <div className="grid grid-cols-3 gap-3 pt-4 text-center">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
              SUPPORTED
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-0.5 font-mono">
              {metrics.supportedCount}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-rose-50 border border-rose-100">
            <div className="text-xs font-semibold text-rose-800 uppercase tracking-wide">
              CONTRADICTED
            </div>
            <div className="text-2xl font-bold text-rose-700 mt-0.5 font-mono">
              {metrics.contradictedCount}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
              UNVERIFIED
            </div>
            <div className="text-2xl font-bold text-amber-700 mt-0.5 font-mono">
              {metrics.unverifiedCount}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: AI-GENERATED RESPONSE */}
      {originalResponse && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            AI Generated Response
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
            {originalResponse}
          </p>
        </div>
      )}

      {/* SECTION 3: CLAIM VERIFICATION LIST */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
          CLAIM VERIFICATION ({claims.length} Extracted Claims)
        </div>

        <div className="space-y-4">
          {claims.map((claim, idx) => {
            const isSupported = claim.status === 'supported';
            const isContradicted = claim.status === 'contradicted';

            const statusClass = isSupported
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : isContradicted
              ? 'text-rose-700 bg-rose-50 border-rose-200'
              : 'text-amber-800 bg-amber-50 border-amber-200';

            const evidenceList = isContradicted
              ? claim.contradictingEvidence || []
              : claim.supportingEvidence || [];

            return (
              <div
                key={claim.id || idx}
                className="p-4 rounded-lg border border-slate-200 bg-white space-y-3"
              >
                {/* Header: Claim Number & Origin */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">Claim {idx + 1}</span>
                    {claim.claimOrigin === 'user_premise' ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        Original User Premise
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        AI Statement
                      </span>
                    )}
                  </div>

                  {claim.isCached && (
                    <span className="flex items-center space-x-1 text-[10px] text-slate-500 font-medium">
                      <Database className="w-3 h-3 text-slate-400" />
                      <span>Cached {claim.cachedAt ? `(${claim.cachedAt})` : ''}</span>
                    </span>
                  )}
                </div>

                {/* Statement */}
                <p className="text-xs text-slate-900 font-medium leading-relaxed">
                  "{claim.text}"
                </p>

                {/* Status Badge */}
                <div className="text-xs">
                  <span className="text-slate-500 font-medium mr-2">Status:</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${statusClass}`}
                  >
                    {claim.status.toUpperCase()}
                  </span>
                  {claim.hallucinationType && claim.hallucinationType !== 'None' && (
                    <span className="ml-2 text-[11px] text-rose-600 font-medium">
                      ({claim.hallucinationType})
                    </span>
                  )}
                </div>

                {/* Correct Fact (when contradicted) */}
                {claim.status === 'contradicted' && claim.correctFact && (
                  <div className="text-xs text-rose-800 bg-rose-50/70 px-3 py-2 rounded-md border border-rose-200">
                    <span className="font-semibold text-rose-950">Correct fact: </span>
                    <span className="text-rose-900">{claim.correctFact}</span>
                  </div>
                )}

                {/* Explanation: 1-2 concise sentences */}
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Explanation: </span>
                  <span>{claim.reasoning}</span>
                </div>

                {/* Evidence Links */}
                <div className="text-xs pt-1 border-t border-slate-100">
                  <span className="font-semibold text-slate-700 block mb-1">Evidence:</span>
                  {evidenceList.length > 0 ? (
                    <div className="space-y-1">
                      {evidenceList.map((ev, sIdx) => (
                        <div key={sIdx} className="flex items-baseline space-x-2">
                          <span className="text-slate-400">•</span>
                          <a
                            href={ev.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:text-emerald-800 hover:underline font-medium inline-flex items-center space-x-1"
                          >
                            <span>{ev.title || ev.domain}</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                          <span className="text-slate-400 text-[11px]">({ev.domain})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">
                      No direct empirical citation retrieved. Unverified.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
