import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PromptInputSectionProps {
  onAnalyze: (prompt: string, domain: string) => Promise<void>;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  'Can you see the Great Wall of China from the moon or low Earth orbit with the naked eye?',
  'Did Albert Einstein fail mathematics in elementary school before special relativity?',
  'Detail the Apollo 11 lunar mission crew members, launch date, and touchdown lunar module name.',
  'How many bones are in an adult human skeleton compared to an infant?',
];

export const PromptInputSection: React.FC<PromptInputSectionProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [promptText, setPromptText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = promptText.trim();
    if (!trimmed) {
      setError('Please enter a question or claim to verify.');
      return;
    }
    setError(null);
    onAnalyze(trimmed, 'General Knowledge');
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Enter Prompt or Statement to Verify
          </label>
          <textarea
            value={promptText}
            onChange={(e) => {
              setPromptText(e.target.value);
              if (error) setError(null);
            }}
            disabled={isLoading}
            rows={3}
            placeholder="Type any factual question or statement (e.g. 'Can you see the Great Wall of China from the moon with the naked eye?')..."
            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors resize-none"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        )}

        {/* Quick select presets */}
        <div>
          <span className="text-xs text-slate-500 mr-2">Sample prompts:</span>
          <div className="inline-flex flex-wrap gap-1.5 mt-1">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setPromptText(sample);
                  setError(null);
                }}
                className="text-left text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                {sample.length > 50 ? `${sample.slice(0, 48)}...` : sample}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button & Loading State */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400">
            {isLoading ? (
              <span className="flex items-center text-slate-600 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2 text-emerald-600" />
                Cross-examining authoritative reference sources...
              </span>
            ) : (
              <span>Verification against peer consensus and official reference data</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !promptText.trim()}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify Response</span>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
