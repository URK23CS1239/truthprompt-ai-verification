import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  generateAndExtract,
  verifyClaimsWithEvidence,
  optimizePrompt,
  benchmarkResponses,
} from './src/server/verificationEngine';
import { calculateReliabilityMetrics } from './src/server/scoringEngine';
import {
  saveSession,
  getHistory,
  getSessionById,
  deleteSession,
  getBenchmarkCases,
  getBenchmarkReports,
} from './src/server/storage';
import { runFullBenchmarkEvaluation } from './src/server/evaluationEngine';
import { VerificationSession } from './src/types';
import { hasGeminiApiKey } from './src/server/geminiClient';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiLiveActive: hasGeminiApiKey,
    model: 'gemini-3.1-flash-lite',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/verify', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { prompt, domain = 'General Knowledge' } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      res.status(400).json({ error: 'Prompt is required and must not be empty.' });
      return;
    }

    const trimmedPrompt = prompt.trim();

    // 1. Generate Response & Extract Claims in one fast call
    const genResult = await generateAndExtract(trimmedPrompt, domain);

    // 2. Verify Claims against evidence (with caching and local math)
    const verifiedClaims = await verifyClaimsWithEvidence(genResult.claims, trimmedPrompt);

    // 3. Calculate Reliability Metrics
    const metrics = calculateReliabilityMetrics(verifiedClaims);

    // 4. Prompt Optimization & Comparison (fast assessment)
    const optimization = await optimizePrompt(trimmedPrompt, verifiedClaims);
    const comparison = await benchmarkResponses(
      trimmedPrompt,
      genResult.text,
      verifiedClaims,
      optimization.optimizedPrompt
    );

    const session: VerificationSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      prompt: trimmedPrompt,
      domain,
      originalResponse: genResult.text,
      claims: verifiedClaims,
      metrics,
      optimization,
      comparison,
      processingTimeMs: Date.now() - startTime,
      modelUsed: genResult.model,
    };

    saveSession(session);

    res.json(session);
  } catch (error: any) {
    console.error('Verification error:', error);
    res.status(500).json({
      error: 'An error occurred during verification processing.',
      details: error?.message || String(error),
    });
  }
});

app.get('/api/history', (_req: Request, res: Response) => {
  try {
    const history = getHistory();
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve history', details: err?.message });
  }
});

app.get('/api/history/:id', (req: Request, res: Response) => {
  const session = getSessionById(req.params.id);
  if (!session) {
    res.status(404).json({ error: 'Verification session not found.' });
    return;
  }
  res.json(session);
});

app.delete('/api/history/:id', (req: Request, res: Response) => {
  const deleted = deleteSession(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Session not found or already deleted.' });
    return;
  }
  res.json({ success: true, id: req.params.id });
});

app.get('/api/benchmark/cases', (_req: Request, res: Response) => {
  res.json(getBenchmarkCases());
});

app.get('/api/benchmark/reports', (_req: Request, res: Response) => {
  res.json(getBenchmarkReports());
});

app.post('/api/benchmark/evaluate', async (_req: Request, res: Response) => {
  try {
    const report = await runFullBenchmarkEvaluation();
    res.json(report);
  } catch (err: any) {
    console.error('Benchmark evaluation error:', err);
    res.status(500).json({ error: 'Evaluation failed', details: err?.message });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TruthPrompt server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
