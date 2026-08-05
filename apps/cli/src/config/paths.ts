import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * Where the CLI keeps state.
 *
 * Configuration and credentials live in two different files on purpose.
 * Configuration is boring and safe to paste into an issue. Credentials are not,
 * and they get their own file with its own permissions so `cat config.json`
 * during a support conversation can never leak a token.
 */

export const CONFIG_DIR_NAME = 'relay';
export const CONFIG_FILE_NAME = 'config.json';
export const CREDENTIALS_FILE_NAME = 'credentials.json';

export interface PathEnvironment {
  readonly RELAY_CONFIG_DIR?: string | undefined;
  readonly XDG_CONFIG_HOME?: string | undefined;
}

/** Honours `RELAY_CONFIG_DIR`, then `XDG_CONFIG_HOME`, then `~/.config`. */
export function configDir(env: PathEnvironment = process.env, home: string = homedir()): string {
  const explicit = env.RELAY_CONFIG_DIR?.trim();
  if (explicit !== undefined && explicit.length > 0) {
    return explicit;
  }
  const xdg = env.XDG_CONFIG_HOME?.trim();
  if (xdg !== undefined && xdg.length > 0) {
    return join(xdg, CONFIG_DIR_NAME);
  }
  return join(home, '.config', CONFIG_DIR_NAME);
}

export function configFilePath(env?: PathEnvironment, home?: string): string {
  return join(configDir(env, home), CONFIG_FILE_NAME);
}

export function credentialsFilePath(env?: PathEnvironment, home?: string): string {
  return join(configDir(env, home), CREDENTIALS_FILE_NAME);
}
