import fs from 'fs';
import path from 'path';
import { FactualClaim } from '../types';

const CACHE_FILE = path.resolve(process.cwd(), 'data', 'claims_cache.json');
const TTL_HOURS = 72; // 3 days cache freshness

interface CachedEntry {
  claim: FactualClaim;
  timestamp: string;
}

const memoryCache = new Map<string, CachedEntry>();

function normalizeKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

export function initCache(): void {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        for (const item of data) {
          if (item?.claim?.text) {
            memoryCache.set(normalizeKey(item.claim.text), item);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not load claims cache:', err);
  }
}

export function getCachedClaim(text: string): FactualClaim | null {
  const key = normalizeKey(text);
  const entry = memoryCache.get(key);
  if (!entry) return null;

  const ageHours = (Date.now() - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60);
  if (ageHours > TTL_HOURS) {
    memoryCache.delete(key);
    return null;
  }

  return {
    ...entry.claim,
    isCached: true,
    cachedAt: new Date(entry.timestamp).toLocaleDateString(),
  };
}

export function setCachedClaim(claim: FactualClaim): void {
  const key = normalizeKey(claim.text);
  const entry: CachedEntry = {
    claim,
    timestamp: new Date().toISOString(),
  };
  memoryCache.set(key, entry);

  // Debounced or non-blocking disk persistence
  try {
    const list = Array.from(memoryCache.values()).slice(-200); // keep recent 200
    fs.writeFileSync(CACHE_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to persist claims cache:', err);
  }
}

// Deterministic local verification for math and basic conversions
export function evaluateLocalMath(claimText: string): FactualClaim | null {
  const textLower = claimText.toLowerCase();

  // Pattern: 13,000 miles is ~20,900 / 21,196 km
  const milesKmMatch = textLower.match(/(\d[\d,.]*)\s*(?:miles|mi)\b.*?(?:is|equals|equal to|approximately|\()\s*(\d[\d,.]*)\s*(?:kilometers|km)\b/i);
  if (milesKmMatch) {
    const miles = parseFloat(milesKmMatch[1].replace(/,/g, ''));
    const km = parseFloat(milesKmMatch[2].replace(/,/g, ''));
    const expectedKm = miles * 1.60934;
    const diff = Math.abs(km - expectedKm) / expectedKm;
    const isCorrect = diff < 0.05; // within 5% tolerance

    return {
      id: `math-${Date.now()}`,
      text: claimText,
      claimType: 'statistical',
      status: isCorrect ? 'supported' : 'contradicted',
      confidence: 100,
      hallucinationType: isCorrect ? 'None' : 'Fabricated Metric / Mathematical Error',
      reasoning: isCorrect
        ? `Deterministic calculation: ${miles.toLocaleString()} miles converts to ${Math.round(expectedKm).toLocaleString()} km, which matches the claim within 5% variance.`
        : `Deterministic calculation refutes: ${miles.toLocaleString()} miles is approximately ${Math.round(expectedKm).toLocaleString()} km, not ${km.toLocaleString()} km.`,
      supportingEvidence: isCorrect
        ? [
            {
              title: 'Standard International Unit Conversion (NIST)',
              url: 'https://www.nist.gov/pml/weights-and-measures/metric-conversion-factors',
              domain: 'nist.gov',
              snippet: '1 mile = 1.609344 kilometers (exact NIST standard conversion).',
              sourceType: 'government',
              credibilityScore: 100,
            },
          ]
        : [],
      contradictingEvidence: isCorrect
        ? []
        : [
            {
              title: 'Standard International Unit Conversion (NIST)',
              url: 'https://www.nist.gov/pml/weights-and-measures/metric-conversion-factors',
              domain: 'nist.gov',
              snippet: '1 mile = 1.609344 kilometers (exact NIST standard conversion).',
              sourceType: 'government',
              credibilityScore: 100,
            },
          ],
      isCached: false,
    };
  }

  return null;
}

// Initialize on load
initCache();
