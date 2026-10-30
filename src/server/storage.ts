import fs from 'fs';
import path from 'path';
import { VerificationSession, BenchmarkTestCase, BenchmarkEvaluationReport } from '../types';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const BENCHMARK_FILE = path.join(DATA_DIR, 'benchmark_ground_truth.json');
const REPORTS_FILE = path.join(DATA_DIR, 'benchmark_reports.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getHistory(): VerificationSession[] {
  ensureDataDir();
  if (!fs.existsSync(HISTORY_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSession(session: VerificationSession): void {
  ensureDataDir();
  const history = getHistory();
  const updated = [session, ...history.filter((s) => s.id !== session.id)].slice(0, 50);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(updated, null, 2), 'utf-8');
}

export function getSessionById(id: string): VerificationSession | null {
  const history = getHistory();
  return history.find((s) => s.id === id) || null;
}

export function deleteSession(id: string): boolean {
  ensureDataDir();
  const history = getHistory();
  const filtered = history.filter((s) => s.id !== id);
  if (filtered.length !== history.length) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return false;
}

export function getBenchmarkCases(): BenchmarkTestCase[] {
  ensureDataDir();
  if (!fs.existsSync(BENCHMARK_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(BENCHMARK_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getBenchmarkReports(): BenchmarkEvaluationReport[] {
  ensureDataDir();
  if (!fs.existsSync(REPORTS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(REPORTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveBenchmarkReport(report: BenchmarkEvaluationReport): void {
  ensureDataDir();
  const reports = getBenchmarkReports();
  const updated = [report, ...reports].slice(0, 20);
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
}
