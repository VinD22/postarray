import { readFile } from 'node:fs/promises';

import { RelayError } from '@relay/contracts';
import {
  ACTIVE_LOCALE_CODES,
  DEFAULT_LOCALE,
  createTranslator,
  loadCatalog,
  resolveLocale,
} from '@relay/i18n';
import type { Translator } from '@relay/i18n';

import { createApiClient } from './api/client';
import type { ApiClient, FetchLike } from './api/client';
import { TOKEN_ENV_VAR } from './config/credentials';
import type { CredentialStore, StoredCredential } from './config/credentials';
import { resolveProfile } from './config/store';
import type { CliConfig, ConfigStore, Profile } from './config/store';
import { createFetchTransport } from './auth/oauth';
import type { OAuthTransport } from './auth/oauth';
import { processWriter } from './output';
import type { Writer } from './output';

/**
 * Everything a command needs, assembled once.
 *
 * A command receives this and never reads `process.env`, never touches the file
 * system and never constructs an HTTP client. That is what makes every command
 * testable without a network, a home directory or a token.
 */

export interface CliEnvironment {
  readonly RELAY_API_URL?: string | undefined;
  readonly RELAY_TOKEN?: string | undefined;
  readonly RELAY_WORKSPACE_ID?: string | undefined;
  readonly RELAY_PROFILE?: string | undefined;
  readonly RELAY_CLIENT_ID?: string | undefined;
  readonly API_URL?: string | undefined;
  readonly NO_COLOR?: string | undefined;
  readonly RELAY_LOCALE?: string | undefined;
  readonly LC_ALL?: string | undefined;
  readonly LC_MESSAGES?: string | undefined;
  readonly LANG?: string | undefined;
}

export interface GlobalOptions {
  readonly json: boolean;
  readonly profile?: string | undefined;
  readonly apiUrl?: string | undefined;
  readonly workspaceId?: string | undefined;
  readonly dryRun: boolean;
  readonly yes: boolean;
  readonly locale?: string | undefined;
}

export interface Clock {
  now(): number;
}

export const systemClock: Clock = { now: () => Date.now() };

/** ISO instant for an epoch millisecond value. */
export function toIsoInstant(epochMs: number): string {
  return new Date(epochMs).toISOString();
}

/** Reads a local file. Injected so `media upload` is testable without a disk. */
export type FileReader = (path: string) => Promise<Uint8Array>;

export const nodeFileReader: FileReader = async (path) => new Uint8Array(await readFile(path));

export interface CliDeps {
  readonly configStore: ConfigStore;
  readonly credentialStore: CredentialStore;
  readonly env: CliEnvironment;
  readonly writer?: Writer;
  readonly fetch?: FetchLike;
  readonly oauthTransport?: OAuthTransport;
  readonly clock?: Clock;
  readonly readFile?: FileReader;
}

export interface CliContext {
  readonly options: GlobalOptions;
  readonly profileName: string;
  readonly profile: Profile;
  readonly config: CliConfig;
  readonly apiUrl: string;
  readonly workspaceId: string | null;
  readonly locale: string;
  readonly translator: Translator;
  readonly writer: Writer;
  readonly clock: Clock;
  readonly deps: CliDeps & { readonly readFile: FileReader };
  readonly oauthTransport: OAuthTransport;
  readonly clientId: string;
  /** Present only when a credential exists. Never rendered. */
  readonly credential: StoredCredential | null;
  api(): ApiClient;
}

/** The first-party public client id the CLI identifies itself as. */
export const DEFAULT_CLIENT_ID = 'rly_pk_relay_cli';

/** Resolve a human-facing locale without widening the API's locale contract. */
export function resolveCliLocale(
  options: Pick<GlobalOptions, 'locale'>,
  profile: Pick<Profile, 'locale'>,
  env: Pick<CliEnvironment, 'RELAY_LOCALE' | 'LC_ALL' | 'LC_MESSAGES' | 'LANG'>,
): string {
  const requested =
    options.locale ??
    profile.locale ??
    env.RELAY_LOCALE ??
    env.LC_ALL ??
    env.LC_MESSAGES ??
    env.LANG;
  // POSIX environments commonly expose values such as `pt_BR.UTF-8` or
  // `de_DE@euro`, while the locale registry uses BCP-47. Strip the encoding
  // and modifier before handing the value to the shared resolver.
  const bcp47 = requested?.trim().split(/[.@]/, 1)[0]?.replace(/_/g, '-');
  return resolveLocale(bcp47 ?? null, ACTIVE_LOCALE_CODES, DEFAULT_LOCALE);
}

function requireApiUrl(candidate: string | undefined): string {
  if (candidate === undefined || candidate.trim().length === 0) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'API_URL_NOT_CONFIGURED', hint: 'relay config set apiUrl <url>' },
    });
  }
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'https:' && url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') {
      // Bearer tokens over plaintext to a remote host is not a thing we do.
      throw new RelayError('VALIDATION_FAILED', {
        messageKey: 'error.request_invalid.message',
        details: { reason: 'API_URL_INSECURE' },
      });
    }
    return url.toString();
  } catch (error) {
    if (RelayError.is(error)) {
      throw error;
    }
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'API_URL_MALFORMED' },
      cause: error,
    });
  }
}

export async function createContext(options: GlobalOptions, deps: CliDeps): Promise<CliContext> {
  const config = await deps.configStore.read();
  const profileName = options.profile ?? deps.env.RELAY_PROFILE ?? config.defaultProfile;
  const { profile } = resolveProfile(config, profileName);
  const credential = await deps.credentialStore.get(profileName);

  const apiUrl = requireApiUrl(
    options.apiUrl ??
      deps.env.RELAY_API_URL ??
      profile.apiUrl ??
      credential?.apiUrl ??
      deps.env.API_URL,
  );

  const workspaceId =
    options.workspaceId ??
    deps.env.RELAY_WORKSPACE_ID ??
    profile.workspaceId ??
    credential?.workspaceId ??
    null;

  const locale = resolveCliLocale(options, profile, deps.env);
  const translator = createTranslator(locale, await loadCatalog(locale));
  const writer = deps.writer ?? processWriter;
  const clock = deps.clock ?? systemClock;
  const oauthTransport = deps.oauthTransport ?? createFetchTransport();
  const clientId = deps.env.RELAY_CLIENT_ID ?? DEFAULT_CLIENT_ID;

  /**
   * Token resolution order: the environment (for CI, where a file is awkward),
   * then the credential file. Never `argv`, which is why there is no third
   * option here.
   */
  const accessToken = deps.env[TOKEN_ENV_VAR] ?? credential?.accessToken ?? null;

  return {
    options,
    profileName,
    profile,
    config,
    apiUrl,
    workspaceId,
    locale,
    translator,
    writer,
    clock,
    deps: { ...deps, readFile: deps.readFile ?? nodeFileReader },
    oauthTransport,
    clientId,
    credential,
    api(): ApiClient {
      return createApiClient({
        baseUrl: apiUrl,
        accessToken,
        workspaceId,
        locale,
        ...(deps.fetch === undefined ? {} : { fetch: deps.fetch }),
      });
    },
  };
}

/** Fail early and clearly rather than sending an unauthenticated request. */
export function requireCredential(context: CliContext): StoredCredential {
  const fromEnv = context.deps.env[TOKEN_ENV_VAR];
  if (context.credential === null && (fromEnv === undefined || fromEnv.length === 0)) {
    throw new RelayError('AUTH_REQUIRED', {
      messageKey: 'error.unauthenticated.message',
      details: { hint: 'relay auth login' },
    });
  }
  if (context.credential !== null) {
    return context.credential;
  }
  return {
    accessToken: fromEnv ?? '',
    refreshToken: null,
    expiresAt: null,
    tokenType: 'Bearer',
    scopes: [],
    subject: 'environment',
    workspaceId: context.workspaceId ?? 'unknown',
    apiUrl: context.apiUrl,
    issuer: context.apiUrl,
    obtainedAt: toIsoInstant(context.clock.now()),
  };
}
