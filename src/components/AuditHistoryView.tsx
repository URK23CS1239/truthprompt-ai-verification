import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import { VerificationSession } from '../types';

interface AuditHistoryViewProps {
  history: VerificationSession[];
  onSelectSession: (session: VerificationSession) => void;
  onDeleteSession: (id: string) => void;
}

export const AuditHistoryView: React.FC<AuditHistoryViewProps> = ({
  history,
  onSelectSession,
  onDeleteSession,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Verification History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Past verified prompts, reliability scores, and extracted claims.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          {history.length} Audits
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No audits archived yet. Enter a prompt on the main page to begin.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Prompt</th>
                <th className="py-2.5 px-3 text-center">Score</th>
                <th className="py-2.5 px-3 text-center">Claims (S/C/U)</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((s) => {
                const score = s.metrics.reliabilityScore;
                const scoreColor =
                  score >= 70
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : score >= 40
                    ? 'text-amber-800 bg-amber-50 border-amber-200'
                    : 'text-rose-700 bg-rose-50 border-rose-200';

                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(s.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 max-w-sm truncate">
                      {s.prompt}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${scoreColor}`}>
                        {score}/100
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-[11px]">
                      <span className="text-emerald-600">{s.metrics.supportedCount}</span> /{' '}
                      <span className="text-rose-600">{s.metrics.contradictedCount}</span> /{' '}
                      <span className="text-amber-600">{s.metrics.unverifiedCount}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onSelectSession(s)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center space-x-1"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteSession(s.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
