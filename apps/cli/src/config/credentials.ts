import { chmod, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { z } from 'zod';
import { RelayError, scopeSchema } from '@relay/contracts';

import { credentialsFilePath } from './paths';

/**
 * The credential file.
 *
 * Rules that are not negotiable:
 *
 * - A token is never accepted from `argv`. Process arguments are visible to
 *   every other process on the machine and end up in shell history. There is no
 *   `--token` flag, and `assertNoTokenInArgv` fails the command if someone
 *   invents one.
 * - A token is never printed. `whoami` shows the subject, the workspace, the
 *   scopes and the expiry, and nothing that could be replayed.
 * - The file is written `0600` inside a `0700` directory, and a file with wider
 *   permissions is refused rather than silently used.
 */

export const storedCredentialSchema = z
  .object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1).nullable(),
    /** ISO instant. */
    expiresAt: z.string().min(1).nullable(),
    tokenType: z.literal('Bearer'),
    scopes: z.array(scopeSchema),
    subject: z.string().min(1),
    workspaceId: z.string().min(1),
    apiUrl: z.string().min(1),
    issuer: z.string().min(1),
    obtainedAt: z.string().min(1),
  })
  .strict();
export type StoredCredential = z.infer<typeof storedCredentialSchema>;

export const credentialFileSchema = z
  .object({
    version: z.literal(1).default(1),
    profiles: z.record(z.string().min(1), storedCredentialSchema).default({}),
  })
  .strict();
export type CredentialFile = z.infer<typeof credentialFileSchema>;

export const EMPTY_CREDENTIALS: CredentialFile = { version: 1, profiles: {} };

/** What may be shown to a person or written to a log. Never the token itself. */
export interface CredentialSummary {
  readonly subject: string;
  readonly workspaceId: string;
  readonly scopes: readonly string[];
  readonly apiUrl: string;
  readonly issuer: string;
  readonly expiresAt: string | null;
  readonly obtainedAt: string;
  readonly hasRefreshToken: boolean;
}

export function summarize(credential: StoredCredential): CredentialSummary {
  return {
    subject: credential.subject,
    workspaceId: credential.workspaceId,
    scopes: credential.scopes,
    apiUrl: credential.apiUrl,
    issuer: credential.issuer,
    expiresAt: credential.expiresAt,
    obtainedAt: credential.obtainedAt,
    hasRefreshToken: credential.refreshToken !== null,
  };
}

export interface CredentialStore {
  read(): Promise<CredentialFile>;
  get(profile: string): Promise<StoredCredential | null>;
  put(profile: string, credential: StoredCredential): Promise<void>;
  remove(profile: string): Promise<boolean>;
  readonly path: string;
}

/** Node's file system errors carry a `code`. Read it without asserting a shape. */
function errorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }
  const code = Reflect.get(error, 'code');
  return typeof code === 'string' ? code : undefined;
}

const OWNER_ONLY = 0o600;
const GROUP_OR_WORLD = 0o077;

export function createFileCredentialStore(path: string = credentialsFilePath()): CredentialStore {
  const load = async (): Promise<CredentialFile> => {
    let raw: string;
    try {
      const info = await stat(path);
      if ((info.mode & GROUP_OR_WORLD) !== 0) {
        // Tightening it silently would hide a real problem: something wrote this
        // file with loose permissions, and the token may already have leaked.
        throw new RelayError('AUTH_REQUIRED', {
          messageKey: 'error.session_expired.message',
          details: { reason: 'CREDENTIAL_FILE_PERMISSIONS', expectedMode: '0600' },
        });
      }
      raw = await readFile(path, 'utf8');
    } catch (error) {
      if (RelayError.is(error)) {
        throw error;
      }
      if (errorCode(error) === 'ENOENT') {
        return EMPTY_CREDENTIALS;
      }
      throw error;
    }
    try {
      return credentialFileSchema.parse(JSON.parse(raw) as unknown);
    } catch (error) {
      throw new RelayError('AUTH_REQUIRED', {
        messageKey: 'error.session_expired.message',
        details: { reason: 'CREDENTIAL_FILE_UNREADABLE' },
        cause: error,
      });
    }
  };

  const save = async (file: CredentialFile): Promise<void> => {
    await mkdir(dirname(path), { recursive: true, mode: 0o700 });
    await writeFile(path, `${JSON.stringify(credentialFileSchema.parse(file), null, 2)}\n`, {
      encoding: 'utf8',
      mode: OWNER_ONLY,
    });
    await chmod(path, OWNER_ONLY);
  };

  return {
    path,
    read: load,
    async get(profile: string): Promise<StoredCredential | null> {
      const file = await load();
      return file.profiles[profile] ?? null;
    },
    async put(profile: string, credential: StoredCredential): Promise<void> {
      const file = await load();
      await save({ ...file, profiles: { ...file.profiles, [profile]: credential } });
    },
    async remove(profile: string): Promise<boolean> {
      const file = await load();
      if (file.profiles[profile] === undefined) {
        return false;
      }
      const profiles = { ...file.profiles };
      delete profiles[profile];
      if (Object.keys(profiles).length === 0) {
        await rm(path, { force: true });
        return true;
      }
      await save({ ...file, profiles });
      return true;
    },
  };
}

export function createMemoryCredentialStore(
  initial: CredentialFile = EMPTY_CREDENTIALS,
): CredentialStore {
  let current = credentialFileSchema.parse(initial);
  return {
    path: '<memory>',
    read: async () => current,
    get: async (profile: string) => current.profiles[profile] ?? null,
    put: async (profile: string, credential: StoredCredential) => {
      current = { ...current, profiles: { ...current.profiles, [profile]: credential } };
    },
    remove: async (profile: string) => {
      if (current.profiles[profile] === undefined) {
        return false;
      }
      const profiles = { ...current.profiles };
      delete profiles[profile];
      current = { ...current, profiles };
      return true;
    },
  };
}

/** Argument names that must never carry a secret. */
export const FORBIDDEN_TOKEN_FLAGS: readonly string[] = [
  '--token',
  '--access-token',
  '--accesstoken',
  '--bearer',
  '--api-key',
  '--apikey',
  '--secret',
  '--client-secret',
  '--password',
];

/**
 * Refuse to run when a secret was passed on the command line.
 *
 * This is not paranoia. `ps` shows another user's arguments on most systems,
 * and the shell writes them to history. A credential belongs in the credential
 * file or in the environment, and nowhere else.
 */
export function assertNoTokenInArgv(argv: readonly string[]): void {
  for (const argument of argv) {
    const name = (argument.split('=')[0] ?? argument).toLowerCase();
    if (FORBIDDEN_TOKEN_FLAGS.includes(name)) {
      throw new RelayError('FORBIDDEN', {
        messageKey: 'error.forbidden.message',
        details: { reason: 'SECRET_IN_ARGV', flag: name },
      });
    }
  }
}

/** Environment variable a CI job may use instead of the credential file. */
export const TOKEN_ENV_VAR = 'RELAY_TOKEN';
