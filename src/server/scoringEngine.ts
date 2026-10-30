import { FactualClaim, ReliabilityMetrics } from '../types';

export function calculateReliabilityMetrics(claims: FactualClaim[]): ReliabilityMetrics {
  const totalClaims = claims.length;

  if (totalClaims === 0) {
    return {
      totalClaims: 0,
      supportedCount: 0,
      contradictedCount: 0,
      unverifiedCount: 0,
      verificationCoverage: 100,
      hallucinationRate: 0,
      reliabilityScore: 100,
      formulaExplanation: 'No factual claims identified in response. Baseline score assigned.',
      calculationBreakdown: {
        baseSupportedWeight: 1.0,
        unverifiedDiscount: 0.35,
        contradictedPenalty: 1.75,
        rawScore: 100,
        normalizedScore: 100,
      },
    };
  }

  const supportedCount = claims.filter((c) => c.status === 'supported').length;
  const contradictedCount = claims.filter((c) => c.status === 'contradicted').length;
  const unverifiedCount = claims.filter((c) => c.status === 'unverified').length;

  // Verification coverage: proportion of claims that could be conclusively resolved against evidence
  const verificationCoverage = Number((((supportedCount + contradictedCount) / totalClaims) * 100).toFixed(1));
  
  // Hallucination rate: proportion of contradicted assertions
  const hallucinationRate = Number(((contradictedCount / totalClaims) * 100).toFixed(1));

  // Transparent mathematical calculation
  const supportedWeight = 1.0;
  const unverifiedDiscount = 0.35;
  const contradictedPenalty = 1.75;

  const rawPoints =
    supportedCount * supportedWeight +
    unverifiedCount * unverifiedDiscount -
    contradictedCount * contradictedPenalty;

  const rawScore = (rawPoints / totalClaims) * 100;
  const normalizedScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  const formulaExplanation =
    `Score = max(0, min(100, round([(S × 1.0 + U × 0.35 - C × 1.75) / Total] × 100))) ` +
    `where S=${supportedCount} supported, U=${unverifiedCount} unverified, C=${contradictedCount} contradicted, Total=${totalClaims}. ` +
    `Note: Reliability score measures empirical grounding against retrieved external evidence and should not be construed as infallible mathematical certainty.`;

  return {
    totalClaims,
    supportedCount,
    contradictedCount,
    unverifiedCount,
    verificationCoverage,
    hallucinationRate,
    reliabilityScore: normalizedScore,
    formulaExplanation,
    calculationBreakdown: {
      baseSupportedWeight: supportedWeight,
      unverifiedDiscount,
      contradictedPenalty,
      rawScore: Number(rawScore.toFixed(2)),
      normalizedScore,
    },
  };
}
