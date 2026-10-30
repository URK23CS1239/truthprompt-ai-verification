import React, { useState } from 'react';
import {
  ShieldCheck,
  Download,
  FileText,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { VerificationSession } from '../types';
import { downloadPdfReport, downloadMarkdownReport, downloadJsonReport } from '../utils/reportGenerator';

interface NavbarProps {
  activeTab: 'verify' | 'compare' | 'evaluation' | 'history' | 'methodology';
  setActiveTab: (tab: 'verify' | 'compare' | 'evaluation' | 'history' | 'methodology') => void;
  activeSession: VerificationSession | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeSession,
}) => {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Subtitle */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => setActiveTab('verify')}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">
                  TruthPrompt
                </span>
                <span className="text-xs text-slate-500 font-normal hidden sm:inline">
                  AI Response Verification
                </span>
              </div>
            </div>
          </div>

          {/* Clean Secondary Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'verify'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Verify
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'compare'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Compare
            </button>

            <button
              onClick={() => setActiveTab('evaluation')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'evaluation'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Evaluation
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              History
            </button>

            <button
              onClick={() => setActiveTab('methodology')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'methodology'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Methodology
            </button>

            {/* Clean Export Button */}
            {activeSession && (
              <div className="relative ml-2">
                <button
                  onClick={() => setExportOpen(!exportOpen)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export</span>
                </button>

                {exportOpen && (
                  <div
                    className="absolute right-0 mt-1.5 w-44 rounded-lg bg-white border border-slate-200 shadow-md py-1 z-50 text-xs"
                    onClick={() => setExportOpen(false)}
                  >
                    <button
                      onClick={() => downloadPdfReport(activeSession)}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>PDF Document</span>
                    </button>
                    <button
                      onClick={() => downloadMarkdownReport(activeSession)}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2 border-t border-slate-100"
                    >
                      <Sparkles className="w-4 h-4 text-slate-500" />
                      <span>Markdown (.md)</span>
                    </button>
                    <button
                      onClick={() => downloadJsonReport(activeSession)}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2 border-t border-slate-100"
                    >
                      <FileCode className="w-4 h-4 text-slate-500" />
                      <span>Raw JSON</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
