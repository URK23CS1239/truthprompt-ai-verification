import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Award,
} from 'lucide-react';
import { FactualClaim, ClaimVerificationStatus } from '../types';

interface ClaimExtractionViewProps {
  originalResponse: string;
  claims: FactualClaim[];
  modelUsed: string;
}

export const ClaimExtractionView: React.FC<ClaimExtractionViewProps> = ({
  originalResponse,
  claims,
  modelUsed,
}) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(claims[0]?.id || null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredClaims = claims.filter((claim) => {
    if (filterStatus !== 'all' && claim.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        claim.text.toLowerCase().includes(q) ||
        claim.reasoning.toLowerCase().includes(q) ||
        claim.claimType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: ClaimVerificationStatus) => {
    switch (status) {
      case 'supported':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>SUPPORTED</span>
          </span>
        );
      case 'contradicted':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>CONTRADICTED</span>
          </span>
        );
      case 'unverified':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>UNVERIFIED</span>
          </span>
        );
    }
  };

  const getClaimTypeBadge = (type: string) => {
    const formatted = type.replace('_', ' ').toUpperCase();
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
        {formatted}
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Module 3, 4 & 7
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Factual Claim Extraction & Explainable Verification
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Independently extracted atomic propositions cross-examined with retrieved authoritative citations and Natural Language Inference.
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <span>Target Generation:</span>
          <span className="font-mono text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            {modelUsed}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>Generated AI Response (Interactive Claim Overlay)</span>
          </span>
          <span className="text-[10px] text-slate-500">
            Hover or click highlighted sentences to inspect verification details
          </span>
        </div>

        <div className="text-sm text-slate-200 leading-relaxed font-sans space-y-2">
          <p>
            {claims.map((claim) => {
              const isSelected = selectedClaimId === claim.id;
              let highlightClass =
                claim.status === 'supported'
                  ? 'border-b-2 border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-100'
                  : claim.status === 'contradicted'
                  ? 'border-b-2 border-rose-500/80 bg-rose-500/15 hover:bg-rose-500/25 text-rose-100'
                  : 'border-b-2 border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/20 text-amber-100';

              if (isSelected) {
                highlightClass += ' ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 rounded px-1';
              }

              return (
                <span
                  key={claim.id}
                  onClick={() => setSelectedClaimId(claim.id)}
                  className={`cursor-pointer transition-all mx-0.5 px-0.5 py-0.5 rounded-sm inline ${highlightClass}`}
                  title={`[${claim.status.toUpperCase()}] Click to view evidence & reasoning`}
                >
                  {claim.text}{' '}
                </span>
              );
            })}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-4 text-[11px]">
          <span className="text-slate-400 font-medium">Status Legend:</span>
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Supported by Authoritative Evidence</span>
          </span>
          <span className="flex items-center space-x-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Contradicted (Detected Hallucination)</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Unverified (Inconclusive Reference Data)</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All ({claims.length})
          </button>
          <button
            onClick={() => setFilterStatus('supported')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterStatus === 'supported'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
            }`}
          >
            Supported ({claims.filter((c) => c.status === 'supported').length})
          </button>
          <button
            onClick={() => setFilterStatus('contradicted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterStatus === 'contradicted'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800'
            }`}
          >
            Contradicted ({claims.filter((c) => c.status === 'contradicted').length})
          </button>
          <button
            onClick={() => setFilterStatus('unverified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterStatus === 'unverified'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            Unverified ({claims.filter((c) => c.status === 'unverified').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claims or reasoning..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="space-y-3.5">
        {filteredClaims.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No claims match the selected filter.
          </div>
        ) : (
          filteredClaims.map((claim, index) => {
            const isSelected = selectedClaimId === claim.id;
            const isExpanded = expandedDetails[claim.id] ?? true;
            const evidenceItems =
              claim.status === 'contradicted'
                ? claim.contradictingEvidence || []
                : claim.supportingEvidence || [];

            const cardBorder =
              claim.status === 'supported'
                ? 'border-emerald-500/30 hover:border-emerald-500/60'
                : claim.status === 'contradicted'
                ? 'border-rose-500/40 hover:border-rose-500/70 bg-rose-950/10'
                : 'border-amber-500/30 hover:border-amber-500/60';

            return (
              <div
                key={claim.id}
                id={`claim-${claim.id}`}
                className={`rounded-xl border transition-all p-4 ${cardBorder} ${
                  isSelected ? 'ring-2 ring-indigo-500/50 bg-slate-800/40' : 'bg-slate-950/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/60">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-slate-400 font-semibold">
                      Claim #{index + 1}
                    </span>
                    {getStatusBadge(claim.status)}
                    {getClaimTypeBadge(claim.claimType)}
                    {claim.hallucinationType && claim.hallucinationType !== 'None' && (
                      <span className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <ShieldAlert className="w-3 h-3 text-rose-400" />
                        <span>{claim.hallucinationType}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Confidence: <strong className="text-slate-200">{claim.confidence}%</strong>
                    </span>
                    <button
                      onClick={() => toggleExpand(claim.id)}
                      className="text-slate-400 hover:text-slate-200 p-1 rounded transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-slate-100 font-sans leading-relaxed">
                    "{claim.text}"
                  </p>
                </div>

                {isExpanded && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-800/60 space-y-3">
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                      <div className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Explainable NLI Verification Rationale:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{claim.reasoning}</p>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>
                          {claim.status === 'contradicted' ? 'Refuting Reference Evidence' : 'Corroborating Sources'} ({evidenceItems.length})
                        </span>
                        {evidenceItems.length > 0 && (
                          <span className="text-[10px] text-slate-500">
                            Authoritative web grounding
                          </span>
                        )}
                      </div>

                      {evidenceItems.length === 0 ? (
                        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-500 italic">
                          No direct empirical citation retrieved exceeding the verification threshold. Categorized as unverified.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {evidenceItems.map((ev, sIdx) => (
                            <a
                              key={sIdx}
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all group block text-left"
                            >
                              <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className="font-semibold text-indigo-300 group-hover:text-indigo-200 truncate max-w-[200px]">
                                  {ev.title}
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                  Credibility {ev.credibilityScore}%
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 line-clamp-2 italic mb-2">
                                "{ev.snippet}"
                              </p>
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span className="font-mono text-slate-400">{ev.domain}</span>
                                <span className="flex items-center space-x-1 text-slate-400 group-hover:text-emerald-400">
                                  <span>Source link</span>
                                  <ExternalLink className="w-3 h-3" />
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
