/**
 * `@relay/connectors`
 *
 * The versioned connector contract, the registry, the shared provider HTTP
 * client, the SSRF guard, the error taxonomy, the OAuth helpers, the credential
 * vault, the duplicate publication guard, the capability drift check and the
 * fake provider.
 *
 * This package depends on `@relay/contracts` and `@relay/config` and on nothing
 * else in the workspace. It never imports `@relay/application` or
 * `@relay/database`: dependencies point inward, and a connector owns no
 * business logic. Scheduling, approval, cadence, duplicate policy and receipts
 * live in `packages/application`.
 */

export * from './ports';
export * from './contract';
export * from './errors';
export * from './sanitize';
export * from './ssrf';
export * from './http';
export * from './oauth';
export * from './vault';
export * from './registry';
export * from './idempotency';
export * from './capability-diff';
export * from './fake/index';

// Provider adapters. This barrel is owned by the provider adapter work and is
// the only place a concrete provider is exported from.
export * from './providers/index';
