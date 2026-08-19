import type { Scope } from '@relay/contracts';
import type { z } from 'zod';

/**
 * The description of one HTTP operation.
 *
 * Every field that describes a payload holds the **same zod schema object the
 * controller parses with**, not a copy of it. That is the whole point: a
 * published specification that restates its validators drifts from them, and
 * the drift is always discovered by a customer rather than by a test.
 */
export interface OperationSpec {
  readonly method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  /** OpenAPI path with `{}` parameters, for example `/v1/projects/{id}`. */
  readonly path: string;
  readonly operationId: string;
  /** Sentence describing what the operation does. Documentation, not product copy. */
  readonly summary: string;
  readonly tag: string;
  readonly scopes?: readonly Scope[];
  readonly query?: z.ZodType;
  readonly body?: z.ZodType;
  readonly response?: z.ZodType;
  readonly successStatus?: number;
  /** Path parameter names, in the order they appear in `path`. */
  readonly pathParams?: readonly { name: string; schema: z.ZodType }[];
  readonly requiresIdempotencyKey?: boolean;
  readonly requiresStepUp?: boolean;
  readonly public?: boolean;
  /** True when the route is authenticated but not pinned to a workspace. */
  readonly workspaceOptional?: boolean;
}

export interface DocumentOptions {
  readonly serverUrl: string;
  readonly version: string;
}
