import type {
  ConnectionRef,
  ProviderDraft,
  ProviderErrorSummary,
  RemediationCode,
} from './contract-shape';

/**
 * Small translations between a connector's own vocabulary and the contract.
 *
 * These exist so the eight adapters read one field the same way instead of eight
 * slightly different ways, and so the reason a value lives where it lives is written
 * down exactly once.
 */

/**
 * Reveal the connection's bearer token for the duration of one provider call.
 *
 * `ConnectionRef.accessToken` is a `SecretHandle`: the plaintext exists only inside the
 * callback, and the handle refuses to serialize. Adapters build an `Authorization`
 * header from the result and never store or log it.
 */
export async function accessTokenOf(connection: ConnectionRef): Promise<string> {
  return await connection.accessToken.use((plaintext) => plaintext);
}

/** The `Authorization` header for a bearer token. */
export function bearerHeader(accessToken: string): Record<string, string> {
  return { authorization: `Bearer ${accessToken}` };
}

/**
 * The parent object an account hangs off: the Facebook Page behind an Instagram
 * professional account, for example. `ExternalAccount` carries it as a first class
 * field; a live `ConnectionRef` carries it in `metadata`, which is where the
 * application copies it when the connection row is written.
 */
export function parentExternalIdOf(connection: ConnectionRef): string | null {
  const value = connection.metadata['parentExternalId'];
  return typeof value === 'string' && value !== '' ? value : null;
}

/** A string field from the connection metadata, or null when it is absent. */
export function connectionMetadataString(connection: ConnectionRef, key: string): string | null {
  const value = connection.metadata[key];
  return typeof value === 'string' && value !== '' ? value : null;
}

/**
 * Provider specific options for a draft.
 *
 * The contract keeps the draft free of provider shaped fields, so per-connection
 * provider settings travel in `connection.metadata.providerOptions` and are parsed with
 * the provider's own strict schema. An unknown key is a validation error rather than a
 * silently ignored setting.
 */
export function providerOptionsOf(draft: ProviderDraft): unknown {
  return providerOptionsOfConnection(draft.connection);
}

/**
 * The same bag, for the calls that carry a connection but no draft, such as
 * media preparation.
 */
export function providerOptionsOfConnection(connection: ConnectionRef): unknown {
  const bag = connection.metadata['providerOptions'];
  return bag === undefined ? {} : bag;
}

/** Build the error summary that `PublishResult` and `PublishStatus` carry. */
export function errorSummary(input: {
  readonly errorClass: ProviderErrorSummary['errorClass'];
  readonly remediationCode: RemediationCode;
  readonly messageKey: string;
  readonly retryable: boolean;
  readonly providerMessage?: string | null;
}): ProviderErrorSummary {
  return {
    errorClass: input.errorClass,
    remediationCode: input.remediationCode,
    messageKey: input.messageKey,
    retryable: input.retryable,
    providerMessage: input.providerMessage ?? null,
  };
}

/** Locate a mention in the body so the preview can highlight the exact slice. */
export function mentionOffset(
  body: string,
  mention: { handle: string | null; displayLabel: string },
): {
  offset: number;
  length: number;
} | null {
  const candidates = [
    mention.handle === null
      ? null
      : mention.handle.startsWith('@')
        ? mention.handle
        : `@${mention.handle}`,
    mention.handle,
    mention.displayLabel,
  ].filter((value): value is string => value !== null && value !== '');
  for (const candidate of candidates) {
    const offset = body.indexOf(candidate);
    if (offset >= 0) {
      return { offset, length: candidate.length };
    }
  }
  return null;
}
