import { API_VERSION } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { OPERATIONS } from './catalog';
import { buildOpenApiDocument } from './document';

/**
 * The published specification.
 *
 * These assertions are about the properties a client depends on, not about the
 * exact bytes: a snapshot test here would break on every new route and teach
 * people to re-record it without reading it.
 */
const document = buildOpenApiDocument({
  serverUrl: 'https://api.relay.test',
  version: API_VERSION,
});

function operation(path: string, method: string): Record<string, unknown> {
  const paths = document['paths'];
  if (typeof paths !== 'object' || paths === null) {
    throw new Error('The document has no paths.');
  }
  const entry = Object.entries(paths).find(([candidate]) => candidate === path)?.[1];
  if (typeof entry !== 'object' || entry === null) {
    throw new Error(`No path ${path}`);
  }
  const found = Object.entries(entry).find(([candidate]) => candidate === method)?.[1];
  if (typeof found !== 'object' || found === null) {
    throw new Error(`No ${method} ${path}`);
  }
  return Object.fromEntries(Object.entries(found));
}

function parameters(path: string, method: string): Record<string, unknown>[] {
  const value = operation(path, method)['parameters'];
  return Array.isArray(value)
    ? value.map((entry) => Object.fromEntries(Object.entries(entry)))
    : [];
}

describe('openapi document', () => {
  it('is OpenAPI 3.1 with the 2020-12 JSON Schema dialect', () => {
    expect(document['openapi']).toBe('3.1.0');
    // 3.1 is a JSON Schema superset, so nothing zod emits has to be
    // down-converted and lose meaning.
    expect(document['jsonSchemaDialect']).toBe('https://json-schema.org/draft/2020-12/schema');
  });

  it('has a unique operation id for every operation', () => {
    const ids = OPERATIONS.map((entry) => entry.operationId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('describes a request body from the same schema the controller validates', () => {
    const body = operation('/v1/brands', 'post')['requestBody'];
    expect(body).toBeDefined();
    const schema = JSON.stringify(body);
    // These fields exist in the document because they exist in the validator,
    // not because someone wrote them down twice.
    expect(schema).toContain('ianaTimeZone');
    expect(schema).toContain('defaultLocale');
  });

  it('marks the idempotency header required exactly on the routes that need it', () => {
    const create = parameters('/v1/brands', 'post').find(
      (parameter) => parameter['name'] === 'idempotency-key',
    );
    expect(create?.['required']).toBe(true);

    const read = parameters('/v1/brands', 'get').find(
      (parameter) => parameter['name'] === 'idempotency-key',
    );
    expect(read).toBeUndefined();
  });

  it('documents the error contract on every operation', () => {
    for (const entry of OPERATIONS) {
      const responses = operation(entry.path, entry.method)['responses'];
      const codes = Object.keys(Object.fromEntries(Object.entries(responses as object)));
      expect(codes).toContain('401');
      expect(codes).toContain('404');
      expect(codes).toContain('429');
    }
  });

  it('publishes the problem document schema clients parse errors with', () => {
    const components = document['components'];
    const schemas = (components as Record<string, unknown>)['schemas'];
    const problem = JSON.stringify((schemas as Record<string, unknown>)['Problem']);
    expect(problem).toContain('messageKey');
    expect(problem).toContain('retryable');
  });

  it('declares no security requirement on a public route and one everywhere else', () => {
    expect(operation('/healthz', 'get')['security']).toEqual([]);
    expect(operation('/v1/brands', 'get')['security']).not.toEqual([]);
  });

  it('carries the required scopes so a consent screen can be generated from it', () => {
    const security = operation('/v1/publications', 'post')['security'];
    expect(JSON.stringify(security)).toContain('posts:publish');
  });

  it('flags step-up routes so a client can prompt before it calls them', () => {
    expect(operation('/v1/api-keys', 'post')['x-relay-step-up']).toBe(true);
    expect(operation('/v1/brands', 'post')['x-relay-step-up']).toBeUndefined();
  });
});
