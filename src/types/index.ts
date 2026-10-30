export type ClaimVerificationStatus = 'supported' | 'contradicted' | 'unverified';

export type ClaimType =
  | 'statistical'
  | 'entity_relation'
  | 'chronological'
  | 'categorical'
  | 'definition'
  | 'general_factual';

export type SourceType =
  | 'academic'
  | 'government'
  | 'encyclopedia'
  | 'official_archive'
  | 'trusted_news'
  | 'web';

export interface EvidenceSource {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  sourceType: SourceType;
  credibilityScore: number; // 0 - 100
  publishedDate?: string;
}

export interface FactualClaim {
  id: string;
  text: string;
  claimType: ClaimType;
  status: ClaimVerificationStatus;
  confidence: number; // 0 - 100
  hallucinationType?: string; // e.g. "Factual Contradiction", "Fabricated Metric", "Temporal Anachronism", "Entity Confabulation", "None"
  reasoning: string;
  correctFact?: string; // The factual correction when claim is contradicted
  supportingEvidence: EvidenceSource[];
  contradictingEvidence?: EvidenceSource[];
  claimOrigin?: 'user_premise' | 'ai_response';
  isCached?: boolean;
  cachedAt?: string;
}

export interface ReliabilityMetrics {
  totalClaims: number;
  supportedCount: number;
  contradictedCount: number;
  unverifiedCount: number;
  verificationCoverage: number; // % of claims that could be verified (supported or contradicted)
  hallucinationRate: number; // % of claims contradicted
  reliabilityScore: number; // 0 - 100 calculated transparently
  formulaExplanation: string;
  calculationBreakdown: {
    baseSupportedWeight: number;
    unverifiedDiscount: number;
    contradictedPenalty: number;
    rawScore: number;
    normalizedScore: number;
  };
}

export interface PromptOptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  critique: {
    missingContext: string[];
    ambiguities: string[];
    insufficientConstraints: string[];
  };
  improvementsApplied: string[];
  optimizationRationale: string;
}

export interface BenchmarkMetrics {
  relevanceScore: number; // 0-100
  completenessScore: number; // 0-100
  clarityScore: number; // 0-100
  evidenceSupportScore: number; // 0-100
  factualConsistencyScore: number; // 0-100
  structuralScore: number; // 0-100
  reliabilityScore: number; // 0-100
  hallucinationRate: number; // %
  claimCount: number;
  supportedCount: number;
  contradictedCount: number;
  unverifiedCount: number;
}

export interface ComparativeBenchmark {
  originalMetrics: BenchmarkMetrics;
  optimizedMetrics: BenchmarkMetrics;
  optimizedResponse: string;
  optimizedClaims: FactualClaim[];
  overallVerdict: string;
  improvementDeltaPercent: number;
  comparisonHighlights: string[];
}

export interface VerificationSession {
  id: string;
  timestamp: string;
  prompt: string;
  domain: string;
  originalResponse: string;
  claims: FactualClaim[];
  metrics: ReliabilityMetrics;
  optimization: PromptOptimizationResult;
  comparison: ComparativeBenchmark;
  processingTimeMs: number;
  modelUsed: string;
}

export interface BenchmarkTestCase {
  id: string;
  title: string;
  category: string;
  prompt: string;
  groundTruthClaims: Array<{
    claim: string;
    expectedStatus: ClaimVerificationStatus;
    knownHallucination: boolean;
  }>;
  expectedHallucinationPresent: boolean;
  notes: string;
}

export interface BenchmarkEvaluationReport {
  timestamp: string;
  totalTestCases: number;
  claimExtractionPrecision: number;
  claimExtractionRecall: number;
  verificationAccuracy: number;
  claimClassification: {
    precision: number;
    recall: number;
    f1Score: number;
  };
  hallucinationDetection: {
    precision: number;
    recall: number;
    f1Score: number;
    truePositives: number;
    falsePositives: number;
    trueNegatives: number;
    falseNegatives: number;
  };
  avgEvidenceRelevance: number;
  avgProcessingTimeMs: number;
  promptImprovementAvgDelta: number;
  testCases: Array<{
    id: string;
    title: string;
    category: string;
    prompt: string;
    expectedHallucination: boolean;
    detectedHallucination: boolean;
    claimsExtracted: number;
    reliabilityScore: number;
    passed: boolean;
    latencyMs: number;
  }>;
}
