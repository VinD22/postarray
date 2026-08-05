import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { z } from 'zod';
import { RelayError, localeSchema } from '@relay/contracts';

import { configFilePath } from './paths.js';

/**
 * The configuration file.
 *
 * Profiles exist because one person routinely works against a sandbox and a
 * production workspace, and mixing them up is the kind of mistake that
 * publishes to a real audience. The active profile is always printable, and
 * every consequential command echoes it.
 */

export const CONFIG_KEYS = ['apiUrl', 'workspaceId', 'locale', 'output', 'profile'] as const;
export type ConfigKey = (typeof CONFIG_KEYS)[number];

export const outputModeSchema = z.enum(['human', 'json']);
export type OutputMode = z.infer<typeof outputModeSchema>;

export const profileSchema = z
  .object({
    apiUrl: z.string().min(1).optional(),
    workspaceId: z.string().min(1).optional(),
    locale: localeSchema.optional(),
    output: outputModeSchema.optional(),
  })
  .strict();
export type Profile = z.infer<typeof profileSchema>;

export const cliConfigSchema = z
  .object({
    version: z.literal(1).default(1),
    defaultProfile: z.string().min(1).default('default'),
    profiles: z.record(z.string().min(1), profileSchema).default({}),
  })
  .strict();
export type CliConfig = z.infer<typeof cliConfigSchema>;

export const EMPTY_CONFIG: CliConfig = { version: 1, defaultProfile: 'default', profiles: {} };

export interface ConfigStore {
  read(): Promise<CliConfig>;
  write(config: CliConfig): Promise<void>;
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

async function readJsonFile(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as unknown;
  } catch (error) {
    if (errorCode(error) === 'ENOENT') {
      return undefined;
    }
    if (error instanceof SyntaxError) {
      throw new RelayError('VALIDATION_FAILED', {
        messageKey: 'error.request_invalid.message',
        details: { file: 'config' },
        cause: error,
      });
    }
    throw error;
  }
}

export function createFileConfigStore(path: string = configFilePath()): ConfigStore {
  return {
    path,
    async read(): Promise<CliConfig> {
      const raw = await readJsonFile(path);
      if (raw === undefined) {
        return EMPTY_CONFIG;
      }
      // Parse, do not cast: a hand-edited config file is external input.
      return cliConfigSchema.parse(raw);
    },
    async write(config: CliConfig): Promise<void> {
      await mkdir(dirname(path), { recursive: true, mode: 0o700 });
      await writeFile(path, `${JSON.stringify(cliConfigSchema.parse(config), null, 2)}\n`, {
        encoding: 'utf8',
        mode: 0o600,
      });
    },
  };
}

/** An in-memory store for tests. */
export function createMemoryConfigStore(initial: CliConfig = EMPTY_CONFIG): ConfigStore {
  let current = cliConfigSchema.parse(initial);
  return {
    path: '<memory>',
    read: async () => current,
    write: async (config: CliConfig) => {
      current = cliConfigSchema.parse(config);
    },
  };
}

export function resolveProfile(
  config: CliConfig,
  requested?: string,
): { name: string; profile: Profile } {
  const name = requested ?? config.defaultProfile;
  return { name, profile: config.profiles[name] ?? {} };
}

export function setProfileValue(
  config: CliConfig,
  profileName: string,
  key: Exclude<ConfigKey, 'profile'>,
  value: string,
): CliConfig {
  const existing = config.profiles[profileName] ?? {};
  const next: Record<string, unknown> = { ...existing, [key]: value };
  const profile = profileSchema.parse(next);
  return { ...config, profiles: { ...config.profiles, [profileName]: profile } };
}

export function unsetProfileValue(
  config: CliConfig,
  profileName: string,
  key: Exclude<ConfigKey, 'profile'>,
): CliConfig {
  const existing: Record<string, unknown> = { ...(config.profiles[profileName] ?? {}) };
  delete existing[key];
  return {
    ...config,
    profiles: { ...config.profiles, [profileName]: profileSchema.parse(existing) },
  };
}

export function getProfileValue(
  profile: Profile,
  key: Exclude<ConfigKey, 'profile'>,
): string | null {
  const value = profile[key];
  return value === undefined ? null : value;
}
