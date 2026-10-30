import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { ComparativeBenchmark } from '../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ComparativeBenchmarkViewProps {
  comparison: ComparativeBenchmark;
  originalPrompt: string;
  optimizedPrompt: string;
  originalResponse: string;
}

export const ComparativeBenchmarkView: React.FC<ComparativeBenchmarkViewProps> = ({
  comparison,
  originalResponse,
}) => {
  const mOrig = comparison.originalMetrics;
  const mOpt = comparison.optimizedMetrics;

  const radarData = {
    labels: [
      'Evidence Support',
      'Factual Consistency',
      'Structural Rigor',
      'Clarity',
      'Completeness',
      'Relevance',
    ],
    datasets: [
      {
        label: 'Original Response',
        data: [
          mOrig.evidenceSupportScore,
          mOrig.factualConsistencyScore,
          mOrig.structuralScore,
          mOrig.clarityScore,
          mOrig.completenessScore,
          mOrig.relevanceScore,
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#ef4444',
        borderWidth: 1.5,
        pointBackgroundColor: '#ef4444',
      },
      {
        label: 'Optimized Response',
        data: [
          mOpt.evidenceSupportScore,
          mOpt.factualConsistencyScore,
          mOpt.structuralScore,
          mOpt.clarityScore,
          mOpt.completenessScore,
          mOpt.relevanceScore,
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10b981',
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: '#e2e8f0' },
        grid: { color: '#f1f5f9' },
        pointLabels: {
          color: '#475569',
          font: { size: 11, family: 'system-ui' },
        },
        ticks: {
          color: '#94a3b8',
          backdropColor: 'transparent',
          stepSize: 20,
        },
        suggestedMin: 30,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#334155',
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Comparative Response Benchmarking
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-by-side performance evaluation of baseline vs. prompt-hardened responses.
          </p>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
          +{comparison.improvementDeltaPercent}% Reliability Gain
        </div>
      </div>

      {/* Side-by-side comparison score tiles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
          <div className="text-xs text-slate-600 font-medium">Original Prompt Reliability</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {mOrig.reliabilityScore}/100
          </div>
          <div className="text-xs text-rose-600 mt-1">
            {mOrig.contradictedCount} Hallucinations ({mOrig.hallucinationRate}%)
          </div>
        </div>

        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
          <div className="text-xs text-emerald-800 font-medium">Optimized Prompt Reliability</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
            {mOpt.reliabilityScore}/100
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            {mOpt.contradictedCount} Hallucinations ({mOpt.hallucinationRate}%)
          </div>
        </div>
      </div>

      {/* Radar Chart & Metric Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="h-64 p-2 bg-slate-50/50 rounded-lg border border-slate-100 flex flex-col justify-center">
          <Radar data={radarData} options={radarOptions} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Evaluation Metric</th>
                <th className="py-2 px-3 text-center">Original</th>
                <th className="py-2 px-3 text-center text-emerald-700">Optimized</th>
                <th className="py-2 px-3 text-right">Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700">Evidence Support</td>
                <td className="py-2 px-3 text-center text-slate-600">{mOrig.evidenceSupportScore}%</td>
                <td className="py-2 px-3 text-center text-emerald-700 font-bold">{mOpt.evidenceSupportScore}%</td>
                <td className="py-2 px-3 text-right text-emerald-600">+{mOpt.evidenceSupportScore - mOrig.evidenceSupportScore}%</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700">Factual Consistency</td>
                <td className="py-2 px-3 text-center text-slate-600">{mOrig.factualConsistencyScore}%</td>
                <td className="py-2 px-3 text-center text-emerald-700 font-bold">{mOpt.factualConsistencyScore}%</td>
                <td className="py-2 px-3 text-right text-emerald-600">+{mOpt.factualConsistencyScore - mOrig.factualConsistencyScore}%</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700">Structural Rigor</td>
                <td className="py-2 px-3 text-center text-slate-600">{mOrig.structuralScore}%</td>
                <td className="py-2 px-3 text-center text-emerald-700 font-bold">{mOpt.structuralScore}%</td>
                <td className="py-2 px-3 text-right text-emerald-600">+{mOpt.structuralScore - mOrig.structuralScore}%</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700">Completeness</td>
                <td className="py-2 px-3 text-center text-slate-600">{mOrig.completenessScore}%</td>
                <td className="py-2 px-3 text-center text-emerald-700 font-bold">{mOpt.completenessScore}%</td>
                <td className="py-2 px-3 text-right text-emerald-600">+{mOpt.completenessScore - mOrig.completenessScore}%</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700">Hallucinations</td>
                <td className="py-2 px-3 text-center text-rose-600 font-bold">{mOrig.contradictedCount}</td>
                <td className="py-2 px-3 text-center text-emerald-700 font-bold">{mOpt.contradictedCount}</td>
                <td className="py-2 px-3 text-right text-emerald-600">-{mOrig.contradictedCount - mOpt.contradictedCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Text Diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
            Original AI Response
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line">
            {originalResponse}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1.5">
            Optimized AI Response (Grounded)
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
            {comparison.optimizedResponse}
          </p>
        </div>
      </div>
    </div>
  );
};
