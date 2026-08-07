import { describe, expect, it } from 'vitest';

import { validationResultSchema } from '@relay/contracts';

import {
  CONNECTOR_CONTRACT_VERSION,
  CONNECTOR_FEATURES,
  CONNECTOR_SCHEMAS,
  NOT_IMPLEMENTED_FEATURES,
  OPTIONAL_METHOD_FEATURES,
  authorizationDefinitionSchema,
  canonicalPreviewSchema,
  providerIdentitySchema,
  publishResultSchema,
  publishStatusSchema,
} from './contract';
import {
  buildConnectorContractCases,
  CONTRACT_HARNESS_PROVIDERS,
} from './contract.harness';

/**
 * The shared connector contract suite.
 *
 * Every connector runs this unmodified. If a connector needs it changed, the
 * contract is wrong and that is a discussion, not a local override.
 */

describe('the contract itself', () => {
  it('is versioned', () => {
    expect(CONNECTOR_CONTRACT_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('starts every new adapter at not_implemented for every feature', () => {
    for (const feature of CONNECTOR_FEATURES) {
      expect(NOT_IMPLEMENTED_FEATURES[feature]).toBe('not_implemented');
    }
  });

  it('maps every optional method to a feature the registry can report', () => {
    for (const feature of Object.values(OPTIONAL_METHOD_FEATURES)) {
      expect(CONNECTOR_FEATURES).toContain(feature);
    }
  });

  it('exposes a schema for every value that crosses the boundary', () => {
    for (const [name, schema] of Object.entries(CONNECTOR_SCHEMAS)) {
      expect(schema, name).toBeDefined();
    }
  });
});

describe('publishStatus schema', () => {
  it('refuses "published" without external evidence', () => {
    const result = publishStatusSchema.safeParse({
      state: 'published',
      externalPostId: null,
      permalink: null,
      publishedAt: null,
      items: [],
      error: null,
      pollAfterSeconds: null,
      sanitizedResponse: {},
    });
    expect(result.success).toBe(false);
  });

  it('refuses "failed" without a classified error', () => {
    const result = publishStatusSchema.safeParse({
      state: 'failed',
      externalPostId: null,
      permalink: null,
      publishedAt: null,
      items: [],
      error: null,
      pollAfterSeconds: null,
      sanitizedResponse: {},
    });
    expect(result.success).toBe(false);
  });
});

describe('publishResult schema', () => {
  it('requires at least one failure on a partial result', () => {
    const result = publishResultSchema.safeParse({
      status: 'partial',
      externalPostId: 'p1',
      permalink: null,
      publishedAt: '2026-08-04T12:00:00.000Z',
      items: [],
      failures: [],
      sanitizedResponse: {},
      providerRequestId: null,
      costMinor: null,
      currency: null,
    });
    expect(result.success).toBe(false);
  });
});

describe('connector contract harness', () => {
  it('runs the shared suite against every registered harness provider', () => {
    const providers = buildConnectorContractCases().map((entry) => entry.provider);
    expect(providers).toEqual([...CONTRACT_HARNESS_PROVIDERS]);
  });
});

describe.each(buildConnectorContractCases())('$provider connector satisfies the contract', (contract) => {
  const { connector, connection, draft } = contract;

  it('returns a schema valid identity and authorization definition', () => {
    expect(providerIdentitySchema.safeParse(connector.identity()).success).toBe(true);
    expect(authorizationDefinitionSchema.safeParse(connector.authorization()).success).toBe(true);
  });

  it('returns schema valid discovery results', async () => {
    const accounts = await connector.discoverAccounts(contract.grant);
    for (const account of accounts) {
      expect(CONNECTOR_SCHEMAS.externalAccount.safeParse(account).success).toBe(true);
    }
  });

  it('returns a schema valid capability snapshot', async () => {
    const snapshot = await connector.getCapabilities(connection);
    expect(CONNECTOR_SCHEMAS.capabilitySnapshot.safeParse(snapshot).success).toBe(true);
  });

  it('returns a schema valid validation result', async () => {
    const result = await connector.validateDraft(draft);
    expect(validationResultSchema.safeParse(result).success).toBe(true);
  });

  it('returns a schema valid preview', async () => {
    const preview = await connector.preview(draft);
    expect(canonicalPreviewSchema.safeParse(preview).success).toBe(true);
  });

  it('returns schema valid prepared media', async () => {
    const prepared = await connector.prepareMedia(contract.mediaRequest);
    for (const entry of prepared) {
      expect(CONNECTOR_SCHEMAS.preparedMedia.safeParse(entry).success).toBe(true);
    }
  });

  it('returns a schema valid publish result and status', async () => {
    const result = await connector.publish(contract.publishRequest);
    expect(publishResultSchema.safeParse(result).success).toBe(true);
    const status = await connector.getStatus(contract.statusRequest);
    expect(publishStatusSchema.safeParse(status).success).toBe(true);
  });

  it('returns schema valid metric observations', async () => {
    const observations = await connector.fetchMetrics(contract.metricsRequest);
    for (const observation of observations) {
      expect(CONNECTOR_SCHEMAS.metricObservation.safeParse(observation).success).toBe(true);
    }
  });

  it('never leaks a credential through any returned value', async () => {
    const snapshot = await connector.getCapabilities(connection);
    const preview = await connector.preview(draft);
    const serialized = JSON.stringify({ snapshot, preview, identity: connector.identity() });
    expect(serialized).not.toContain(contract.forbiddenSecret);
  });
});
