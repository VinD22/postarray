import type { StoredInsight } from './insights-queries';
import type { AnalyticsRange, Observation } from './types';

/**
 * Stored per-post verdicts, as overview observations.
 *
 * Only `above` and `below` become observations: `similar` says nothing worth a
 * sentence and `insufficient_data` is not a finding. A row without a numeric
 * effect size or sample size is dropped rather than rendered with a zero,
 * because a missing number is unavailable, never 0.
 */
export function storedObservations(
  insights: readonly StoredInsight[],
  range: AnalyticsRange,
): readonly Observation[] {
  const start = Date.parse(range.start);
  const end = Date.parse(range.end);
  const out: Observation[] = [];
  for (const insight of insights) {
    if (insight.kind !== 'post_feedback') continue;
    const created = Date.parse(insight.createdAt);
    if (!(created >= start && created <= end)) continue;
    const args = insight.messageArgs;
    const verdict = args.verdict;
    const effect = args.effectSize;
    const metric = args.metric;
    if (verdict !== 'above' && verdict !== 'below') continue;
    if (typeof effect !== 'number' || !Number.isFinite(effect)) continue;
    if (typeof metric !== 'string' || insight.sampleSize === null) continue;
    out.push({
      id: insight.id,
      kind: verdict === 'above' ? 'above_baseline' : 'below_baseline',
      citedPostIds: insight.contentItemId === null ? [] : [insight.contentItemId],
      periodStart: range.start,
      periodEnd: range.end,
      confounders: [],
      sampleSize: insight.sampleSize,
      values: { percent: Math.abs(effect), metric, count: insight.sampleSize },
      storedMessageKey:
        verdict === 'above' ? 'insight.observation.above' : 'insight.observation.below',
    });
  }
  return out;
}
