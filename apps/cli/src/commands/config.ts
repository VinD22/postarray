import { RelayError } from '@relay/contracts';

import {
  CONFIG_KEYS,
  getProfileValue,
  resolveProfile,
  setProfileValue,
  unsetProfileValue,
} from '../config/store.js';
import type { ConfigKey } from '../config/store.js';
import type { CliContext } from '../context.js';
import { renderSuccess, renderTable } from '../output.js';
import type { RenderInput } from '../output.js';

/**
 * `relay config`.
 *
 * Only non-sensitive settings live here. There is no `relay config set token`,
 * because a token belongs in the credential file with its own permissions, and
 * a config file is the thing people paste into support conversations.
 */

const SETTABLE_KEYS = CONFIG_KEYS.filter((key): key is Exclude<ConfigKey, 'profile'> => key !== 'profile');

function assertSettable(key: string): Exclude<ConfigKey, 'profile'> {
  const match = SETTABLE_KEYS.find((candidate) => candidate === key);
  if (match === undefined) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'UNKNOWN_CONFIG_KEY', key, allowed: [...SETTABLE_KEYS] },
    });
  }
  return match;
}

export async function configSet(
  context: CliContext,
  render: RenderInput,
  key: string,
  value: string,
): Promise<void> {
  if (key === 'profile') {
    const next = { ...context.config, defaultProfile: value };
    await context.deps.configStore.write(next);
    renderSuccess(render, { defaultProfile: value }, [`defaultProfile=${value}`]);
    return;
  }

  const settable = assertSettable(key);
  const next = setProfileValue(context.config, context.profileName, settable, value);
  await context.deps.configStore.write(next);
  renderSuccess(render, { profile: context.profileName, key: settable, value }, [
    `profile=${context.profileName}`,
    `${settable}=${value}`,
  ]);
}

export async function configUnset(
  context: CliContext,
  render: RenderInput,
  key: string,
): Promise<void> {
  const settable = assertSettable(key);
  const next = unsetProfileValue(context.config, context.profileName, settable);
  await context.deps.configStore.write(next);
  renderSuccess(render, { profile: context.profileName, key: settable, value: null }, [
    `profile=${context.profileName}`,
    `${settable}=`,
  ]);
}

export async function configGet(
  context: CliContext,
  render: RenderInput,
  key?: string,
): Promise<void> {
  const { profile } = resolveProfile(context.config, context.profileName);

  if (key !== undefined) {
    if (key === 'profile') {
      renderSuccess(render, { profile: context.profileName }, [`profile=${context.profileName}`]);
      return;
    }
    const settable = assertSettable(key);
    const value = getProfileValue(profile, settable);
    renderSuccess(render, { key: settable, value }, [`${settable}=${value ?? ''}`]);
    return;
  }

  const rows: (readonly string[])[] = [
    ['profile', context.profileName],
    ['configFile', context.deps.configStore.path],
    ['credentialFile', context.deps.credentialStore.path],
    ['apiUrl', getProfileValue(profile, 'apiUrl') ?? context.apiUrl],
    ['workspaceId', getProfileValue(profile, 'workspaceId') ?? context.workspaceId ?? ''],
    ['locale', getProfileValue(profile, 'locale') ?? context.locale],
    ['output', getProfileValue(profile, 'output') ?? 'human'],
  ];

  renderSuccess(
    render,
    {
      profile: context.profileName,
      configFile: context.deps.configStore.path,
      credentialFile: context.deps.credentialStore.path,
      values: Object.fromEntries(rows.map((row) => [row[0] ?? '', row[1] ?? ''])),
    },
    renderTable(['key', 'value'], rows),
  );
}
