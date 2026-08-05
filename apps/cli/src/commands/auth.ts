import { RelayError, normalizeScopes } from '@relay/contracts';
import type { Scope } from '@relay/contracts';

import { ROUTES } from '../api/routes.js';
import { principalSchema } from '../api/schemas.js';
import { summarize } from '../config/credentials.js';
import type { StoredCredential } from '../config/credentials.js';
import { authorizationCodeLogin, deviceLogin, revokeToken } from '../auth/oauth.js';
import { toIsoInstant } from '../context.js';
import type { CliContext } from '../context.js';
import { renderSuccess, renderTable } from '../output.js';
import type { RenderInput } from '../output.js';

/**
 * `relay auth`.
 *
 * `login` obtains a scoped grant, `logout` revokes it at the issuer before
 * forgetting it locally, and `whoami` answers the only question that matters
 * before a consequential command: what am I, where, and with what permission.
 *
 * No command in this file ever prints a token.
 */

export const DEFAULT_LOGIN_SCOPES: readonly Scope[] = [
  'accounts:read',
  'drafts:read',
  'drafts:write',
  'analytics:read',
  'growth:read',
  'rules:read',
];

export type LoginFlow = 'device' | 'authorization-code';

export interface LoginOptions {
  readonly flow: LoginFlow;
  readonly scopes: readonly string[];
  readonly workspaceId?: string | undefined;
}

function parseScopes(requested: readonly string[]): readonly Scope[] {
  if (requested.length === 0) {
    return DEFAULT_LOGIN_SCOPES;
  }
  const normalized = normalizeScopes(requested);
  if (normalized.length !== requested.length) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'UNKNOWN_SCOPE' },
    });
  }
  return normalized;
}

export async function authLogin(
  context: CliContext,
  render: RenderInput,
  options: LoginOptions,
): Promise<void> {
  const scopes = parseScopes(options.scopes);
  const shared = {
    apiUrl: context.apiUrl,
    clientId: context.clientId,
    scopes,
    transport: context.oauthTransport,
    workspaceId: options.workspaceId ?? context.workspaceId,
  };

  const prompts: string[] = [];
  const result =
    options.flow === 'device'
      ? await deviceLogin({
          ...shared,
          onPrompt: (authorization) => {
            // The verification URL and the user code are not secrets. They are
            // useless without the person who is about to approve them.
            prompts.push(`verificationUri=${authorization.verification_uri}`);
            prompts.push(`userCode=${authorization.user_code}`);
            if (authorization.verification_uri_complete !== undefined) {
              prompts.push(`verificationUriComplete=${authorization.verification_uri_complete}`);
            }
            if (!render.json) {
              for (const line of prompts) {
                render.writer.err(line);
              }
            }
          },
        })
      : await authorizationCodeLogin({
          ...shared,
          onPrompt: (authorizationUrl) => {
            prompts.push(`authorizationUrl=${authorizationUrl}`);
            if (!render.json) {
              render.writer.err(`authorizationUrl=${authorizationUrl}`);
            }
          },
        });

  const now = context.clock.now();
  const credential: StoredCredential = {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresAt:
      result.expiresInSeconds === null ? null : toIsoInstant(now + result.expiresInSeconds * 1000),
    tokenType: 'Bearer',
    scopes: [...result.scopes],
    subject: result.subject,
    workspaceId: result.workspaceId,
    apiUrl: context.apiUrl,
    issuer: result.issuer,
    obtainedAt: toIsoInstant(now),
  };
  await context.deps.credentialStore.put(context.profileName, credential);

  const summary = summarize(credential);
  renderSuccess(render, { profile: context.profileName, credential: summary }, [
    `profile=${context.profileName}`,
    `subject=${summary.subject}`,
    `workspaceId=${summary.workspaceId}`,
    `scopes=${summary.scopes.join(',')}`,
    `expiresAt=${summary.expiresAt ?? 'never'}`,
    `credentialFile=${context.deps.credentialStore.path}`,
  ]);
}

export async function authLogout(context: CliContext, render: RenderInput): Promise<void> {
  const credential = context.credential;
  let revoked = false;
  if (credential !== null) {
    try {
      revoked = await revokeToken(
        context.apiUrl,
        context.oauthTransport,
        context.clientId,
        credential.accessToken,
      );
    } catch {
      // Forgetting the local copy still has to happen. A token we cannot reach
      // the issuer to revoke is exactly the one we most want off this disk.
      revoked = false;
    }
  }
  const removed = await context.deps.credentialStore.remove(context.profileName);

  renderSuccess(render, { profile: context.profileName, revoked, removed }, [
    `profile=${context.profileName}`,
    `revokedAtIssuer=${String(revoked)}`,
    `removedLocally=${String(removed)}`,
  ]);
}

export async function authWhoAmI(context: CliContext, render: RenderInput): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.me(),
    schema: principalSchema,
  });
  const principal = response.data;
  const local = context.credential === null ? null : summarize(context.credential);

  renderSuccess(
    { ...render, correlationId: response.correlationId },
    { principal, credential: local, profile: context.profileName, workspaceId: context.workspaceId },
    [
      ...renderTable(
        ['field', 'value'],
        [
          ['profile', context.profileName],
          ['actorType', principal.actorType],
          ['subject', principal.userId ?? local?.subject ?? 'unknown'],
          // A credential can be valid for several workspaces. The one in use is
          // shown separately so it is never mistaken for the only one.
          ['workspaceInUse', context.workspaceId ?? 'unset'],
          ['workspacesGranted', principal.workspaceIds.join(',')],
          ['approvalLevel', principal.approvalLevel],
          ['scopes', principal.scopes.join(',')],
          ['locale', principal.locale],
          ['apiUrl', context.apiUrl],
          ['expiresAt', local?.expiresAt ?? 'unknown'],
        ],
      ),
    ],
  );
}
