import {
  API_HEADERS,
  API_VERSION,
  PROBLEM_JSON_CONTENT_TYPE,
  problemJsonSchema,
} from '@relay/contracts';
import { z } from 'zod';

import { WORKSPACE_HEADER } from '../guards/workspace.guard.js';
import { OPERATIONS } from './catalog.js';
import type { DocumentOptions, OperationSpec } from './types.js';

/**
 * OpenAPI 3.1, generated from the zod schemas the API actually validates with.
 *
 * There is no hand-written specification anywhere in this repository, and no
 * decorator restating a field the validator already knows about. The schema
 * objects referenced by `OPERATIONS` are the same objects the controllers pass
 * to `parseBody` and `parseQuery`, so a field that changes shape changes in the
 * published document in the same commit. A specification that can disagree with
 * the server is worse than no specification, because clients believe it.
 *
 * 3.1 rather than 3.0 because 3.1 is a superset of JSON Schema 2020-12, which
 * is exactly what `z.toJSONSchema` emits, so nothing has to be down-converted
 * and lossy.
 */

type JsonSchema = Record<string, unknown>;

const OPENAPI_VERSION = '3.1.0';
const JSON_SCHEMA_DIALECT = 'https://json-schema.org/draft/2020-12/schema';

function toJsonSchema(schema: z.ZodType): JsonSchema {
  return z.toJSONSchema(schema, {
    target: 'draft-2020-12',
    // Unrepresentable pieces (a transform's runtime behaviour, a refinement's
    // predicate) are described by their input shape rather than dropped
    // silently, so the document stays honest about what is accepted.
    unrepresentable: 'any',
    io: 'input',
  }) as JsonSchema;
}

/** Query parameters, flattened from the object schema into OpenAPI parameters. */
function queryParameters(schema: z.ZodType): readonly JsonSchema[] {
  const json = toJsonSchema(schema);
  const properties = json['properties'];
  if (typeof properties !== 'object' || properties === null) {
    return [];
  }
  const required = Array.isArray(json['required']) ? (json['required'] as string[]) : [];
  return Object.entries(properties as Record<string, JsonSchema>).map(([name, value]) => ({
    name,
    in: 'query',
    required: required.includes(name),
    schema: value,
  }));
}

function headerParameters(operation: OperationSpec): readonly JsonSchema[] {
  const headers: JsonSchema[] = [];
  if (operation.public !== true && operation.workspaceOptional !== true) {
    headers.push({
      name: WORKSPACE_HEADER,
      in: 'header',
      required: false,
      description:
        'Pins the workspace for this request. Optional for credentials that are bound to exactly one workspace.',
      schema: { type: 'string' },
    });
  }
  if (operation.requiresIdempotencyKey === true) {
    headers.push({
      name: API_HEADERS.idempotencyKey,
      in: 'header',
      required: true,
      description:
        'Required. Scoped to (workspace, key) for 24 hours. Replaying with the same body returns the stored response; replaying with a different body is a 409.',
      schema: { type: 'string', minLength: 8, maxLength: 255 },
    });
  }
  headers.push({
    name: API_HEADERS.correlationId,
    in: 'header',
    required: false,
    description: 'Echoed on the response and carried into every log line, receipt and webhook.',
    schema: { type: 'string' },
  });
  return headers;
}

function problemResponse(description: string): JsonSchema {
  return {
    description,
    content: { [PROBLEM_JSON_CONTENT_TYPE]: { schema: { $ref: '#/components/schemas/Problem' } } },
  };
}

function operationObject(operation: OperationSpec): JsonSchema {
  const parameters: JsonSchema[] = [
    ...(operation.pathParams ?? []).map((parameter) => ({
      name: parameter.name,
      in: 'path',
      required: true,
      schema: toJsonSchema(parameter.schema),
    })),
    ...(operation.query === undefined ? [] : queryParameters(operation.query)),
    ...headerParameters(operation),
  ];

  const responses: Record<string, JsonSchema> = {
    [String(operation.successStatus ?? 200)]: {
      description: 'Success.',
      ...(operation.response === undefined
        ? {}
        : { content: { 'application/json': { schema: toJsonSchema(operation.response) } } }),
    },
    '401': problemResponse('No credential, or a credential that is not live.'),
    '403': problemResponse('Authenticated, but not permitted. Includes missing scopes.'),
    '404': problemResponse(
      'Not found. Returned instead of 403 for a resource in another workspace, so existence is not disclosed.',
    ),
    '422': problemResponse('The request did not parse against the schema for this operation.'),
    '429': problemResponse('Rate limited. Carries the remaining budget and the reset instant.'),
  };
  if (operation.requiresIdempotencyKey === true) {
    responses['409'] = problemResponse(
      'The idempotency key was already used for a different request body.',
    );
  }

  return {
    operationId: operation.operationId,
    summary: operation.summary,
    tags: [operation.tag],
    ...(parameters.length === 0 ? {} : { parameters }),
    ...(operation.body === undefined
      ? {}
      : {
          requestBody: {
            required: true,
            content: { 'application/json': { schema: toJsonSchema(operation.body) } },
          },
        }),
    responses,
    ...(operation.public === true
      ? { security: [] }
      : {
          security: [
            { sessionCookie: [] },
            { bearerToken: operation.scopes ?? [] },
            { apiKey: [] },
          ],
        }),
    ...(operation.requiresStepUp === true
      ? {
          'x-relay-step-up': true,
          description:
            'Requires a second factor, or a password re-entry, satisfied within the last ten minutes.',
        }
      : {}),
  };
}

/** Build the complete document. Pure: the same inputs give the same bytes. */
export function buildOpenApiDocument(options: DocumentOptions): JsonSchema {
  const paths: Record<string, Record<string, JsonSchema>> = {};
  for (const operation of OPERATIONS) {
    const entry = paths[operation.path] ?? {};
    entry[operation.method] = operationObject(operation);
    paths[operation.path] = entry;
  }

  return {
    openapi: OPENAPI_VERSION,
    jsonSchemaDialect: JSON_SCHEMA_DIALECT,
    info: {
      title: 'Relay API',
      version: options.version,
      summary: 'Multi-tenant social publishing control plane.',
      description: [
        'Every list endpoint is cursor paginated and every time range is qualified with an',
        'IANA time zone. Every create, schedule, publish and cancel requires an',
        '`Idempotency-Key`. Every asynchronous operation returns an operation reference',
        'rather than blocking. Errors are RFC 9457 problem documents carrying a stable',
        'machine code and a message key that resolves through the product message catalog,',
        'so a client renders text in the caller’s language rather than the server’s.',
      ].join(' '),
      license: { name: 'Proprietary', identifier: 'LicenseRef-Relay-Proprietary' },
    },
    servers: [{ url: options.serverUrl, description: 'This deployment.' }],
    'x-relay-api-version': API_VERSION,
    components: {
      securitySchemes: {
        sessionCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: 'relay_session',
          description:
            'Browser session. State-changing requests additionally require a signed double-submit CSRF token and an allowlisted Origin.',
        },
        bearerToken: {
          type: 'http',
          scheme: 'bearer',
          description:
            'An opaque reference access token from the OAuth authorization server. Revocation takes effect within seconds because the token is a reference, not a JWT.',
        },
        apiKey: {
          type: 'http',
          scheme: 'bearer',
          description:
            'A workspace API key (`rly_ak_...`). Bound to one workspace, always has an expiry, and may be restricted to a source CIDR range.',
        },
      },
      schemas: {
        Problem: toJsonSchema(problemJsonSchema),
      },
    },
    paths,
    tags: [...new Set(OPERATIONS.map((operation) => operation.tag))].map((name) => ({ name })),
  };
}
