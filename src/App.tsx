import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PromptInputSection } from './components/PromptInputSection';
import { VerificationResultsView } from './components/VerificationResultsView';
import { ComparativeBenchmarkView } from './components/ComparativeBenchmarkView';
import { EvaluationSuiteView } from './components/EvaluationSuiteView';
import { AuditHistoryView } from './components/AuditHistoryView';
import { MethodologyView } from './components/MethodologyView';
import {
  VerificationSession,
  BenchmarkTestCase,
  BenchmarkEvaluationReport,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'verify' | 'compare' | 'evaluation' | 'history' | 'methodology'>('verify');
  const [activeSession, setActiveSession] = useState<VerificationSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<VerificationSession[]>([]);
  const [benchmarkCases, setBenchmarkCases] = useState<BenchmarkTestCase[]>([]);
  const [benchmarkReport, setBenchmarkReport] = useState<BenchmarkEvaluationReport | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const historyRes = await fetch('/api/history');
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData);
          if (historyData.length > 0 && !activeSession) {
            setActiveSession(historyData[0]);
          }
        }

        const casesRes = await fetch('/api/benchmark/cases');
        if (casesRes.ok) {
          const casesData = await casesRes.json();
          setBenchmarkCases(casesData);
        }
      } catch (err) {
        console.warn('Backend API connection check:', err);
      }
    }
    init();
  }, []);

  const handleAnalyze = async (prompt: string, domain: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, domain }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Verification processing failed.');
      }

      const session: VerificationSession = await response.json();
      setActiveSession(session);
      setHistory((prev) => [session, ...prev.filter((s) => s.id !== session.id)]);
      setActiveTab('verify');
    } catch (err: any) {
      console.error('Audit execution error:', err);
      alert(`Verification Error: ${err.message || 'Check server connection.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunEvaluation = async (): Promise<BenchmarkEvaluationReport> => {
    const res = await fetch('/api/benchmark/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error('Evaluation failed to run.');
    }
    const report: BenchmarkEvaluationReport = await res.json();
    setBenchmarkReport(report);
    return report;
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      setHistory((prev) => prev.filter((s) => s.id !== id));
      if (activeSession?.id === id) {
        setActiveSession(history.find((s) => s.id !== id) || null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* 1. TruthPrompt logo and simple header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSession={activeSession}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {activeTab === 'verify' && (
          <div className="space-y-6">
            {/* 2. Subtitle, 3. Prompt input, 4. Verify button, 5. Loading indicator */}
            <PromptInputSection
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />

            {/* 6. Overall reliability, 7-9. Counts, 10. Claim results, 11. Explanations, 12. Evidence links */}
            {activeSession && (
              <VerificationResultsView session={activeSession} />
            )}
          </div>
        )}

        {/* Secondary Views (Accessible via navigation) */}
        {activeTab === 'compare' && (
          <div>
            {activeSession ? (
              <ComparativeBenchmarkView
                comparison={activeSession.comparison}
                originalPrompt={activeSession.prompt}
                optimizedPrompt={activeSession.optimization.optimizedPrompt}
                originalResponse={activeSession.originalResponse}
              />
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
                Run a verification on the main page first to view comparative benchmarking.
              </div>
            )}
          </div>
        )}

        {activeTab === 'evaluation' && (
          <EvaluationSuiteView
            initialReport={benchmarkReport}
            benchmarkCases={benchmarkCases}
            onRunEvaluation={handleRunEvaluation}
          />
        )}

        {activeTab === 'history' && (
          <AuditHistoryView
            history={history}
            onSelectSession={(s) => {
              setActiveSession(s);
              setActiveTab('verify');
            }}
            onDeleteSession={handleDeleteSession}
          />
        )}

        {activeTab === 'methodology' && (
          <MethodologyView />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <span>TruthPrompt • Explainable AI Response Verification</span>
          <span>Powered by Gemini 3.8 Flash & Grounded Evidence Retrieval</span>
        </div>
      </footer>
    </div>
  );
}
