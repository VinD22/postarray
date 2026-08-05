/**
 * The client half of the deterministic pre-flight.
 *
 * The same codes, severities and parameters the API returns, computed locally
 * so the counter beside a field and the panel on the right agree instantly.
 * The server runs the identical rules at schedule and again before dispatch,
 * and its result replaces this one the moment it arrives. This is a faster
 * copy of the truth, never a second opinion.
 */

import {
  validationIssue,
  type ResolvedVariant,
  type ValidationIssue,
  type ValidationIssueInput,
} from '@relay/contracts';

import {
  acceptsMimeType,
  findUrls,
  allowsLinkInBody,
  mediaLimitFor,
  maxBytesFor,
  readCounter,
  type MediaFacts,
} from './capability-rules.js';
import type { TargetAccount } from '../types.js';

/**
 * The catalog stores a sentence per code under `validation.<code>.message`.
 * `validationIssue` defaults to the bare `validation.<code>`, so this wrapper
 * supplies the suffix once rather than at forty call sites.
 */
function issue(input: ValidationIssueInput): ValidationIssue {
  return validationIssue({
    ...input,
    messageKey: input.messageKey ?? `validation.${input.code.toLowerCase()}.message`,
  });
}

export interface DraftFacts {
  readonly resolved: ResolvedVariant;
  readonly media: readonly MediaFacts[];
  readonly unresolvedMentionCount: number;
  readonly destinationChosen: boolean;
  readonly privacyChosen: boolean;
  readonly altTextMissingCount: number;
  readonly rightsUndeclaredCount: number;
}

/** Every issue this target has right now, ordered blocking first. */
export function validateTarget(account: TargetAccount, facts: DraftFacts): ValidationIssue[] {
  const snapshot = account.capabilities;
  const targetId = account.connectionId;
  const provider = account.provider;
  const accountLabel = account.handle ?? account.displayName;
  const issues: ValidationIssue[] = [];
  const values = facts.resolved.values;

  const counter = readCounter(values.body, snapshot);
  if (counter.used === 0 && facts.media.length === 0) {
    issues.push(
      issue({
        code: 'TEXT_REQUIRED',
        severity: 'error',
        targetId,
        field: 'body',
        params: { provider },
      }),
    );
  }
  if (counter.level === 'over') {
    issues.push(
      issue({
        code: 'TEXT_TOO_LONG',
        severity: 'error',
        targetId,
        field: 'body',
        params: {
          over: counter.used - counter.limit,
          account: accountLabel,
          provider,
          limit: counter.limit,
        },
      }),
    );
  }
  if (counter.used > 0 && counter.used < snapshot.text.minLength) {
    issues.push(
      issue({
        code: 'TEXT_TOO_SHORT',
        severity: 'error',
        targetId,
        field: 'body',
        params: { provider, min: snapshot.text.minLength },
      }),
    );
  }

  if (findUrls(values.body).length > 0 && !allowsLinkInBody(snapshot)) {
    issues.push(
      issue({
        code: 'LINK_NOT_ALLOWED',
        severity: 'error',
        targetId,
        field: 'body',
        params: { provider },
      }),
    );
  }

  const hashtags = values.body.match(/(^|\s)#[\p{L}\p{N}_]+/gu) ?? [];
  if (hashtags.length > 10) {
    issues.push(
      issue({
        code: 'HASHTAG_COUNT_EXCEEDED',
        severity: 'warning',
        targetId,
        field: 'body',
        params: { count: hashtags.length, provider, limit: 10 },
      }),
    );
  }

  const mediaLimit = mediaLimitFor(snapshot, values.contentKind);
  if (facts.media.length > mediaLimit) {
    issues.push(
      issue({
        code: 'MEDIA_COUNT_EXCEEDED',
        severity: 'error',
        targetId,
        field: 'mediaIds',
        params: { provider, limit: mediaLimit, count: facts.media.length },
      }),
    );
  }
  for (const file of facts.media) {
    if (!acceptsMimeType(snapshot, file.mimeType)) {
      issues.push(
        issue({
          code: 'MEDIA_TYPE_UNSUPPORTED',
          severity: 'error',
          targetId,
          field: 'mediaIds',
          params: { provider, mimeType: file.mimeType },
        }),
      );
    }
    const maxBytes = maxBytesFor(snapshot, file.kind);
    if (maxBytes !== null && file.bytes > maxBytes) {
      issues.push(
        issue({
          code: 'MEDIA_FILE_TOO_LARGE',
          severity: 'error',
          targetId,
          field: 'mediaIds',
          params: { provider, actual: file.bytes, limit: maxBytes },
        }),
      );
    }
  }
  const hasImage = facts.media.some((file) => file.kind === 'image' || file.kind === 'gif');
  const hasVideo = facts.media.some((file) => file.kind === 'video');
  if (hasImage && hasVideo && snapshot.media.maxVideos > 0 && snapshot.media.maxImages > 0) {
    issues.push(
      issue({
        code: 'MEDIA_MIXED_TYPES_UNSUPPORTED',
        severity: 'warning',
        targetId,
        field: 'mediaIds',
        params: { provider },
      }),
    );
  }

  if (facts.altTextMissingCount > 0 && snapshot.media.altText === 'supported') {
    issues.push(
      issue({
        code: 'ALT_TEXT_MISSING',
        severity: 'warning',
        targetId,
        field: 'mediaIds',
        params: { count: facts.altTextMissingCount },
      }),
    );
  }

  if (facts.unresolvedMentionCount > 0) {
    issues.push(
      issue({
        code: 'MENTION_UNRESOLVED',
        severity: 'warning',
        targetId,
        field: 'mentions',
        params: { count: facts.unresolvedMentionCount },
      }),
    );
  }

  const destination = snapshot.destinations.find(
    (entry) => entry.kind !== 'none' && entry.support === 'supported',
  );
  if (destination && !facts.destinationChosen) {
    issues.push(
      issue({
        code: 'DESTINATION_REQUIRED',
        severity: 'error',
        targetId,
        field: 'destination',
        params: { provider },
      }),
    );
  }

  if (snapshot.privacy.mustBeExplicit && !facts.privacyChosen) {
    issues.push(
      issue({
        code: 'PRIVACY_SETTING_REQUIRED',
        severity: 'error',
        targetId,
        field: 'privacy',
        params: { provider },
      }),
    );
  }

  if (values.threadItems.length > 0) {
    if (snapshot.firstComment.support !== 'supported' && snapshot.threads.support !== 'supported') {
      issues.push(
        issue({
          code: 'FIRST_COMMENT_UNSUPPORTED',
          severity: 'error',
          targetId,
          field: 'threadItems',
          params: { provider },
        }),
      );
    }
    const maxItems = Math.max(snapshot.firstComment.maxItems, snapshot.threads.maxItems);
    if (values.threadItems.length > maxItems) {
      issues.push(
        issue({
          code: 'THREAD_UNSUPPORTED',
          severity: 'error',
          targetId,
          field: 'threadItems',
          params: { provider },
        }),
      );
    }
  }

  if (values.schedule?.repeat) {
    const { endDate, count } = values.schedule.repeat;
    if (endDate === null && count === null) {
      issues.push(
        issue({
          code: 'REPEAT_END_REQUIRED',
          severity: 'error',
          targetId,
          field: 'schedule',
          params: {},
        }),
      );
    }
  }

  if (account.paused) {
    issues.push(
      issue({
        code: 'CONNECTION_PAUSED',
        severity: 'error',
        targetId,
        params: { account: accountLabel },
      }),
    );
  }

  if (facts.rightsUndeclaredCount > 0) {
    issues.push(
      issue({
        code: 'MEDIA_INVALID',
        severity: 'error',
        targetId,
        field: 'mediaIds',
        messageKey: 'mediaLib.rights.blocking',
        params: { count: facts.rightsUndeclaredCount },
      }),
    );
  }

  const severityRank = { error: 0, warning: 1, info: 2 } as const;
  return issues.sort((left, right) => severityRank[left.severity] - severityRank[right.severity]);
}
