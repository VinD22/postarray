# Provider adapter assumptions about the connector package core

These adapters live in `packages/connectors/src/providers/**` and are owned by the
provider-adapter author. Everything they import from `../contract.js`, `../http.js`,
`../oauth.js`, `../errors.js` and `../vault.js` is owned by the connector package author.

At the time these adapters were written those four modules did not exist yet, so this file
records the exact surface the adapters were written against. If the core lands with a
different shape, reconcile here first and then adjust the adapters, because every adapter
uses the same surface and a change is a single mechanical edit.

Verification date for every provider fact used below: **4 August 2026**
(`docs/research/06-source-register.md`).

## `../contract.js`

```ts
export const CONNECTOR_CONTRACT_VERSION: string;

export interface Clock { now(): Date }

export interface ConnectorLogger {
  debug(bindings: Record<string, unknown>, message: string): void;
  info(bindings: Record<string, unknown>, message: string): void;
  warn(bindings: Record<string, unknown>, message: string): void;
  error(bindings: Record<string, unknown>, message: string): void;
}

export interface ConnectorDeps {
  readonly http: HttpClient;                  // ../http.js
  readonly vault: ConnectorVault;             // ../vault.js
  readonly logger: ConnectorLogger;
  readonly clock: Clock;
  readonly config: ConnectorConfig;           // RelayConfig from @relay/config
  readonly redirectBaseUrl: string;           // public https origin of the API
}

export interface ConnectorConfig {
  readonly providers: {
    readonly x: { readonly clientId?: string; readonly clientSecret?: string };
    readonly linkedin: { readonly clientId?: string; readonly clientSecret?: string };
    readonly meta: { readonly appId?: string; readonly appSecret?: string };
    readonly google: { readonly clientId?: string; readonly clientSecret?: string };
    readonly tiktok: { readonly clientKey?: string; readonly clientSecret?: string };
    readonly bluesky: { readonly serviceUrl?: string };
  };
}

export interface ProviderIdentity { ... }              // see providers/shared/types-note
export interface AuthorizationDefinition { ... }
export interface OAuthGrant { ... }
export interface ExternalAccount { ... }
export interface ProviderConnection { ... }
export interface ProviderDraft { ... }
export interface PublishRequest { ... }
export interface PublishResult { ... }
export interface PublishStatus { ... }
export interface SocialConnector { ... }
export interface ConnectorRegistry {
  register(connector: SocialConnector): void;
  markUnavailable(provider: ProviderId, status: string): void;
}
```

The precise field lists are reproduced, with comments, in
`src/providers/shared/contract-shape.ts`, which re-exports the core types so that a
mismatch shows up in exactly one file per concept rather than in thirty.

## `../http.js`

```ts
export interface HttpRequest {
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly url: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
  readonly json?: unknown;
  readonly form?: Readonly<Record<string, string>>;
  readonly body?: Uint8Array | string;
  readonly accept?: 'json' | 'text' | 'binary' | 'none';
  readonly timeoutMs?: number;
  readonly provider: string;
  readonly operation: string;
}

export interface HttpResponse {
  readonly status: number;
  readonly ok: boolean;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: unknown;   // parsed JSON when `accept: 'json'`, otherwise the raw text
  readonly text: string;
  readonly bytes: Uint8Array;   // populated when `accept: 'binary'`, empty otherwise
}

export interface HttpClient {
  request(input: HttpRequest): Promise<HttpResponse>;   // never throws on a non-2xx status
}
```

`request` resolves for every HTTP status. It throws only for a transport failure, and then
it throws a `RelayError` classified as `PROVIDER_UNAVAILABLE` or `PROVIDER_TRANSIENT`. This
is deliberate: an adapter has to read a non-2xx body to distinguish a duplicate-content
rejection from a rate limit, so the client must not swallow it.

## `../errors.js`

```ts
export interface ProviderFailureContext {
  readonly provider: ProviderId;
  readonly operation: string;
  readonly response?: HttpResponse;
  readonly cause?: unknown;
  readonly remediationKey?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

/** Classifies through @relay/observability and maps to a RelayError with a messageKey. */
export function providerFailure(context: ProviderFailureContext): RelayError;

/** Throws providerFailure(...) when `response.ok` is false. Returns void otherwise. */
export function ensureOk(response: HttpResponse, context: ProviderFailureContext): void;

/** Parse a provider body with zod; a parse failure becomes an UNKNOWN RelayError. */
export function parseProviderBody<T>(
  schema: { parse(value: unknown): T },
  response: HttpResponse,
  context: ProviderFailureContext,
): T;

export const REMEDIATION: {
  readonly reconnectAccount: 'reconnect_account';
  readonly grantAdditionalPermission: 'grant_additional_permission';
  readonly pageRoleRequired: 'page_role_required';
  readonly switchToProfessionalAccount: 'switch_to_professional_account';
  readonly choosePrivacyOption: 'choose_privacy_option';
  readonly contentTooLong: 'content_too_long';
  readonly mediaInvalid: 'media_invalid';
  readonly duplicateContent: 'duplicate_content';
  readonly providerRateLimited: 'provider_rate_limited';
  readonly quotaExhausted: 'quota_exhausted';
  readonly usageBalanceRequired: 'usage_balance_required';
  readonly awaitingProviderApproval: 'awaiting_provider_approval';
  readonly providerRejectedContent: 'provider_rejected_content';
  readonly commentFailedRootPublished: 'comment_failed_root_published';
  readonly contactSupport: 'contact_support';
};
```

## `../oauth.js`

```ts
export interface OAuth2RefreshInput {
  readonly http: HttpClient;
  readonly provider: ProviderId;
  readonly tokenUrl: string;
  readonly clientId: string;
  readonly clientSecret?: string;
  readonly refreshToken: string;
  readonly extraForm?: Readonly<Record<string, string>>;
  readonly basicAuth?: boolean;
  readonly clock: Clock;
}

/** Standard RFC 6749 refresh_token grant, returning a CredentialResult. */
export function refreshOAuth2Token(input: OAuth2RefreshInput): Promise<CredentialResult>;
```

## `../vault.js`

```ts
export type CredentialRef = string;   // opaque handle, never a token

export interface ConnectorVault {
  /** Resolve a short-lived bearer token for a connection. Never logged, never returned. */
  getAccessToken(ref: CredentialRef): Promise<string>;
  /** Non-OAuth secret material, for example a Bluesky app password. */
  getSecret(ref: CredentialRef, name: string): Promise<string>;
}
```

## Rules these adapters follow without exception

1. No adapter logs, returns, or embeds a token, a secret, or a raw provider payload.
2. Every provider response is parsed with zod before a field is read.
3. `publish` reports `published` only with an external post id from the provider.
4. A capability we have not shipped is `not_implemented`; one the provider does not offer is
   `unsupported`; one gated behind an app review we have not completed is `requires_review`.
5. No scraping, no cookie replay, no unofficial endpoint, no browser automation.
