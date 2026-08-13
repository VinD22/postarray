export {
  DIGEST_RECEIPT_OUTCOMES,
  INSIGHT_KINDS_STORED,
  digestReceiptOutcomeSchema,
  storedInsightKindSchema,
} from './types';
export type {
  BaselineResultLike,
  DigestInsightRow,
  DigestMetricInput,
  DigestMetricLine,
  DigestProviderSummary,
  DigestReceipt,
  DigestReceiptOutcome,
  DigestUnavailableLine,
  FreshnessReportLike,
  InsightLike,
  NormalizedMetricLike,
  StoredInsightKind,
} from './types';

export { DIGEST_CONFIDENCES, digestObservationSchema, weeklyDigestResultSchema } from './schema';
export type { DigestObservation, WeeklyDigestResult } from './schema';

export { buildDigestRetrieval, numbersIn } from './retrieval';
export type { DigestRetrieval, DigestRetrievalInput } from './retrieval';

export { DIGEST_FLOOR_KEYS, buildDigestFloor, emailDigestRows } from './floor';
export type { DigestFloor, DigestFloorInput } from './floor';

export { DIGEST_REJECTION_RULES, allowedNumbersFor, postProcessDigest } from './postprocess';
export type {
  DigestPostProcessInput,
  DigestPostProcessResult,
  DigestRejectionRule,
  DigestViolation,
} from './postprocess';

export {
  DIGEST_FALLBACK_REASONS,
  DIGEST_NARRATIVE_KEYS,
  DIGEST_SOURCES,
  generateWeeklyDigest,
} from './pipeline';
export type {
  DigestFallbackReason,
  DigestSource,
  GenerateDigestInput,
  GeneratedDigest,
} from './pipeline';
