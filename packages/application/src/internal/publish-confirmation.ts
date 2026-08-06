import type { PublishConfirmationEvidence } from '../types';

/**
 * True only when the person reviewed the exact immutable version and the exact
 * number of external publications the server is about to create.
 */
export function confirmationMatchesContent(
  evidence: PublishConfirmationEvidence,
  subject: { readonly targetCount: number; readonly checksum: string },
): boolean {
  return (
    evidence.acknowledgedTargetCount === subject.targetCount &&
    evidence.acknowledgedVersionChecksum === subject.checksum
  );
}

/**
 * Escalation acknowledgement is an exact set comparison. Missing a warning is
 * unsafe, while accepting stale or invented warnings obscures what the person
 * actually reviewed.
 */
export function confirmationMatchesEscalations(
  evidence: PublishConfirmationEvidence,
  requiredCodes: readonly string[],
): boolean {
  const required = [...new Set(requiredCodes)].sort();
  const acknowledged = [...new Set(evidence.acknowledgedEscalations)].sort();
  return (
    required.length === acknowledged.length &&
    required.every((code, index) => code === acknowledged[index])
  );
}
