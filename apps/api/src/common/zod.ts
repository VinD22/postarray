import { ValidationFailedError } from '@relay/contracts';
import type { z } from 'zod';

/**
 * The single parse helper for every external boundary in this application.
 *
 * There is no cast anywhere in `apps/api`: a request body, a query string, a
 * route parameter, a provider callback and an inbound webhook payload all
 * arrive here first. A failure becomes a `ValidationFailedError` carrying the
 * field paths and issue codes, never the offending values, because the values
 * are attacker controlled and may contain credentials.
 */

export interface ParseOptions {
  /** Where the value came from. Appears in the problem document detail. */
  readonly source: 'body' | 'query' | 'params' | 'headers' | 'webhook' | 'provider';
}

const MAX_REPORTED_ISSUES = 20;

export function parseOrThrow<T extends z.ZodType>(
  schema: T,
  value: unknown,
  options: ParseOptions,
): z.infer<T> {
  const result = schema.safeParse(value);
  if (result.success) {
    return result.data;
  }
  throw new ValidationFailedError({
    details: {
      source: options.source,
      issues: result.error.issues.slice(0, MAX_REPORTED_ISSUES).map((issue) => ({
        path: issue.path.map((segment) => String(segment)).join('.'),
        code: issue.code,
      })),
    },
    cause: result.error,
  });
}

/** Parse a request body. */
export function parseBody<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  return parseOrThrow(schema, value, { source: 'body' });
}

/** Parse a query string object. Express gives strings; schemas coerce. */
export function parseQuery<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  return parseOrThrow(schema, value, { source: 'query' });
}

/** Parse route parameters, so a malformed id is a 422 and never a lookup. */
export function parseParams<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  return parseOrThrow(schema, value, { source: 'params' });
}
